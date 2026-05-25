-- =========================================================
-- SCRIPT SQL COMPLETO — Sistema de Concesionario
-- Base de datos: Supabase (PostgreSQL 15+)
-- Ejecutar en orden en el SQL Editor de Supabase
-- =========================================================

-- ---- Extensiones ----
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- TABLA: roles
-- =========================================================
CREATE TABLE IF NOT EXISTS roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE CHECK (name IN ('ROLE_ADMIN','ROLE_MANAGER','ROLE_SELLER')),
    description VARCHAR(255)
);

INSERT INTO roles (name, description) VALUES
    ('ROLE_ADMIN',   'Administrador con acceso total al sistema'),
    ('ROLE_MANAGER', 'Gerente con acceso a reportes y empleados'),
    ('ROLE_SELLER',  'Vendedor con acceso a clientes y ventas')
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- TABLA: users
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ,
    created_by    VARCHAR(100),
    updated_by    VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =========================================================
-- TABLA: user_roles (relación N:N)
-- =========================================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- =========================================================
-- TABLA: employees
-- =========================================================
CREATE TABLE IF NOT EXISTS employees (
    id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID         NOT NULL UNIQUE REFERENCES users(id),
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    employee_code VARCHAR(20)  NOT NULL UNIQUE,
    department    VARCHAR(100),
    hire_date     DATE         NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ,
    created_by    VARCHAR(100),
    updated_by    VARCHAR(100)
);

-- =========================================================
-- TABLA: customers
-- =========================================================
CREATE TABLE IF NOT EXISTS customers (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        REFERENCES users(id),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    document_type   VARCHAR(20)  NOT NULL CHECK (document_type IN ('CC','CE','NIT','PASSPORT')),
    document_number VARCHAR(30)  NOT NULL UNIQUE,
    birth_date      DATE,
    address         VARCHAR(200),
    city            VARCHAR(50),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_customer_document ON customers(document_number);

-- =========================================================
-- TABLA: customer_contacts
-- =========================================================
CREATE TABLE IF NOT EXISTS customer_contacts (
    id          BIGSERIAL   PRIMARY KEY,
    customer_id UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL CHECK (type IN ('EMAIL','PHONE','WHATSAPP','ADDRESS')),
    value       VARCHAR(150) NOT NULL
);

-- =========================================================
-- TABLA: brands
-- =========================================================
CREATE TABLE IF NOT EXISTS brands (
    id       BIGSERIAL    PRIMARY KEY,
    name     VARCHAR(100) NOT NULL UNIQUE,
    country  VARCHAR(100),
    logo_url TEXT
);

INSERT INTO brands (name, country) VALUES
    ('Toyota', 'Japón'), ('Honda', 'Japón'), ('Chevrolet', 'Estados Unidos'),
    ('Ford', 'Estados Unidos'), ('Nissan', 'Japón'), ('BMW', 'Alemania'),
    ('Mercedes-Benz', 'Alemania'), ('Audi', 'Alemania'), ('Kia', 'Corea del Sur'),
    ('Hyundai', 'Corea del Sur'), ('Renault', 'Francia'), ('Mazda', 'Japón'),
    ('Tesla', 'Estados Unidos'), ('Suzuki', 'Japón'), ('Volkswagen', 'Alemania')
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- TABLA: vehicle_types
-- =========================================================
CREATE TABLE IF NOT EXISTS vehicle_types (
    id          BIGSERIAL   PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('CAR','MOTORCYCLE','SUV','TRUCK','ELECTRIC','VAN')),
    description VARCHAR(255)
);

