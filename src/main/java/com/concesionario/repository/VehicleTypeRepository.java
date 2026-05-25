package com.concesionario.repository;

import com.concesionario.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {}

// =============================================
// SPECIFICATION — Filtros dinámicos para vehículos
// =============================================
