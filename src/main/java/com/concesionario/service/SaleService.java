package com.concesionario.service;

import com.concesionario.dto.sale.SaleRequest;
import com.concesionario.dto.sale.SaleResponse;
import com.concesionario.entity.*;
import com.concesionario.exception.BadRequestException;
import com.concesionario.exception.ResourceNotFoundException;
import com.concesionario.mapper.SaleMapper;
import com.concesionario.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final SaleMapper saleMapper;

    @Transactional(readOnly = true)
    public List<SaleResponse> findAll() {
        return saleMapper.toResponseList(saleRepository.findAll());
    }

    @Transactional(readOnly = true)
    public SaleResponse findById(UUID id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada: " + id));
        return saleMapper.toResponse(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> findByCustomerId(UUID customerId) {
        return saleMapper.toResponseList(saleRepository.findByCustomerId(customerId));
    }

    @Transactional
    public SaleResponse create(SaleRequest request, String userEmail) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("El usuario no tiene un perfil de empleado asociado"));

        List<SaleItem> saleItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (SaleRequest.SaleItemRequest itemReq : request.getItems()) {
            Vehicle vehicle = vehicleRepository.findByIdAndDeletedFalse(itemReq.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado: " + itemReq.getVehicleId()));

            if (vehicle.getStatus() != Vehicle.VehicleStatus.AVAILABLE) {
                throw new BadRequestException("El vehículo " + vehicle.getModel() + " no está disponible");
            }

            BigDecimal discount = itemReq.getDiscount() != null ? itemReq.getDiscount() : BigDecimal.ZERO;
            BigDecimal unitPrice = vehicle.getPrice().subtract(
                    vehicle.getPrice().multiply(discount).divide(BigDecimal.valueOf(100))
            );

            SaleItem item = SaleItem.builder()
                    .vehicle(vehicle)
                    .unitPrice(unitPrice)
                    .discount(discount)
                    .build();
            saleItems.add(item);
            total = total.add(unitPrice);

            vehicle.setStatus(Vehicle.VehicleStatus.SOLD);
            vehicleRepository.save(vehicle);

            inventoryMovementRepository.save(InventoryMovement.builder()
                    .vehicle(vehicle)
                    .movementType(InventoryMovement.MovementType.EXIT)
                    .reason("Venta #pendiente")
                    .performedBy(user)
                    .build());
        }

        Sale sale = Sale.builder()
                .customer(customer)
                .employee(employee)
                .totalAmount(total)
                .paymentMethod(request.getPaymentMethod())
                .status(Sale.SaleStatus.PENDING)
                .notes(request.getNotes())
                .items(saleItems)
                .build();

        saleItems.forEach(item -> item.setSale(sale));

        if (request.getPaymentMethod() == Sale.PaymentMethod.FINANCING && request.getInstallments() != null) {
            BigDecimal installmentAmount = total.subtract(
                    request.getDownPayment() != null ? request.getDownPayment() : BigDecimal.ZERO
            ).divide(BigDecimal.valueOf(request.getInstallments()), RoundingMode.HALF_UP);

            Payment payment = Payment.builder()
                    .sale(sale)
                    .method(Sale.PaymentMethod.FINANCING)
                    .amount(total)
                    .installments(request.getInstallments())
                    .installmentAmount(installmentAmount)
                    .build();
            sale.setPayments(List.of(payment));
        } else {
            Payment payment = Payment.builder()
                    .sale(sale)
                    .method(request.getPaymentMethod())
                    .amount(total)
                    .build();
            sale.setPayments(List.of(payment));
        }

        Sale saved = saleRepository.save(sale);

        for (SaleItem item : saved.getItems()) {
            InventoryMovement movement = inventoryMovementRepository
                    .findByVehicleIdOrderByMovementDateDesc(item.getVehicle().getId())
                    .stream().findFirst().orElse(null);
            if (movement != null) {
                movement.setReason("Venta #" + saved.getId());
                inventoryMovementRepository.save(movement);
            }
        }

        log.info("Venta creada: {} por {}", saved.getId(), userEmail);
        return saleMapper.toResponse(saved);
    }

    @Transactional
    public SaleResponse updateStatus(UUID id, Sale.SaleStatus status) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada: " + id));

        if (status == Sale.SaleStatus.CANCELLED || status == Sale.SaleStatus.REFUNDED) {
            for (SaleItem item : sale.getItems()) {
                Vehicle vehicle = item.getVehicle();
                vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
                vehicleRepository.save(vehicle);
            }
        }

        sale.setStatus(status);
        Sale saved = saleRepository.save(sale);
        log.info("Venta {} actualizada a estado {}", id, status);
        return saleMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> findByEmployeeId(UUID employeeId) {
        return saleMapper.toResponseList(saleRepository.findByEmployeeId(employeeId));
    }
}
