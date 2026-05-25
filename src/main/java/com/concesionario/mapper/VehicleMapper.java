package com.concesionario.mapper;

import com.concesionario.dto.vehicle.VehicleRequest;
import com.concesionario.dto.vehicle.VehicleResponse;
import com.concesionario.entity.Vehicle;
import com.concesionario.entity.VehicleImage;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VehicleMapper {

    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "typeName", source = "vehicleType.name")
    @Mapping(target = "imageUrls", expression = "java(mapImageUrls(vehicle))")
    @Mapping(target = "primaryImageUrl", expression = "java(mapPrimaryImage(vehicle))")
    VehicleResponse toResponse(Vehicle vehicle);

    List<VehicleResponse> toResponseList(List<Vehicle> vehicles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "vehicleType", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "images", ignore = true)
    Vehicle toEntity(VehicleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(VehicleRequest request, @MappingTarget Vehicle vehicle);

    default List<String> mapImageUrls(Vehicle vehicle) {
        if (vehicle.getImages() == null) return List.of();
        return vehicle.getImages().stream().map(VehicleImage::getUrl).toList();
    }

    default String mapPrimaryImage(Vehicle vehicle) {
        if (vehicle.getImages() == null) return null;
        return vehicle.getImages().stream()
                .filter(VehicleImage::getIsPrimary)
                .map(VehicleImage::getUrl)
                .findFirst()
                .orElseGet(() -> vehicle.getImages().isEmpty() ? null : vehicle.getImages().get(0).getUrl());
    }
}

// ================ SERVICES ================

// ---- AuthService.java ----
