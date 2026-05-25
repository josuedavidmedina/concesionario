package com.concesionario.dto.report;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MonthlySalesReport {
    private int year;
    private int month;
    private String monthName;
    private long totalSales;
    private BigDecimal totalRevenue;
}
