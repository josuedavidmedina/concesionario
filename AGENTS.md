# Concesionario — Spring Boot 3 + Supabase

Backend profesional para gestión de concesionario de vehículos (autos, motos, SUVs, camiones, eléctricos).

## Tecnologías

- Java 21, Spring Boot 3.2.5, Maven
- PostgreSQL 15 vía Supabase (transaction pooler)
- Spring Security 6 + JWT (JJWT 0.12.3)
- Spring Data JPA / Hibernate
- MapStruct 1.5.5 + Lombok 1.18.30
- Springdoc OpenAPI 2.3.0 (Swagger UI)
- iTextPDF 5.5.13 + Apache POI 5.2.5 (reportes)
- OkHttp 4.12 (uploads a Supabase Storage)
- Docker + Docker Compose

## Comandos

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw test
./mvnw test -Dtest=VehicleServiceTest
docker-compose up -d --build
```

## Estructura

```
src/main/java/com/concesionario/
├── config/        # SecurityConfig, CORS, Swagger, Cache, Auditoría
├── security/      # JwtAuthFilter, JwtService, UserDetailsServiceImpl
├── controller/    # REST controllers
├── service/       # Lógica de negocio
├── repository/    # JPA repositories + Specifications
├── dto/           # Request/Response DTOs
│   ├── auth/
│   ├── vehicle/
│   └── sale/
├── mapper/        # MapStruct mappers (VehicleMapper)
├── entity/        # JPA entities (14 clases, BaseEntity abstracta)
├── exception/     # GlobalExceptionHandler + excepciones custom
├── util/          # Utilidades
└── validation/    # Validadores custom
```

## Capas

Controller → Service → Repository → JPA/DB
                     ↕
                Mapper (DTO ↔ Entity)

## Convenciones

- Anotaciones Spring (no XML)
- Lombok (`@RequiredArgsConstructor`, `@Data`, `@Builder`, `@Slf4j`)
- MapStruct para mapeo DTO ↔ Entity
- DTOs separados por módulo en `dto/` (Request/Response)
- IDs UUID en entidades principales, Long en tablas secundarias
- BaseEntity abstracta con `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Soft-delete en Vehicle (`deleted` boolean)
- Validación con Jakarta Bean Validation + validadores custom
- Excepciones manejadas por `@RestControllerAdvice`
- Paginación: page por defecto 15, máximo 100

## Seguridad

- JWT stateless (Bearer token, 24h access, 7d refresh)
- BCryptPasswordEncoder (strength 12)
- Endpoints públicos: `/auth/**`, `GET /vehicles/**`, Swagger, health
- DELETE solo ADMIN
- `/employees/**` y `/reports/**` solo ADMIN/MANAGER
- Roles: ROLE_ADMIN, ROLE_MANAGER, ROLE_SELLER

## Base de datos

- `ddl-auto: validate` — schemas gestionados por `schema.sql`
- `open-in-view: false`
- Perfiles: dev (verbose SQL), prod (logging mínimo, pool 20)
- Cache: simple (in-memory), preparado para Redis

## Perfiles

- **dev**: DB pool 5, SQL debug, credenciales inline
- **prod**: DB pool 20, todas las creds vía env, log a archivo

## API

Base: `http://localhost:8080/api`
Swagger: `/api/swagger-ui.html`
Health: `/api/actuator/health`
