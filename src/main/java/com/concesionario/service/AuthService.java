package com.concesionario.service;

import com.concesionario.dto.auth.*;
import com.concesionario.entity.*;
import com.concesionario.exception.BadRequestException;
import com.concesionario.repository.*;
import com.concesionario.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Ya existe un usuario con ese email");
        }

        Role.RoleName roleName = request.getRole() != null
                ? Role.RoleName.valueOf(request.getRole())
                : Role.RoleName.ROLE_SELLER;

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new BadRequestException("Rol no encontrado: " + roleName));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(role))
                .active(true)
                .build();

        userRepository.save(user);
        log.info("Nuevo usuario registrado: {}", user.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return buildAuthResponse(userDetails, role.getName().name());
    }

    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Credenciales inválidas");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String role = user.getRoles().stream().findFirst()
                .map(r -> r.getName().name()).orElse("ROLE_SELLER");

        log.info("Login exitoso: {}", request.getEmail());
        return buildAuthResponse(userDetails, role);
    }

    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new BadRequestException("Refresh token inválido o expirado");
        }

        User user = userRepository.findByEmail(email).orElseThrow();
        String role = user.getRoles().stream().findFirst()
                .map(r -> r.getName().name()).orElse("ROLE_SELLER");

        return buildAuthResponse(userDetails, role);
    }

    private AuthResponse buildAuthResponse(UserDetails userDetails, String role) {
        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(userDetails))
                .refreshToken(jwtService.generateRefreshToken(userDetails))
                .email(userDetails.getUsername())
                .role(role)
                .expiresIn(86400L)
                .build();
    }
}

// ---- VehicleService.java ----
