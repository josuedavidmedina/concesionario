package com.concesionario.controller;

import com.concesionario.dto.ApiResponse;
import com.concesionario.dto.report.MonthlySalesReport;
import com.concesionario.dto.report.RevenueReport;
import com.concesionario.dto.report.TopCustomerReport;
import com.concesionario.dto.report.TopVehicleReport;
import com.concesionario.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@Tag(name = "Reportes", description = "Reportes y exportaciones")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/sales/monthly")
    @Operation(summary = "Ventas mensuales (últimos 12 meses)")
    public ResponseEntity<ApiResponse<List<MonthlySalesReport>>> getMonthlySales() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getMonthlySales()));
    }

    @GetMapping("/vehicles/top-sold")
    @Operation(summary = "Vehículos más vendidos")
    public ResponseEntity<ApiResponse<List<TopVehicleReport>>> getTopSoldVehicles() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getTopSoldVehicles()));
    }

    @GetMapping("/customers/top")
    @Operation(summary = "Mejores clientes")
    public ResponseEntity<ApiResponse<List<TopCustomerReport>>> getTopCustomers() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getTopCustomers()));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Reporte de ingresos por período")
    public ResponseEntity<ApiResponse<RevenueReport>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getRevenue(from, to)));
    }

    @PostMapping("/sales/export/pdf")
    @Operation(summary = "Exportar ventas a PDF")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        byte[] pdf = reportService.exportSalesPdf(from, to);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("reporte-ventas.pdf").build());
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @PostMapping("/sales/export/excel")
    @Operation(summary = "Exportar ventas a Excel")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        byte[] excel = reportService.exportSalesExcel(from, to);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("reporte-ventas.xlsx").build());
        return ResponseEntity.ok().headers(headers).body(excel);
    }
}
