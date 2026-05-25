package com.concesionario.mapper;

import com.concesionario.dto.customer.CustomerRequest;
import com.concesionario.dto.customer.CustomerResponse;
import com.concesionario.dto.customer.CustomerResponse.ContactResponse;
import com.concesionario.entity.Customer;
import com.concesionario.entity.CustomerContact;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "fullName", expression = "java(customer.getFullName())")
    @Mapping(target = "contacts", expression = "java(mapContacts(customer))")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    CustomerResponse toResponse(Customer customer);

    List<CustomerResponse> toResponseList(List<Customer> customers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "contacts", ignore = true)
    @Mapping(target = "purchases", ignore = true)
    Customer toEntity(CustomerRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(CustomerRequest request, @MappingTarget Customer customer);

    default List<ContactResponse> mapContacts(Customer customer) {
        if (customer.getContacts() == null) return List.of();
        return customer.getContacts().stream().map(c -> ContactResponse.builder()
                .id(c.getId())
                .type(c.getType().name())
                .value(c.getValue())
                .build()).toList();
    }

    default CustomerContact toContactEntity(CustomerRequest.ContactRequest request) {
        if (request == null) return null;
        return CustomerContact.builder()
                .type(request.getType())
                .value(request.getValue())
                .build();
    }
}
