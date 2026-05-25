package com.concesionario.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "customer_contacts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContactType type;

    @Column(nullable = false, length = 150)
    private String value;

    public enum ContactType { EMAIL, PHONE, WHATSAPP, ADDRESS }
}

// =============================================
// ---- Employee.java ----
