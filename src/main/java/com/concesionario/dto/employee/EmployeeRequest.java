package com.concesionario.dto.employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmployeeRequest {

    @NotNull(message = "El usuario es requerido")
    private UUID userId;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100)
    private String lastName;

    @NotBlank(message = "El código de empleado es requerido")
    @Size(max = 20)
    private String employeeCode;

    @Size(max = 100)
    private String department;

    @NotNull(message = "La fecha de contratación es requerida")
    private LocalDate hireDate;

    private Boolean isActive;
}
