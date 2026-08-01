import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1785556800000 implements MigrationInterface {
  name = 'InitialSchema1785556800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE request_status_enum AS ENUM (
        'Pendiente',
        'En proceso',
        'Finalizada',
        'Rechazada'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE request_type_enum AS ENUM (
        'Soporte técnico',
        'Reclamo',
        'Consulta de ventas',
        'Solicitud de información'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(30) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE service_requests (
        id SERIAL PRIMARY KEY,
        number VARCHAR(30) NOT NULL UNIQUE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        customer_id INTEGER NOT NULL,
        request_type request_type_enum NOT NULL,
        description TEXT NOT NULL,
        status request_status_enum
          NOT NULL
          DEFAULT 'Pendiente',
        created_at TIMESTAMPTZ
          NOT NULL
          DEFAULT NOW(),
        updated_at TIMESTAMPTZ
          NOT NULL
          DEFAULT NOW(),

        CONSTRAINT fk_service_request_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_service_requests_date
      ON service_requests(date)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_service_requests_status
      ON service_requests(status)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_service_requests_customer_id
      ON service_requests(customer_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_service_requests_request_type
      ON service_requests(request_type)
    `);

    await queryRunner.query(`
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
        ),
        (
          'Carlos Soto',
          'carlos.soto@example.com',
          '+56911112222'
        ),
        (
          'Camila Rodríguez',
          'camila.rodriguez@example.com',
          '+56922223333'
        ),
        (
          'Diego Muñoz',
          'diego.munoz@example.com',
          '+56933334444'
        ),
        (
          'Fernanda López',
          'fernanda.lopez@example.com',
          '+56944445555'
        ),
        (
          'Andrés Martínez',
          'andres.martinez@example.com',
          '+56955556666'
        ),
        (
          'Valentina Rojas',
          'valentina.rojas@example.com',
          '+56966667777'
        ),
        (
          'Sebastián Díaz',
          'sebastian.diaz@example.com',
          '+56977778888'
        ),
        (
          'Daniela Silva',
          'daniela.silva@example.com',
          '+56988889999'
        )
    `);

    await queryRunner.query(`
      WITH generated_requests AS (
        SELECT
          series_number,
          CURRENT_DATE
            - ((series_number - 1) % 30)
              AS request_date
        FROM generate_series(1, 50) AS series_number
      )

      INSERT INTO service_requests (
        number,
        date,
        customer_id,
        request_type,
        description,
        status,
        created_at,
        updated_at
      )

      SELECT
        'SOL-' || LPAD(
          generated_requests.series_number::TEXT,
          6,
          '0'
        ),

        generated_requests.request_date,

        (
          (
            generated_requests.series_number - 1
          ) % 10
        ) + 1,

        CASE
          WHEN (
            generated_requests.series_number - 1
          ) % 4 = 0
            THEN 'Soporte técnico'::request_type_enum

          WHEN (
            generated_requests.series_number - 1
          ) % 4 = 1
            THEN 'Reclamo'::request_type_enum

          WHEN (
            generated_requests.series_number - 1
          ) % 4 = 2
            THEN 'Consulta de ventas'::request_type_enum

          ELSE
            'Solicitud de información'::request_type_enum
        END,

        CASE
          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 0
            THEN
              'El cliente presenta problemas para ingresar al sistema.'

          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 1
            THEN
              'El cliente reporta una demora en la atención de su solicitud.'

          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 2
            THEN
              'El cliente consulta por valores y condiciones comerciales.'

          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 3
            THEN
              'El cliente solicita información adicional sobre los servicios disponibles.'

          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 4
            THEN
              'El cliente requiere asistencia para actualizar sus datos personales.'

          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 5
            THEN
              'El cliente informa un problema con el funcionamiento de la plataforma.'

          WHEN (
            generated_requests.series_number - 1
          ) % 8 = 6
            THEN
              'El cliente solicita seguimiento de una atención realizada anteriormente.'

          ELSE
            'El cliente necesita orientación para utilizar uno de los servicios.'
        END,

        CASE
          WHEN (
            generated_requests.series_number - 1
          ) % 4 = 0
            THEN 'Pendiente'::request_status_enum

          WHEN (
            generated_requests.series_number - 1
          ) % 4 = 1
            THEN 'En proceso'::request_status_enum

          WHEN (
            generated_requests.series_number - 1
          ) % 4 = 2
            THEN 'Finalizada'::request_status_enum

          ELSE
            'Rechazada'::request_status_enum
        END,

        generated_requests.request_date::TIMESTAMPTZ
          + INTERVAL '9 hours'
          + (
            (
              generated_requests.series_number - 1
            ) % 8
          ) * INTERVAL '1 hour',

        generated_requests.request_date::TIMESTAMPTZ
          + INTERVAL '10 hours'
          + (
            (
              generated_requests.series_number - 1
            ) % 8
          ) * INTERVAL '1 hour'

      FROM generated_requests
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS service_requests CASCADE
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS customers CASCADE
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS request_status_enum
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS request_type_enum
    `);
  }
}
