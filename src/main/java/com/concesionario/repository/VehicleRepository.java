package com.concesionario.repository;

import com.concesionario.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.*;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {

    Optional<Vehicle> findByIdAndDeletedFalse(UUID id);

    Page<Vehicle> findAllByDeletedFalse(Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.deleted = false AND v.status = :status")
    List<Vehicle> findByStatus(@Param("status") Vehicle.VehicleStatus status);

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.brand.id = :brandId AND v.deleted = false")
    long countByBrandId(@Param("brandId") Long brandId);

    @Query("SELECT v FROM Vehicle v WHERE v.deleted = false AND " +
           "(LOWER(v.model) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(v.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Vehicle> searchByModelOrDescription(@Param("q") String query, Pageable pageable);

    @Modifying
    @Query("UPDATE Vehicle v SET v.status = :status WHERE v.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") Vehicle.VehicleStatus status);
}

// ---- UserRepository.java ----
