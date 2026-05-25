package com.concesionario.mapper;

import com.concesionario.dto.sale.SaleResponse;
import com.concesionario.dto.sale.SaleResponse.SaleItemResponse;
import com.concesionario.dto.sale.SaleResponse.PaymentResponse;
import com.concesionario.entity.Sale;
import com.concesionario.entity.SaleItem;
import com.concesionario.entity.Payment;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SaleMapper {

    @Mapping(target = "customerId", source = "sale.customer.id")
    @Mapping(target = "customerName", expression = "java(sale.getCustomer().getFullName())")
    @Mapping(target = "employeeId", source = "sale.employee.id")
    @Mapping(target = "employeeName", expression = "java(sale.getEmployee().getFirstName() + \" \" + sale.getEmployee().getLastName())")
    @Mapping(target = "items", expression = "java(mapItems(sale))")
    @Mapping(target = "payments", expression = "java(mapPayments(sale))")
    @Mapping(target = "createdAt", source = "createdAt")
    SaleResponse toResponse(Sale sale);

    List<SaleResponse> toResponseList(List<Sale> sales);

    default List<SaleItemResponse> mapItems(Sale sale) {
        if (sale.getItems() == null) return List.of();
        return sale.getItems().stream().map(item -> SaleItemResponse.builder()
                .id(item.getId())
                .vehicleId(item.getVehicle().getId())
                .vehicleModel(item.getVehicle().getModel())
                .unitPrice(item.getUnitPrice())
                .discount(item.getDiscount())
                .build()).toList();
    }

    default List<PaymentResponse> mapPayments(Sale sale) {
        if (sale.getPayments() == null) return List.of();
        return sale.getPayments().stream().map(p -> PaymentResponse.builder()
                .id(p.getId())
                .method(p.getMethod().name())
                .amount(p.getAmount())
                .installments(p.getInstallments())
                .installmentAmount(p.getInstallmentAmount())
                .paymentDate(p.getPaymentDate())
                .build()).toList();
    }
}
