package com.concesionario.dto.auth;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "La contraseña debe tener mínimo 8 caracteres")
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String role;  // ROLE_ADMIN | ROLE_MANAGER | ROLE_SELLER
}

// ---- VehicleRequest.java ----
