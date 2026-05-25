package com.concesionario.dto.report;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TopVehicleReport {
    private UUID vehicleId;
    private String brand;
    private String model;
    private Integer year;
    private long totalSold;
    private BigDecimal totalRevenue;
}
