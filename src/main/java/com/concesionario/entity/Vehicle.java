package com.concesionario.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicle_status", columnList = "status"),
    @Index(name = "idx_vehicle_brand", columnList = "brand_id"),
    @Index(name = "idx_vehicle_year", columnList = "year"),
    @Index(name = "idx_vehicle_price", columnList = "price")
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private VehicleType vehicleType;

    @Column(nullable = false, length = 150)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(length = 50)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", length = 30)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column
    private Integer mileage;

    @Column(name = "engine_cc")
    private Integer engineCc;

    @Column(length = 20)
    private String transmission;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "vin_code", unique = true, length = 50)
    private String vinCode;

    /** Soft delete */
    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<VehicleImage> images = new ArrayList<>();

    public enum FuelType { GASOLINE, DIESEL, ELECTRIC, HYBRID, GAS }
    public enum VehicleStatus { AVAILABLE, SOLD, RESERVED, IN_MAINTENANCE }
}

// =============================================
// ---- VehicleImage.java ----
