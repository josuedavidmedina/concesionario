package com.concesionario.dto.sale;

import com.concesionario.entity.Sale;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleRequest {

    @NotNull(message = "El cliente es requerido")
    private UUID customerId;

    @NotNull(message = "El método de pago es requerido")
    private Sale.PaymentMethod paymentMethod;

    @NotEmpty(message = "La venta debe incluir al menos un vehículo")
    private List<SaleItemRequest> items;

    private String notes;

    // Financiamiento
    private Integer installments;
    private BigDecimal downPayment;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SaleItemRequest {
        @NotNull
        private UUID vehicleId;

        @DecimalMin("0.00")
        @Builder.Default
        private BigDecimal discount = BigDecimal.ZERO;
    }
}

// ---- ApiResponse.java (wrapper genérico) ----
