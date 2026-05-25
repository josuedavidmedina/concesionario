package com.concesionario.repository;

import com.concesionario.entity.Customer;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByDocumentNumber(String documentNumber);
    boolean existsByDocumentNumber(String documentNumber);

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.lastName)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "c.documentNumber LIKE CONCAT('%', :q, '%')")
    List<Customer> search(@Param("q") String query);
}

// ---- SaleRepository.java ----
