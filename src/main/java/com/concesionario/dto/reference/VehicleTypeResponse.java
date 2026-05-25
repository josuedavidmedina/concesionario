package com.concesionario.dto.reference;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleTypeResponse {
    private Long id;
    private String name;
    private String description;
}
