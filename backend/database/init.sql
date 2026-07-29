-- Tipos enumerados

CREATE TYPE request_status_enum AS ENUM (
    'Pendiente',
    'En proceso',
    'Finalizada',
    'Rechazada'
);

CREATE TYPE request_type_enum AS ENUM (
    'Soporte técnico',
    'Reclamo',
    'Consulta de ventas',
    'Solicitud de información'
);

-- Clientes

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Solicitudes

CREATE TABLE service_requests (
    id SERIAL PRIMARY KEY,
    number VARCHAR(30) NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_id INTEGER NOT NULL,
    request_type request_type_enum NOT NULL,
    description TEXT NOT NULL,
    status request_status_enum NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_service_request_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT
);

-- Índices solicitados

CREATE INDEX idx_service_requests_date
    ON service_requests(date);

CREATE INDEX idx_service_requests_status
    ON service_requests(status);

CREATE INDEX idx_service_requests_customer_id
    ON service_requests(customer_id);

-- Datos iniciales

INSERT INTO customers (
    name,
    email,
    phone
)
VALUES
    (
        'Juan Pérez',
        'juan.perez@example.com',
        '+56912345678'
    ),
    (
        'María González',
        'maria.gonzalez@example.com',
        '+56987654321'
    );

INSERT INTO service_requests (
    number,
    date,
    customer_id,
    request_type,
    description,
    status
)
VALUES
    (
        'SOL-001',
        CURRENT_DATE,
        1,
        'Soporte técnico',
        'Problemas para ingresar al sistema.',
        'Pendiente'
    ),
    (
        'SOL-002',
        CURRENT_DATE,
        2,
        'Reclamo',
        'La cliente reporta una demora en la atención.',
        'En proceso'
    );