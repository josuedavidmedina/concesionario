# Base de Datos

## Esquema relacional

```
┌───────────────┐     ┌──────────────────┐     ┌──────────────┐
│     roles     │     │    users         │     │   brands     │
│───────────────│     │──────────────────│     │──────────────│
│ id  (BIGSER) │◄────│ id  (UUID)       │     │ id  (BIGSER) │
│ name (VARCHAR)│     │ email (VARCHAR)  │     │ name (VARCHAR)│
│ description  │     │ password_hash    │     │ country      │
└───────────────┘     │ active (BOOLEAN)  │     │ logo_url     │
     │                │ created_at       │     └──────┬───────┘
     │                └──────────────────┘            │
     │                     │                          │
     │   ┌─────────────────┘                          │
     │   │  ┌──────────────────────────────────────────┘
     │   │  │
┌───────▼──▼──────┐     ┌──────────────────┐     ┌──────▼────────┐
│  user_roles     │     │   employees      │     │   vehicles    │
│─────────────────│     │──────────────────│     │───────────────│
│ user_id (UUID)  │     │ id  (UUID)       │     │ id  (UUID)    │
│ role_id (BIGINT)│     │ user_id (UUID)   │◄────│ brand_id      │
└─────────────────┘     │ first_name       │     │ type_id       │
                        │ last_name        │     │ model         │
┌──────────────────┐    │ employee_code    │     │ year          │
│  vehicle_types   │    │ department       │     │ price         │
│──────────────────│    │ hire_date        │     │ color         │
│ id  (BIGSER)     │───►│ is_active        │     │ fuel_type     │
│ name (VARCHAR)   │    └──────────────────┘     │ status        │
│ description     │                              │ mileage       │
└──────────────────┘                              │ engine_cc     │
                                                  │ transmission  │
┌──────────────────┐    ┌──────────────────┐     │ description   │
│   customers      │    │  sales           │     │ vin_code      │
│──────────────────│    │──────────────────│     │ deleted(BOOL) │
│ id  (UUID)       │───►│ id  (UUID)       │     │ created_at    │
│ user_id (UUID)   │    │ customer_id (UUID)│     └──────┬───────┘
│ first_name       │    │ employee_id (UUID)│            │
│ last_name        │    │ total_amount     │     ┌──────▼───────┐
│ document_type    │    │ payment_method   │     │vehicle_images│
│ document_number  │    │ status           │     │──────────────│
│ birth_date       │    │ sale_date        │     │ id (BIGSER)  │
│ address          │    │ notes            │     │ vehicle_id   │
│ city             │    └────────┬─────────┘     │ url          │
└────────┬─────────┘             │               │ is_primary   │
         │                      │               │ sort_order   │
         │  ┌───────────────────┘               └──────────────┘
         │  │
┌────────▼──▼──────────┐  ┌──────────────────┐
│  customer_contacts   │  │   sale_items     │
│──────────────────────│  │──────────────────│
│ id (BIGSER)          │  │ id (BIGSER)      │
│ customer_id (UUID)   │  │ sale_id (UUID)   │
│ type (VARCHAR)       │  │ vehicle_id (UUID)│
│ value (VARCHAR)      │  │ unit_price       │
└──────────────────────┘  │ discount         │
                          └──────────────────┘
```

## Tablas y descripción

| Tabla | Propósito | PK | FK |
|-------|-----------|----|----|
| `users` | Usuarios del sistema | UUID | - |
| `roles` | Catálogo de roles | BIGSERIAL | - |
| `user_roles` | Asignación rol-usuario | (UUID, BIGINT) | users.id, roles.id |
| `employees` | Datos laborales | UUID | users.id |
| `customers` | Clientes | UUID | users.id |
| `customer_contacts` | Contactos del cliente | BIGSERIAL | customers.id |
| `brands` | Marcas de vehículos | BIGSERIAL | - |
| `vehicle_types` | Tipos de vehículo | BIGSERIAL | - |
| `vehicles` | Inventario | UUID | brands.id, vehicle_types.id |
| `vehicle_images` | Imágenes del vehículo | BIGSERIAL | vehicles.id |
| `sales` | Ventas realizadas | UUID | customers.id, employees.id |
| `sale_items` | Items de cada venta | BIGSERIAL | sales.id, vehicles.id |
| `payments` | Pagos/ financiación | UUID | sales.id |
| `inventory_movements` | Auditoría de inventario | BIGSERIAL | vehicles.id |

## Enums

### vehicle_status
- `AVAILABLE` — Disponible para la venta
- `RESERVED` — Apartado por un cliente
- `SOLD` — Vendido
- `IN_MAINTENANCE` — En mantenimiento

### fuel_type
- `GASOLINE`, `DIESEL`, `ELECTRIC`, `HYBRID`, `GAS`

### sale_status
- `PENDING`, `COMPLETED`, `CANCELLED`, `REFUNDED`

### payment_method
- `CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `FINANCING`

### document_type
- `CC`, `CE`, `NIT`, `PASSPORT`

### vehicle_type_name
- `CAR`, `MOTORCYCLE`, `SUV`, `TRUCK`, `ELECTRIC`, `VAN`

## Vistas

### v_available_vehicles
Vehículos disponibles con marca, tipo e imagen principal.

### v_monthly_sales
Resumen de ventas agrupado por mes.

### v_top_customers
Top clientes por monto total gastado.

## Seed data

```sql
-- Admin por defecto
email:    admin@concesionario.com
password: Admin1234!
rol:      ROLE_ADMIN
```
