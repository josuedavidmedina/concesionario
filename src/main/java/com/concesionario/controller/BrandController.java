package com.concesionario.controller;

import com.concesionario.dto.ApiResponse;
import com.concesionario.dto.reference.BrandResponse;
import com.concesionario.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@Tag(name = "Marcas", description = "Consulta de marcas de vehículos")
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    @Operation(summary = "Listar todas las marcas")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(brandService.findAll()));
    }
}
