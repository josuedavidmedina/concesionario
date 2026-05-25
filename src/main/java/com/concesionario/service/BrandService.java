package com.concesionario.service;

import com.concesionario.dto.reference.BrandResponse;
import com.concesionario.entity.Brand;
import com.concesionario.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandResponse> findAll() {
        return brandRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private BrandResponse toResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .country(brand.getCountry())
                .logoUrl(brand.getLogoUrl())
                .build();
    }
}
