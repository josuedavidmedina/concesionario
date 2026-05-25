package com.concesionario.dto.employee;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmployeeResponse {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String fullName;
    private String employeeCode;
    private String department;
    private LocalDate hireDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
