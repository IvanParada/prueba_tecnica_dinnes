# Prueba Técnica Dinnes

Sistema web para registrar y administrar solicitudes de atención de clientes.

El proyecto está compuesto por una API REST desarrollada con NestJS, una aplicación web desarrollada con Angular y una base de datos PostgreSQL.

## Funcionalidades principales

- Inicio de sesión mediante credenciales fijas y JWT.
- Cierre de sesión.
- Protección de rutas privadas.
- Dashboard con:
  - Total de solicitudes.
  - Solicitudes pendientes.
  - Solicitudes finalizadas.
  - Solicitudes en proceso.
- Listado paginado de solicitudes.
- Búsqueda por número, descripción, cliente, correo o teléfono.
- Filtro por estado.
- Ordenamiento por fecha.
- Creación de solicitudes mediante modal.
- Edición de solicitudes mediante modal.
- Finalización de solicitudes.
- Eliminación de solicitudes.
- Validaciones en frontend y backend.
- Autocompletado de datos de clientes mediante una API externa.
- Documentación de la API mediante Swagger.
- Interfaz responsive.

Cada solicitud contiene:

- Número.
- Fecha.
- Cliente.
- Correo electrónico.
- Teléfono.
- Tipo de solicitud.
- Descripción.
- Estado.

Los estados disponibles son:

- `Pendiente`
- `En proceso`
- `Finalizada`
- `Rechazada`

## Tecnologías utilizadas

### Backend

- NestJS.
- TypeScript.
- TypeORM.
- PostgreSQL.
- JWT para autenticación.
- Swagger para documentación de la API.
- Docker Compose para la base de datos.

### Frontend

- Angular.
- TypeScript.
- Tailwind CSS.
- DaisyUI.

## Arquitectura del proyecto

El proyecto está organizado como un monorepo con dos aplicaciones independientes:

```text
.
├── backend
│   ├── database
│   │   └── init.sql
│   ├── src
│   │   ├── auth
│   │   ├── customers
│   │   ├── dashboard
│   │   └── service-requests
│   ├── .env.example
│   ├── docker-compose.yml
│   └── package.json
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── core
│   │   │   ├── features
│   │   │   └── layouts
│   │   └── environments
│   └── package.json
└── README.md
```

### Backend

El backend utiliza una arquitectura modular por dominio en NestJS:

- `auth`: autenticación simplificada mediante JWT.
- `customers`: consulta externa y persistencia de clientes.
- `service-requests`: administración de solicitudes.
- `dashboard`: estadísticas generales de solicitudes.

La persistencia se realiza mediante TypeORM y PostgreSQL.

### Frontend

El frontend utiliza una arquitectura basada en features:

- `auth`
- `dashboard`
- `service-requests`

Cada feature mantiene sus propios componentes, servicios, interfaces y enumeraciones.

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js.
- npm.
- Docker.
- Docker Compose.

No es necesario instalar PostgreSQL directamente si se utiliza Docker Compose.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/IvanParada/prueba_tecnica_dinnes.git
cd prueba_tecnica_dinnes
```

### 2. Base de datos

El archivo `docker-compose.yml` se encuentra dentro de la carpeta `backend`.

Ingresar a la carpeta:

```bash
cd backend
```

Levantar PostgreSQL:

```bash
docker compose up -d
```


El archivo `database/init.sql` se ejecuta automáticamente durante la primera inicialización de PostgreSQL.

Este script:

- Crea los tipos enumerados.
- Crea las tablas `customers` y `service_requests`.
- Configura la relación entre clientes y solicitudes.
- Crea los índices.
- Inserta 10 clientes iniciales.
- Inserta 50 solicitudes de ejemplo.

El script solo se ejecuta cuando el volumen de PostgreSQL está vacío.

Para reinicializar completamente la base de datos:

```bash
docker compose down -v
docker compose up -d
```

> Advertencia: `docker compose down -v` elimina completamente los datos almacenados en PostgreSQL.

### 3. Backend

Desde la carpeta `backend`, instalar las dependencias:

```bash
npm install
```

Antes de iniciar el backend, copiar o renombrar el archivo:

```text
.env.example
```

como:

```text
.env
```

El archivo `.env` contiene la configuración de conexión a PostgreSQL, las credenciales de acceso, la clave utilizada para JWT y la configuración de la API externa.

Iniciar el backend en modo desarrollo:

```bash
npm run start:dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

### 4. Frontend

Abrir otra terminal e ingresar a la carpeta `frontend`:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar la aplicación Angular:

```bash
npm start
```

El frontend estará disponible en:

```text
http://localhost:4200
```

## Variables de entorno

El backend utiliza un archivo `.env` con la siguiente configuración de desarrollo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinnes_db
DB_USERNAME=dinnes_user
DB_PASSWORD=dinnes_pass

AUTH_EMAIL=admin@dinnes.cl
AUTH_PASSWORD=admin123
JWT_SECRET=clave_secreta_prueba_tecnica

