# Documentación del Proyecto Concesionario

## Documentación técnica

- [Arquitectura del sistema](architecture.md) — Capas, flujos, patrones
- [Base de datos](database.md) — Esquema relacional, tablas, enums, vistas

## Documentación generada automáticamente

| Tipo | Ruta | Comando para regenerar |
|------|------|----------------------|
| **JavaDoc** | `target/site/apidocs/index.html` | `mvn javadoc:javadoc` |
| **TypeDoc** | `docs/frontend/index.html` | `cd frontend && npx typedoc --entryPointStrategy expand --out ../docs/frontend src/main.tsx` |
| **Swagger UI** | `http://localhost:8080/api/swagger-ui.html` | Iniciar el backend |
| **OpenAPI JSON** | `http://localhost:8080/api/api-docs` | Iniciar el backend |

## Referencias rápidas

### Backend
- Puerto: 8080
- Base URL: `http://localhost:8080/api`
- Perfil dev: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`
- Tests: `mvn test`

### Frontend
- Puerto: 5173
- URL: `http://localhost:5173`
- Dev: `npm run dev` (dentro de `frontend/`)
- Build: `npm run build`

### Docker
```bash
docker-compose up -d --build
```
