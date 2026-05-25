package com.concesionario.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_document", columnList = "document_number")
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 20)
    private DocumentType documentType;

    @Column(name = "document_number", nullable = false, unique = true, length = 30)
    private String documentNumber;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 200)
    private String address;

    @Column(length = 50)
    private String city;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerContact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "customer")
    private List<Sale> purchases = new ArrayList<>();

    public enum DocumentType { CC, CE, NIT, PASSPORT }

    /** Nombre completo calculado */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}

// =============================================
// ---- CustomerContact.java ----
