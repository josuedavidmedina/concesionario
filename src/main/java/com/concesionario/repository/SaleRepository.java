package com.concesionario.repository;

import com.concesionario.entity.Sale;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {

    List<Sale> findByCustomerId(UUID customerId);

    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.status = 'COMPLETED' " +
           "AND s.saleDate BETWEEN :from AND :to")
    BigDecimal sumTotalBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT s FROM Sale s WHERE s.employee.id = :empId ORDER BY s.saleDate DESC")
    List<Sale> findByEmployeeId(@Param("empId") UUID employeeId);

    @Query("SELECT EXTRACT(YEAR FROM s.saleDate), EXTRACT(MONTH FROM s.saleDate), " +
           "COUNT(s), SUM(s.totalAmount) FROM Sale s WHERE s.status = 'COMPLETED' " +
           "AND s.saleDate BETWEEN :from AND :to GROUP BY EXTRACT(YEAR FROM s.saleDate), " +
           "EXTRACT(MONTH FROM s.saleDate) ORDER BY EXTRACT(YEAR FROM s.saleDate) DESC, " +
           "EXTRACT(MONTH FROM s.saleDate) DESC")
    List<Object[]> getMonthlySales(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT v.id, b.name, v.model, v.year, COUNT(si), SUM(si.unitPrice * (1 - si.discount/100)) " +
           "FROM SaleItem si JOIN si.vehicle v JOIN v.brand b JOIN si.sale s " +
           "WHERE s.status = 'COMPLETED' " +
           "GROUP BY v.id, b.name, v.model, v.year ORDER BY COUNT(si) DESC")
    List<Object[]> findTopSoldVehicles();

    @Query("SELECT c.id, c.firstName || ' ' || c.lastName, c.documentNumber, " +
           "COUNT(s), SUM(s.totalAmount) FROM Sale s JOIN s.customer c " +
           "WHERE s.status = 'COMPLETED' " +
           "GROUP BY c.id, c.firstName, c.lastName, c.documentNumber " +
           "ORDER BY SUM(s.totalAmount) DESC")
    List<Object[]> findTopCustomers();
}

// ---- BrandRepository.java ----
