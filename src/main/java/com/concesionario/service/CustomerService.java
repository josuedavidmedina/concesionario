package com.concesionario.service;

import com.concesionario.dto.customer.CustomerRequest;
import com.concesionario.dto.customer.CustomerResponse;
import com.concesionario.entity.Customer;
import com.concesionario.entity.CustomerContact;
import com.concesionario.entity.User;
import com.concesionario.exception.BadRequestException;
import com.concesionario.exception.ResourceNotFoundException;
import com.concesionario.mapper.CustomerMapper;
import com.concesionario.repository.CustomerContactRepository;
import com.concesionario.repository.CustomerRepository;
import com.concesionario.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerContactRepository customerContactRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;

    @Transactional(readOnly = true)
    public List<CustomerResponse> findAll() {
        return customerMapper.toResponseList(customerRepository.findAll());
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + id));
        return customerMapper.toResponse(customer);
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> search(String query) {
        return customerMapper.toResponseList(customerRepository.search(query));
    }

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new BadRequestException("Ya existe un cliente con ese documento");
        }

        Customer customer = customerMapper.toEntity(request);

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            customer.setUser(user);
        }

        if (request.getContacts() != null) {
            List<CustomerContact> contacts = request.getContacts().stream()
                    .map(cr -> CustomerContact.builder()
                            .type(cr.getType())
                            .value(cr.getValue())
                            .customer(customer)
                            .build())
                    .toList();
            customer.setContacts(contacts);
        }

        Customer saved = customerRepository.save(customer);
        log.info("Cliente creado: {} {}", saved.getFirstName(), saved.getLastName());
        return customerMapper.toResponse(saved);
    }

    @Transactional
    public CustomerResponse update(UUID id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + id));

        customerMapper.updateEntityFromRequest(request, customer);

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            customer.setUser(user);
        }

        if (request.getContacts() != null) {
            customerContactRepository.deleteByCustomerId(id);
            List<CustomerContact> contacts = request.getContacts().stream()
                    .map(cr -> CustomerContact.builder()
                            .type(cr.getType())
                            .value(cr.getValue())
                            .customer(customer)
                            .build())
                    .toList();
            customer.setContacts(contacts);
        }

        Customer saved = customerRepository.save(customer);
        log.info("Cliente actualizado: {}", id);
        return customerMapper.toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado: " + id);
        }
        customerRepository.deleteById(id);
        log.info("Cliente eliminado: {}", id);
    }
}
