package com.concesionario.service;

import com.concesionario.dto.employee.EmployeeRequest;
import com.concesionario.dto.employee.EmployeeResponse;
import com.concesionario.entity.Employee;
import com.concesionario.entity.User;
import com.concesionario.exception.BadRequestException;
import com.concesionario.exception.ResourceNotFoundException;
import com.concesionario.mapper.EmployeeMapper;
import com.concesionario.repository.EmployeeRepository;
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
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final EmployeeMapper employeeMapper;

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return employeeMapper.toResponseList(employeeRepository.findAll());
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + id));
        return employeeMapper.toResponse(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findByUserId(UUID userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado para el usuario: " + userId));
        return employeeMapper.toResponse(employee);
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BadRequestException("Ya existe un empleado con ese código");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Employee employee = employeeMapper.toEntity(request);
        employee.setUser(user);

        Employee saved = employeeRepository.save(employee);
        log.info("Empleado creado: {} {}", saved.getFirstName(), saved.getLastName());
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    public EmployeeResponse update(UUID id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + id));

        employeeMapper.updateEntityFromRequest(request, employee);

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            employee.setUser(user);
        }

        Employee saved = employeeRepository.save(employee);
        log.info("Empleado actualizado: {}", id);
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Empleado no encontrado: " + id);
        }
        employeeRepository.deleteById(id);
        log.info("Empleado eliminado: {}", id);
    }
}
