package com.concesionario.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicle_types")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private TypeName name;

    @Column(length = 255)
    private String description;

    public enum TypeName {
        CAR, MOTORCYCLE, SUV, TRUCK, ELECTRIC, VAN
    }
}

// =============================================
// ---- Vehicle.java ----
