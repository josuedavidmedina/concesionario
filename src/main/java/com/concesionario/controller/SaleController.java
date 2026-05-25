package com.concesionario.controller;

import com.concesionario.dto.ApiResponse;
import com.concesionario.dto.sale.SaleRequest;
import com.concesionario.dto.sale.SaleResponse;
import com.concesionario.dto.sale.SaleStatusRequest;
import com.concesionario.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
@Tag(name = "Ventas", description = "Gestión de ventas")
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Listar todas las ventas")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(saleService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener venta por ID")
    public ResponseEntity<ApiResponse<SaleResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(saleService.findById(id)));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Obtener ventas por cliente")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok(ApiResponse.ok(saleService.findByCustomerId(customerId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SELLER')")
    @Operation(summary = "Crear nueva venta")
    public ResponseEntity<ApiResponse<SaleResponse>> create(
            @Valid @RequestBody SaleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        SaleResponse response = saleService.create(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Venta creada exitosamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Actualizar estado de la venta")
    public ResponseEntity<ApiResponse<SaleResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody SaleStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(saleService.updateStatus(id, request.getStatus())));
    }
}
