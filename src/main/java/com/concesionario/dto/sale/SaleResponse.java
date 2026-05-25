package com.concesionario.dto.sale;

import com.concesionario.entity.Sale;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleResponse {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private UUID employeeId;
    private String employeeName;
    private BigDecimal totalAmount;
    private Sale.PaymentMethod paymentMethod;
    private Sale.SaleStatus status;
    private LocalDateTime saleDate;
    private String notes;
    private List<SaleItemResponse> items;
    private List<PaymentResponse> payments;
    private LocalDateTime createdAt;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SaleItemResponse {
        private Long id;
        private UUID vehicleId;
        private String vehicleModel;
        private BigDecimal unitPrice;
        private BigDecimal discount;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaymentResponse {
        private UUID id;
        private String method;
        private BigDecimal amount;
        private Integer installments;
        private BigDecimal installmentAmount;
        private LocalDateTime paymentDate;
    }
}
