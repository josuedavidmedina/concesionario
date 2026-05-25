package com.concesionario.dto.customer;

import com.concesionario.entity.Customer;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerResponse {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String fullName;
    private Customer.DocumentType documentType;
    private String documentNumber;
    private LocalDate birthDate;
    private String address;
    private String city;
    private List<ContactResponse> contacts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContactResponse {
        private Long id;
        private String type;
        private String value;
    }
}
