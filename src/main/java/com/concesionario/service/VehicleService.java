package com.concesionario.service;

import com.concesionario.dto.PageResponse;
import com.concesionario.dto.vehicle.*;
import com.concesionario.entity.*;
import com.concesionario.exception.*;
import com.concesionario.mapper.VehicleMapper;
import com.concesionario.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final BrandRepository brandRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final VehicleMapper vehicleMapper;

    @Transactional(readOnly = true)
    public PageResponse<VehicleResponse> findAll(VehicleFilterRequest filter, int page, int size) {
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Vehicle> spec = VehicleSpecification.build(filter);

        Page<Vehicle> vehiclePage = vehicleRepository.findAll(spec, pageable);

        return PageResponse.<VehicleResponse>builder()
                .content(vehicleMapper.toResponseList(vehiclePage.getContent()))
                .page(vehiclePage.getNumber())
                .size(vehiclePage.getSize())
                .totalElements(vehiclePage.getTotalElements())
                .totalPages(vehiclePage.getTotalPages())
                .first(vehiclePage.isFirst())
                .last(vehiclePage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "vehicles", key = "#id")
    public VehicleResponse findById(UUID id) {
        Vehicle vehicle = getVehicleOrThrow(id);
        return vehicleMapper.toResponse(vehicle);
    }

    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public VehicleResponse create(VehicleRequest request) {
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));

        VehicleType type = vehicleTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de vehículo no encontrado"));

        Vehicle vehicle = vehicleMapper.toEntity(request);
        vehicle.setBrand(brand);
        vehicle.setVehicleType(type);
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);

        Vehicle saved = vehicleRepository.save(vehicle);
        log.info("Vehículo creado: {} {}", brand.getName(), request.getModel());
        return vehicleMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "vehicles", key = "#id")
    public VehicleResponse update(UUID id, VehicleRequest request) {
        Vehicle vehicle = getVehicleOrThrow(id);

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));
            vehicle.setBrand(brand);
        }

        vehicleMapper.updateEntityFromRequest(request, vehicle);
        Vehicle saved = vehicleRepository.save(vehicle);
        log.info("Vehículo actualizado: {}", id);
        return vehicleMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public void delete(UUID id) {
        Vehicle vehicle = getVehicleOrThrow(id);
        vehicle.setDeleted(true);           // Soft delete
        vehicleRepository.save(vehicle);
        log.info("Vehículo eliminado (soft): {}", id);
    }

    @Transactional
    public VehicleResponse updateStatus(UUID id, Vehicle.VehicleStatus status) {
        Vehicle vehicle = getVehicleOrThrow(id);
        vehicle.setStatus(status);
        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    private Vehicle getVehicleOrThrow(UUID id) {
        return vehicleRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado: " + id));
    }

    private Pageable buildPageable(VehicleFilterRequest filter, int page, int size) {
        String sortBy = filter.getSortBy() != null ? filter.getSortBy() : "createdAt";
        Sort.Direction dir = "asc".equalsIgnoreCase(filter.getSortDir())
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, Math.min(size, 100), Sort.by(dir, sortBy));
    }
}

// ================ CONTROLLERS ================

// ---- AuthController.java ----
