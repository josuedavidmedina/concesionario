package com.concesionario.dto.vehicle;

import com.concesionario.entity.Vehicle;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleResponse {
    private UUID id;
    private String brandName;
    private String typeName;
    private String model;
    private Integer year;
    private BigDecimal price;
    private String color;
    private Vehicle.FuelType fuelType;
    private Vehicle.VehicleStatus status;
    private Integer mileage;
    private String description;
    private String vinCode;
    private List<String> imageUrls;
    private String primaryImageUrl;
    private LocalDateTime createdAt;
}

// ---- VehicleFilterRequest.java ----
