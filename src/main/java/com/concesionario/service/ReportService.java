package com.concesionario.service;

import com.concesionario.dto.report.MonthlySalesReport;
import com.concesionario.dto.report.RevenueReport;
import com.concesionario.dto.report.TopCustomerReport;
import com.concesionario.dto.report.TopVehicleReport;
import com.concesionario.entity.Sale;
import com.concesionario.repository.SaleRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final SaleRepository saleRepository;

    @Transactional(readOnly = true)
    public List<MonthlySalesReport> getMonthlySales() {
        LocalDateTime start = LocalDateTime.now().minusMonths(12);
        LocalDateTime end = LocalDateTime.now();
        List<Object[]> results = saleRepository.getMonthlySales(start, end);

        List<MonthlySalesReport> reports = new ArrayList<>();
        for (Object[] row : results) {
            reports.add(MonthlySalesReport.builder()
                    .year(((Number) row[0]).intValue())
                    .month(((Number) row[1]).intValue())
                    .totalSales(((Number) row[2]).longValue())
                    .totalRevenue((BigDecimal) row[3])
                    .build());
        }
        return reports;
    }

    @Transactional(readOnly = true)
    public List<TopVehicleReport> getTopSoldVehicles() {
        List<Object[]> results = saleRepository.findTopSoldVehicles();
        List<TopVehicleReport> reports = new ArrayList<>();
        for (Object[] row : results) {
            reports.add(TopVehicleReport.builder()
                    .vehicleId((UUID) row[0])
                    .brand((String) row[1])
                    .model((String) row[2])
                    .year(((Number) row[3]).intValue())
                    .totalSold(((Number) row[4]).longValue())
                    .totalRevenue((BigDecimal) row[5])
                    .build());
        }
        return reports;
    }

    @Transactional(readOnly = true)
    public List<TopCustomerReport> getTopCustomers() {
        List<Object[]> results = saleRepository.findTopCustomers();
        List<TopCustomerReport> reports = new ArrayList<>();
        for (Object[] row : results) {
            reports.add(TopCustomerReport.builder()
                    .customerId((UUID) row[0])
                    .fullName((String) row[1])
                    .documentNumber((String) row[2])
                    .totalPurchases(((Number) row[3]).longValue())
                    .totalSpent((BigDecimal) row[4])
                    .build());
        }
        return reports;
    }

    @Transactional(readOnly = true)
    public RevenueReport getRevenue(LocalDate from, LocalDate to) {
        BigDecimal revenue = saleRepository.sumTotalBetween(from.atStartOfDay(), to.atTime(23, 59, 59));
        return RevenueReport.builder()
                .from(from)
                .to(to)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .totalTransactions(0)
                .build();
    }

    public byte[] exportSalesPdf(LocalDate from, LocalDate to) {
        Document document = new Document(PageSize.A4, 20, 20, 30, 30);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.DARK_GRAY);
            Paragraph title = new Paragraph("Reporte de Ventas", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Paragraph period = new Paragraph("Período: " + from + " al " + to);
            period.setSpacingAfter(20);
            document.add(period);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            String[] headers = {"Cliente", "Vendedor", "Total", "Método", "Fecha"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            List<Sale> sales = saleRepository.findAll().stream()
                    .filter(s -> s.getSaleDate().toLocalDate().isAfter(from.minusDays(1))
                            && s.getSaleDate().toLocalDate().isBefore(to.plusDays(1)))
                    .toList();

            for (Sale sale : sales) {
                table.addCell(sale.getCustomer().getFullName());
                table.addCell(sale.getEmployee().getFirstName());
                table.addCell("$" + sale.getTotalAmount());
                table.addCell(sale.getPaymentMethod().name());
                table.addCell(sale.getSaleDate().toLocalDate().toString());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            log.error("Error generando PDF", e);
            throw new RuntimeException("Error generando PDF", e);
        }
        return baos.toByteArray();
    }

    public byte[] exportSalesExcel(LocalDate from, LocalDate to) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Ventas");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Cliente", "Vendedor", "Total", "Método Pago", "Estado", "Fecha"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
                style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                cell.setCellStyle(style);
            }

            List<Sale> sales = saleRepository.findAll().stream()
                    .filter(s -> s.getSaleDate().toLocalDate().isAfter(from.minusDays(1))
                            && s.getSaleDate().toLocalDate().isBefore(to.plusDays(1)))
                    .toList();

            int rowNum = 1;
            for (Sale sale : sales) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(sale.getId().toString());
                row.createCell(1).setCellValue(sale.getCustomer().getFullName());
                row.createCell(2).setCellValue(sale.getEmployee().getFirstName());
                row.createCell(3).setCellValue(sale.getTotalAmount().doubleValue());
                row.createCell(4).setCellValue(sale.getPaymentMethod().name());
                row.createCell(5).setCellValue(sale.getStatus().name());
                row.createCell(6).setCellValue(sale.getSaleDate().toString());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generando Excel", e);
            throw new RuntimeException("Error generando Excel", e);
        }
    }
}
