package com.concesionario.dto.report;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TopCustomerReport {
    private UUID customerId;
    private String fullName;
    private String documentNumber;
    private long totalPurchases;
    private BigDecimal totalSpent;
}
