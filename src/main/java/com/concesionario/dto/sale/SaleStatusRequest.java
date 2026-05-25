package com.concesionario.dto.sale;

import com.concesionario.entity.Sale;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleStatusRequest {
    @NotNull(message = "El estado es requerido")
    private Sale.SaleStatus status;
}
