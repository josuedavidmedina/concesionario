package com.concesionario.controller;

import com.concesionario.dto.*;
import com.concesionario.dto.vehicle.*;
import com.concesionario.entity.Vehicle;
import com.concesionario.service.VehicleService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehículos", description = "Gestión completa del catálogo de vehículos")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    @Operation(summary = "Listar vehículos con filtros y paginación")
    public ResponseEntity<ApiResponse<PageResponse<VehicleResponse>>> getAll(
            VehicleFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.findAll(filter, page, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener vehículo por ID")
    public ResponseEntity<ApiResponse<VehicleResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SELLER')")
    @Operation(summary = "Crear nuevo vehículo")
    public ResponseEntity<ApiResponse<VehicleResponse>> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(vehicleService.create(request), "Vehículo creado exitosamente"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SELLER')")
    @Operation(summary = "Actualizar vehículo")
    public ResponseEntity<ApiResponse<VehicleResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar vehículo (soft delete)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        vehicleService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Vehículo eliminado exitosamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SELLER')")
    @Operation(summary = "Cambiar estado del vehículo")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam Vehicle.VehicleStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.updateStatus(id, status)));
    }
}