CUSTOMER_API_URL=https://jsonplaceholder.typicode.com/users
CUSTOMER_API_TIMEOUT=3000
```

### Descripción de variables

- `PORT`: puerto utilizado por el backend.
- `DB_HOST`: host de PostgreSQL.
- `DB_PORT`: puerto de PostgreSQL.
- `DB_NAME`: nombre de la base de datos.
- `DB_USERNAME`: usuario de PostgreSQL.
- `DB_PASSWORD`: contraseña de PostgreSQL.
- `AUTH_EMAIL`: correo autorizado para iniciar sesión.
- `AUTH_PASSWORD`: contraseña autorizada para iniciar sesión.
- `JWT_SECRET`: clave utilizada para firmar los tokens JWT.
- `CUSTOMER_API_URL`: URL del servicio externo de clientes.
- `CUSTOMER_API_TIMEOUT`: tiempo máximo de espera de la API externa en milisegundos.

## Credenciales de acceso

Para ingresar al sistema se pueden utilizar las siguientes credenciales:

```text
Correo: admin@dinnes.cl
Contraseña: admin123
```

Estas credenciales se configuran mediante las variables `AUTH_EMAIL` y `AUTH_PASSWORD`.

## Documentación Swagger

La API está documentada mediante Swagger.

Con el backend ejecutándose, la documentación estará disponible en:

```text
http://localhost:3000/api/docs
```

Desde Swagger se pueden revisar y probar los endpoints del backend.

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/solicitudes` | Listar solicitudes |
| `GET` | `/api/solicitudes/:id` | Obtener una solicitud por ID |
| `POST` | `/api/solicitudes` | Crear una solicitud |
| `PUT` | `/api/solicitudes/:id` | Actualizar una solicitud |
| `DELETE` | `/api/solicitudes/:id` | Eliminar una solicitud |
| `GET` | `/api/dashboard` | Obtener estadísticas |
| `GET` | `/api/clientes/lookup` | Consultar cliente externo por correo |

### Parámetros del listado

El endpoint `GET /api/solicitudes` admite los siguientes parámetros:

- `page`: página solicitada.
- `limit`: cantidad de registros por página.
- `search`: texto de búsqueda.
- `status`: estado de la solicitud.
- `sortOrder`: orden por fecha, utilizando `ASC` o `DESC`.

Ejemplo:

```text
GET /api/solicitudes?page=1&limit=10&search=&status=Pendiente&sortOrder=DESC
```

## Integración externa de clientes

En el formulario de creación y edición se puede buscar un cliente mediante su correo electrónico.

El flujo es el siguiente:

1. El frontend envía el correo al backend.
2. El backend consulta la API pública JSONPlaceholder.
3. Si el correo existe, se completan automáticamente el nombre, correo y teléfono.
4. Si no existe, el usuario puede completar los datos manualmente.
5. Al guardar la solicitud, el cliente se crea o actualiza en PostgreSQL.

La consulta externa solo reconoce correos existentes en JSONPlaceholder.

Correo válido para probar la funcionalidad:

```text
Sincere@april.biz
```

Resultado esperado:

```text
Nombre: Leanne Graham
Correo: Sincere@april.biz
Teléfono: 1-770-736-8031 x56442
```

La integración contempla:

- Cliente externo no encontrado.
- Tiempo de espera excedido.
- Indisponibilidad de la API externa.
- Ingreso manual de datos cuando no existe información externa.

## Decisiones técnicas

### Autenticación

Se implementó una autenticación simplificada mediante credenciales fijas y JWT.

No se incluyeron:

- Registro de usuarios.
- Recuperación de contraseña.
- Administración de usuarios.
- Roles.
- Autorización por perfiles.

Estas funcionalidades no forman parte del alcance requerido para la prueba técnica.

### Fecha de solicitud

El campo `date` representa la fecha asociada a la solicitud.

Al crear una solicitud se inicializa con la fecha actual, pero puede modificarse para registrar solicitudes recibidas anteriormente.

El listado se ordena utilizando este campo. Cuando existen varias solicitudes con la misma fecha, se utiliza el identificador como segundo criterio de ordenamiento.

### Número de solicitud

El campo de número incluye el prefijo:

```text
SOL-
```

El usuario puede ingresar una forma abreviada:

```text
SOL-1
```

El número de solicitud debe ser único.

La validación se realiza tanto en el frontend como en el backend.

### Clientes

Los clientes se almacenan en una tabla independiente.

Cuando se crea o actualiza una solicitud:

- Se busca el cliente por correo electrónico.
- Si existe, se actualizan sus datos.
- Si no existe, se crea un nuevo cliente.
- La solicitud se relaciona con el cliente correspondiente.

### Integración externa

JSONPlaceholder se utilizó como API pública para demostrar:

- Consumo de un servicio REST externo.
- Autocompletado de datos.
- Manejo de errores.
- Manejo de timeout.
- Separación entre la integración externa y la persistencia local.

La API externa no reemplaza la base de datos local.

### Arquitectura

El backend está organizado mediante módulos por dominio en NestJS.

El frontend utiliza una arquitectura basada en features, manteniendo separados:

- Componentes.
- Servicios.
- Interfaces.
- Enumeraciones.
- Páginas y formularios.

Esta organización facilita la separación de responsabilidades y el mantenimiento del proyecto.

### Base de datos

Se utilizó PostgreSQL con TypeORM.

La entidad `Customer` mantiene una relación uno a muchos con `ServiceRequest`.

El script de inicialización incluye índices para los campos utilizados en:

- Ordenamiento.
- Filtros.
- Relaciones.
- Consultas frecuentes.

### Interfaz

Tailwind CSS y DaisyUI se utilizaron para implementar componentes visuales consistentes y responsive.

La prioridad fue mantener una interfaz clara, funcional y reutilizable, sin desarrollar un sistema de diseño personalizado.

## Mejoras futuras

- Agregar tests unitarios y de integración.
- Implementar migraciones de TypeORM.
- Generar automáticamente el número de solicitud.
- Consultar primero la base de datos local antes de utilizar la API externa.
- Reemplazar las confirmaciones nativas por modales reutilizables.
- Agregar logging centralizado.
- Configurar CI/CD.
- Desplegar el frontend, backend y base de datos.