package com.concesionario.repository;

import com.concesionario.entity.CustomerContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerContactRepository extends JpaRepository<CustomerContact, Long> {
    List<CustomerContact> findByCustomerId(UUID customerId);
    void deleteByCustomerId(UUID customerId);
}
