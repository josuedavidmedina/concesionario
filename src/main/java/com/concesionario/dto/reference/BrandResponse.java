package com.concesionario.dto.reference;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BrandResponse {
    private Long id;
    private String name;
    private String country;
    private String logoUrl;
}
