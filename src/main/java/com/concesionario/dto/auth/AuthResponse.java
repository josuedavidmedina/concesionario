package com.concesionario.dto.auth;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String role;
    private Long expiresIn;
}

// ---- RegisterRequest.java ----
