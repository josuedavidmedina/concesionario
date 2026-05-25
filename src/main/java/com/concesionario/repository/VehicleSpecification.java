package com.concesionario.repository;

import com.concesionario.dto.vehicle.VehicleFilterRequest;
import com.concesionario.entity.Vehicle;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    private VehicleSpecification() {}

    public static Specification<Vehicle> build(VehicleFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Soft delete: siempre excluir eliminados
            predicates.add(cb.equal(root.get("deleted"), false));

            if (filter == null) return cb.and(predicates.toArray(new Predicate[0]));

            if (filter.getBrandId() != null)
                predicates.add(cb.equal(root.get("brand").get("id"), filter.getBrandId()));

            if (filter.getTypeId() != null)
                predicates.add(cb.equal(root.get("vehicleType").get("id"), filter.getTypeId()));

            if (filter.getYearFrom() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("year"), filter.getYearFrom()));

            if (filter.getYearTo() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("year"), filter.getYearTo()));

            if (filter.getPriceFrom() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getPriceFrom()));

            if (filter.getPriceTo() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getPriceTo()));

            if (filter.getFuelType() != null)
                predicates.add(cb.equal(root.get("fuelType"), filter.getFuelType()));

            if (filter.getStatus() != null)
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));

            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String like = "%" + filter.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("model")), like),
                    cb.like(cb.lower(root.get("description")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

// =============================================
// MANEJO DE EXCEPCIONES
// =============================================

// ---- ResourceNotFoundException.java ----
