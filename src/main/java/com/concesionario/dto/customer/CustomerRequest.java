package com.concesionario.dto.customer;

import com.concesionario.entity.Customer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerRequest {

    private UUID userId;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100)
    private String lastName;

    @NotNull(message = "El tipo de documento es requerido")
    private Customer.DocumentType documentType;

    @NotBlank(message = "El número de documento es requerido")
    @Size(max = 30)
    private String documentNumber;

    private LocalDate birthDate;

    @Size(max = 200)
    private String address;

    @Size(max = 50)
    private String city;

    private List<ContactRequest> contacts;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContactRequest {
        @NotNull
        private com.concesionario.entity.CustomerContact.ContactType type;

        @NotBlank
        @Size(max = 150)
        private String value;
    }
}
