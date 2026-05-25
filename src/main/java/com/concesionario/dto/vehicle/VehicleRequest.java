package com.concesionario.dto.vehicle;

import com.concesionario.entity.Vehicle;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleRequest {

    @NotNull(message = "La marca es requerida")
    private Long brandId;

    @NotNull(message = "El tipo de vehículo es requerido")
    private Long typeId;

    @NotBlank(message = "El modelo es requerido")
    @Size(max = 150)
    private String model;

    @NotNull
    @Min(value = 1900, message = "Año inválido")
    @Max(value = 2030, message = "Año inválido")
    private Integer year;

    @NotNull
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    private BigDecimal price;

    @Size(max = 50)
    private String color;

    private Vehicle.FuelType fuelType;

    @Min(0)
    private Integer mileage;

    private Integer engineCc;

    @Size(max = 20)
    private String transmission;

    @Size(max = 2000)
    private String description;

    @Size(max = 50)
    private String vinCode;
}

// ---- VehicleResponse.java ----
