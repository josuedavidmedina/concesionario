package com.concesionario.service;

import com.concesionario.dto.reference.VehicleTypeResponse;
import com.concesionario.entity.VehicleType;
import com.concesionario.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;

    public List<VehicleTypeResponse> findAll() {
        return vehicleTypeRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private VehicleTypeResponse toResponse(VehicleType type) {
        return VehicleTypeResponse.builder()
                .id(type.getId())
                .name(type.getName().name())
                .description(type.getDescription())
                .build();
    }
}