INSERT INTO vehicle_types (name, description) VALUES
    ('CAR',        'Automóvil sedán o hatchback'),
    ('MOTORCYCLE', 'Motocicleta de cualquier cilindrada'),
    ('SUV',        'Camioneta SUV o pickup'),
    ('TRUCK',      'Camión de carga o trabajo'),
    ('ELECTRIC',   'Vehículo 100% eléctrico'),
    ('VAN',        'Furgoneta o van')
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- TABLA: vehicles
-- =========================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id     BIGINT         NOT NULL REFERENCES brands(id),
    type_id      BIGINT         NOT NULL REFERENCES vehicle_types(id),
    model        VARCHAR(150)   NOT NULL,
    year         INTEGER        NOT NULL CHECK (year BETWEEN 1900 AND 2030),
    price        NUMERIC(14,2)  NOT NULL CHECK (price > 0),
    color        VARCHAR(50),
    fuel_type    VARCHAR(30)    CHECK (fuel_type IN ('GASOLINE','DIESEL','ELECTRIC','HYBRID','GAS')),
    status       VARCHAR(20)    NOT NULL DEFAULT 'AVAILABLE'
                                CHECK (status IN ('AVAILABLE','SOLD','RESERVED','IN_MAINTENANCE')),
    mileage      INTEGER        CHECK (mileage >= 0),
    engine_cc    INTEGER,
    transmission VARCHAR(20),
    description  TEXT,
    vin_code     VARCHAR(50)    UNIQUE,
    deleted      BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ,
    created_by   VARCHAR(100),
    updated_by   VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_status   ON vehicles(status) WHERE deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_vehicle_brand    ON vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_type     ON vehicles(type_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_year     ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicle_price    ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicle_deleted  ON vehicles(deleted);

-- =========================================================
-- TABLA: vehicle_images
-- =========================================================
CREATE TABLE IF NOT EXISTS vehicle_images (
    id         BIGSERIAL  PRIMARY KEY,
    vehicle_id UUID       NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    url        TEXT       NOT NULL,
    is_primary BOOLEAN    NOT NULL DEFAULT FALSE,
    sort_order INTEGER    NOT NULL DEFAULT 0
);

-- Solo una imagen primaria por vehículo
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicle_primary_image
    ON vehicle_images(vehicle_id) WHERE is_primary = TRUE;

-- =========================================================
-- TABLA: sales
-- =========================================================
CREATE TABLE IF NOT EXISTS sales (
    id             UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id    UUID           NOT NULL REFERENCES customers(id),
    employee_id    UUID           NOT NULL REFERENCES employees(id),
    total_amount   NUMERIC(14,2)  NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(30)    NOT NULL
                                  CHECK (payment_method IN ('CASH','CREDIT_CARD','DEBIT_CARD','BANK_TRANSFER','FINANCING')),
    status         VARCHAR(20)    NOT NULL DEFAULT 'PENDING'
                                  CHECK (status IN ('PENDING','COMPLETED','CANCELLED','REFUNDED')),
    sale_date      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    notes          TEXT,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ,
    created_by     VARCHAR(100),
    updated_by     VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_sale_customer  ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_employee  ON sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sale_date      ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_status    ON sales(status);

-- =========================================================
-- TABLA: sale_items
-- =========================================================
CREATE TABLE IF NOT EXISTS sale_items (
    id         BIGSERIAL     PRIMARY KEY,
    sale_id    UUID          NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    vehicle_id UUID          NOT NULL REFERENCES vehicles(id),
    unit_price NUMERIC(14,2) NOT NULL CHECK (unit_price > 0),
    discount   NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (discount BETWEEN 0 AND 100)
);

-- =========================================================
-- TABLA: payments
-- =========================================================
CREATE TABLE IF NOT EXISTS payments (
    id                 UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id            UUID           NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    method             VARCHAR(30)    NOT NULL,
    amount             NUMERIC(14,2)  NOT NULL CHECK (amount > 0),
    installments       INTEGER        CHECK (installments > 0),
    installment_amount NUMERIC(14,2),
    payment_date       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    reference_number   VARCHAR(100)
);

-- =========================================================
-- TABLA: inventory_movements
-- =========================================================
CREATE TABLE IF NOT EXISTS inventory_movements (
    id            BIGSERIAL    PRIMARY KEY,
    vehicle_id    UUID         NOT NULL REFERENCES vehicles(id),
    movement_type VARCHAR(30)  NOT NULL CHECK (movement_type IN ('ENTRY','EXIT','STATUS_CHANGE','MAINTENANCE')),
    reason        VARCHAR(255),
    performed_by  UUID         REFERENCES users(id),
    movement_date TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ,
    created_by    VARCHAR(100),
    updated_by    VARCHAR(100)
);

-- =========================================================
-- VISTAS ÚTILES PARA REPORTES
-- =========================================================

-- Vista: vehículos disponibles con detalles
CREATE OR REPLACE VIEW v_available_vehicles AS
SELECT
    v.id, b.name AS brand, vt.name AS type,
    v.model, v.year, v.price, v.color,
    v.fuel_type, v.mileage,
    vi.url AS primary_image
FROM vehicles v
JOIN brands b ON b.id = v.brand_id
JOIN vehicle_types vt ON vt.id = v.type_id
LEFT JOIN vehicle_images vi ON vi.vehicle_id = v.id AND vi.is_primary = TRUE
WHERE v.status = 'AVAILABLE' AND v.deleted = FALSE;

-- Vista: resumen de ventas mensuales
CREATE OR REPLACE VIEW v_monthly_sales AS
SELECT
    DATE_TRUNC('month', sale_date) AS month,
    COUNT(*) AS total_sales,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_sale
FROM sales
WHERE status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', sale_date)
ORDER BY month DESC;

-- Vista: top clientes
CREATE OR REPLACE VIEW v_top_customers AS
SELECT
    c.id, c.first_name, c.last_name, c.document_number,
    COUNT(s.id) AS total_purchases,
    SUM(s.total_amount) AS total_spent
FROM customers c
JOIN sales s ON s.customer_id = c.id AND s.status = 'COMPLETED'
GROUP BY c.id, c.first_name, c.last_name, c.document_number
ORDER BY total_spent DESC;

-- =========================================================
-- ROW LEVEL SECURITY (Supabase)
-- Descomentar si usas el cliente JS de Supabase directamente
-- =========================================================
-- ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Lectura pública de vehículos disponibles"
--   ON vehicles FOR SELECT
--   USING (status = 'AVAILABLE' AND deleted = FALSE);

-- =========================================================
-- DATOS INICIALES DE PRUEBA (dev only)
-- =========================================================
-- Insertar usuario admin (password: Admin1234!)
-- El hash es BCrypt de 'Admin1234!'
INSERT INTO users (email, password_hash, active) VALUES
    ('admin@concesionario.com',
     '$2b$12$qDNkyZVumS8UBt8Pp6Akg..fsAHOz4WG.lyobOaJ9wGIKosNKAG42',
     TRUE)
ON CONFLICT (email) DO NOTHING;

-- Actualizar hash por si el usuario ya existía con otro hash
UPDATE users SET password_hash = '$2b$12$qDNkyZVumS8UBt8Pp6Akg..fsAHOz4WG.lyobOaJ9wGIKosNKAG42'
WHERE email = 'admin@concesionario.com';

-- Asignar rol ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@concesionario.com' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Empleado base
INSERT INTO employees (user_id, first_name, last_name, employee_code, department, hire_date)
SELECT u.id, 'Sistema', 'Admin', 'EMP-001', 'Administración', CURRENT_DATE
FROM users u WHERE u.email = 'admin@concesionario.com'
ON CONFLICT (employee_code) DO NOTHING;
