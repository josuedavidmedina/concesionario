package com.concesionario.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private RoleName name;

    @Column(length = 255)
    private String description;

    public enum RoleName {
        ROLE_ADMIN, ROLE_MANAGER, ROLE_SELLER
    }
}

// =============================================
// ---- User.java ----
