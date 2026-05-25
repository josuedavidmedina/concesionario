package com.concesionario.controller;

import com.concesionario.dto.ApiResponse;
import com.concesionario.dto.reference.VehicleTypeResponse;
import com.concesionario.service.VehicleTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle-types")
@RequiredArgsConstructor
@Tag(name = "Tipos de vehículo", description = "Consulta de tipos de vehículo")
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    @Operation(summary = "Listar todos los tipos de vehículo")
    public ResponseEntity<ApiResponse<List<VehicleTypeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(vehicleTypeService.findAll()));
    }
}
