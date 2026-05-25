package com.concesionario.dto.vehicle;

import com.concesionario.entity.Vehicle;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleFilterRequest {
    private Long brandId;
    private Long typeId;
    private Integer yearFrom;
    private Integer yearTo;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;
    private Vehicle.FuelType fuelType;
    private Vehicle.VehicleStatus status;
    private String search;          // búsqueda libre en modelo y descripción
    private String sortBy;          // price, year, createdAt
    private String sortDir;         // asc, desc
}

// ---- SaleRequest.java ----
