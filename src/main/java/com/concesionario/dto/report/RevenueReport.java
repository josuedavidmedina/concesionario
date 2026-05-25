package com.concesionario.dto.report;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RevenueReport {
    private LocalDate from;
    private LocalDate to;
    private BigDecimal totalRevenue;
    private long totalTransactions;
}
