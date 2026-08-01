# Prueba Técnica DINNES

[![Continuous Integration](https://github.com/IvanParada/prueba_tecnica_dinnes/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanParada/prueba_tecnica_dinnes/actions/workflows/ci.yml)

Sistema web Full Stack para registrar y administrar solicitudes de atención de clientes.

El proyecto está compuesto por:

- API REST desarrollada con NestJS.
- Aplicación web desarrollada con Angular.
- Base de datos PostgreSQL.
- Pruebas automatizadas con Jest.
- Integración continua mediante GitHub Actions.
- Despliegue continuo mediante Render.
- Migraciones de base de datos con TypeORM.

---

## Demo

### Frontend

```text
https://prueba-tecnica-dinnes-web.onrender.com/
```

### API

```text
https://prueba-tecnica-dinnes-api.onrender.com/
```

### Swagger

```text
https://prueba-tecnica-dinnes-api.onrender.com/api/docs
```

### Health Check

```text
https://prueba-tecnica-dinnes-api.onrender.com/api/health
```

> Las credenciales utilizadas en producción se administran mediante variables de entorno y no se almacenan en el repositorio.

---

## Funcionalidades principales

- Inicio de sesión mediante credenciales configurables y JWT.
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
- Creación de solicitudes.
- Edición de solicitudes.
- Finalización de solicitudes.
- Eliminación de solicitudes.
- Validaciones en frontend y backend.
- Autocompletado de datos de clientes mediante una API externa.
- Documentación de API mediante Swagger.
- Interfaz responsive.
- Persistencia mediante PostgreSQL.
- Migraciones automáticas de base de datos.
- Health check de aplicación y base de datos.
- Pruebas automatizadas.
- Integración continua.
- Despliegue continuo.

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

---

# Tecnologías utilizadas

## Backend

- NestJS.
- TypeScript.
- TypeORM.
- PostgreSQL.
- JWT.
- Swagger.
- Jest.
- Docker Compose.

## Frontend

- Angular.
- TypeScript.
- Tailwind CSS.
- DaisyUI.

## DevOps

- GitHub Actions.
- Render.
- PostgreSQL administrado en Render.
- CI/CD.
- Health checks.
- Variables de entorno.
- Migraciones TypeORM.

---

# Arquitectura del proyecto

El proyecto utiliza una arquitectura monorepo con dos aplicaciones independientes.

```text
.
├── .github
│   └── workflows
│       └── ci.yml
│
├── backend
│   ├── database
│   │   └── init.sql
│   │
│   ├── src
│   │   ├── auth
│   │   ├── customers
│   │   ├── dashboard
│   │   ├── database
│   │   │   └── migrations
│   │   ├── service-requests
│   │   ├── health.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   ├── docker-compose.yml
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── core
│   │   │   ├── features
│   │   │   └── layouts
│   │   └── environments
│   │
│   └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```

---

# Arquitectura del backend

El backend utiliza una arquitectura modular por dominio en NestJS.

### `auth`

Responsable de:

- Autenticación.
- Validación de credenciales.
- Generación de JWT.

### `customers`

Responsable de:

- Gestión de clientes.
- Consulta de información externa.
- Persistencia de clientes.

### `service-requests`

Responsable de:

- Creación de solicitudes.
- Edición.
- Eliminación.
- Búsqueda.
- Filtrado.
- Ordenamiento.
- Paginación.
- Asociación con clientes.

### `dashboard`

Responsable de obtener estadísticas agregadas sobre las solicitudes.

### `database`

Contiene las migraciones utilizadas para crear y evolucionar el esquema PostgreSQL.

---

# Arquitectura del frontend

El frontend utiliza una arquitectura basada en features.

```text
app
├── core
├── features
│   ├── auth
│   ├── dashboard
│   └── service-requests
└── layouts
```

Cada feature mantiene separados:

- Componentes.
- Servicios.
- Interfaces.
- Enumeraciones.
- Páginas.
- Formularios.

Esta estructura busca mantener una clara separación de responsabilidades y facilitar el mantenimiento de la aplicación.

---

# Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js `24.15.0` o superior dentro de la versión 24.
- npm.
- Docker Desktop.
- Docker Compose.

> Docker Desktop incluye Docker y Docker Compose.

No es necesario instalar PostgreSQL directamente si se utiliza la configuración Docker incluida en el proyecto.

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/IvanParada/prueba_tecnica_dinnes.git
cd prueba_tecnica_dinnes
```

## 2. Instalar dependencias

El proyecto utiliza npm workspaces, por lo que las dependencias pueden instalarse desde la raíz:

```bash
npm install
```

Para una instalación reproducible basada en el lockfile:

```bash
npm ci
```

---

# Base de datos local

El archivo `docker-compose.yml` se encuentra en:

```text
backend/docker-compose.yml
```

Ingresar al backend:

```bash
cd backend
```

Levantar PostgreSQL:

```bash
docker compose up -d
```

El archivo:

```text
database/init.sql
```

puede utilizarse para inicializar la base de datos local.

Este script:

- Crea los tipos enumerados.
- Crea las tablas `customers` y `service_requests`.
- Configura las relaciones.
- Crea índices.
- Inserta 10 clientes.
- Inserta 50 solicitudes de ejemplo.

Para eliminar completamente la base local y volver a crearla:

```bash
docker compose down -v
docker compose up -d
```

> `docker compose down -v` elimina permanentemente los datos almacenados en el volumen PostgreSQL.

---

# Variables de entorno

Crear:

```text
backend/.env
```

a partir de:

```text
backend/.env.example
```

Configuración utilizada para desarrollo:

```env
NODE_ENV=development

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinnes_db
DB_USERNAME=dinnes_user
DB_PASSWORD=dinnes_pass

DB_SYNCHRONIZE=true
DB_RUN_MIGRATIONS=false
DB_SSL=false

AUTH_EMAIL=admin@dinnes.cl
AUTH_PASSWORD=admin123
JWT_SECRET=clave_secreta_prueba_tecnica

CUSTOMER_API_URL=https://jsonplaceholder.typicode.com/users
CUSTOMER_API_TIMEOUT=3000
```

## Variables de producción

En producción se utiliza principalmente:

```env
DATABASE_URL=
DB_SYNCHRONIZE=false
DB_RUN_MIGRATIONS=true
DB_SSL=false

AUTH_EMAIL=
AUTH_PASSWORD=
JWT_SECRET=

FRONTEND_URL=
```

### Descripción

| Variable | Descripción |
|---|---|
| `PORT` | Puerto utilizado por NestJS |
| `DATABASE_URL` | URL completa de PostgreSQL en producción |
| `DB_HOST` | Host de PostgreSQL local |
| `DB_PORT` | Puerto PostgreSQL |
| `DB_NAME` | Nombre de la base |
| `DB_USERNAME` | Usuario PostgreSQL |
| `DB_PASSWORD` | Contraseña PostgreSQL |
| `DB_SYNCHRONIZE` | Controla la sincronización automática de TypeORM |
| `DB_RUN_MIGRATIONS` | Ejecuta migraciones pendientes al iniciar |
| `DB_SSL` | Habilita SSL para PostgreSQL cuando sea necesario |
| `AUTH_EMAIL` | Correo autorizado |
| `AUTH_PASSWORD` | Contraseña autorizada |
| `JWT_SECRET` | Clave utilizada para firmar JWT |
| `FRONTEND_URL` | Origen autorizado mediante CORS |
| `CUSTOMER_API_URL` | API externa utilizada para clientes |
| `CUSTOMER_API_TIMEOUT` | Timeout de la integración externa |

---

# Ejecución local

Desde la raíz del proyecto:

## Backend

```bash
npm run start:dev --workspace=backend
```

Disponible en:

```text
http://localhost:3000
```

## Frontend

En otra terminal:

```bash
npm start --workspace=frontend
```

Disponible en:

```text
http://localhost:4200
```

---

# Credenciales locales

Para desarrollo local:

```text
Correo: admin@dinnes.cl
Contraseña: admin123
```

Las credenciales se obtienen mediante:

```text
AUTH_EMAIL
AUTH_PASSWORD
```

En producción se configuran directamente como variables de entorno y no se incluyen en el repositorio.

---

# Documentación Swagger

La API está documentada mediante Swagger.

Local:

```text
http://localhost:3000/api/docs
```

Producción:

```text
https://prueba-tecnica-dinnes-api.onrender.com/api/docs
```

Swagger permite visualizar y probar los endpoints disponibles.

---

# Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/solicitudes` | Listar solicitudes |
| `GET` | `/api/solicitudes/:id` | Obtener una solicitud |
| `POST` | `/api/solicitudes` | Crear una solicitud |
| `PUT` | `/api/solicitudes/:id` | Actualizar una solicitud |
| `DELETE` | `/api/solicitudes/:id` | Eliminar una solicitud |
| `GET` | `/api/dashboard` | Obtener estadísticas |
| `GET` | `/api/clientes/lookup` | Consultar cliente externo |
| `GET` | `/api/health` | Health check de aplicación y PostgreSQL |

---

# Parámetros del listado

`GET /api/solicitudes` admite:

- `page`: página solicitada.
- `limit`: cantidad de registros.
- `search`: búsqueda textual.
- `status`: filtro de estado.
- `sortOrder`: orden `ASC` o `DESC`.

Ejemplo:

```text
GET /api/solicitudes?page=1&limit=10&search=&status=Pendiente&sortOrder=DESC
```

---

# Integración externa de clientes

En los formularios de creación y edición se puede consultar información de clientes mediante correo electrónico.

Flujo:

1. Angular envía el correo al backend.
2. NestJS consulta JSONPlaceholder.
3. Si existe información, se completan automáticamente nombre, correo y teléfono.
4. Si no existe, los datos pueden ingresarse manualmente.
5. Al guardar la solicitud, el cliente se crea o actualiza en PostgreSQL.

Correo válido para probar la integración:

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
- Timeout.
- Indisponibilidad del servicio externo.
- Ingreso manual cuando no existe información externa.

La API externa no reemplaza PostgreSQL; solamente se utiliza como fuente de información para autocompletado.

---

# Pruebas automatizadas

El backend posee pruebas unitarias desarrolladas con Jest.

Actualmente se prueban principalmente:

## ServiceRequestsService

- Obtención de una solicitud existente.
- Error cuando una solicitud no existe.
- Creación de solicitudes.
- Normalización de datos.
- Rechazo de números duplicados.
- Creación de clientes.
- Reutilización de clientes existentes.
- Actualización de solicitudes.
- Actualización de clientes.
- Eliminación.
- Manejo de errores.

## AuthService

- Login correcto.
- Generación de JWT.
- Correo inválido.
- Contraseña inválida.

## DashboardService

- Obtención de estadísticas.
- Conteo por estado.
- Manejo de errores del repositorio.

Ejecutar las pruebas:

```bash
npm run test --workspace=backend
```

Ejecutar pruebas con cobertura:

```bash
npm run test:ci --workspace=backend
```

El reporte incluye cobertura de:

- Statements.
- Branches.
- Functions.
- Lines.

---

# Lint

El backend utiliza ESLint y Prettier.

Validar sin modificar archivos:

```bash
npm run lint --workspace=backend
```

Corregir automáticamente problemas de formato:

```bash
npm run lint:fix --workspace=backend
```

El pipeline CI utiliza solamente el comando de validación y nunca modifica archivos automáticamente.

---

# Integración continua

El proyecto utiliza GitHub Actions.

Workflow:

```text
.github/workflows/ci.yml
```

El pipeline se ejecuta automáticamente en:

- Push a `main`.
- Pull Requests hacia `main`.

Flujo:

```text
Commit / Pull Request
        │
        ▼
GitHub Actions
        │
        ├── Instalación de dependencias
        ├── Validación de dependencias nativas
        ├── ESLint
        ├── Jest
        ├── Coverage
        ├── Build NestJS
        └── Build Angular
                │
                ▼
          CI aprobado
```

Si alguno de estos pasos falla, el workflow finaliza con error.

La rama `main` está protegida y requiere que los checks correspondientes finalicen correctamente antes del merge.

---

# Despliegue

La aplicación está desplegada en Render.

La infraestructura está separada en tres componentes:

```text
Render
│
├── Static Site
│   └── Angular
│
├── Web Service
│   └── NestJS
│
└── PostgreSQL
    └── Base de datos administrada
```

## Frontend

Angular se compila y publica como Static Site.

```text
https://prueba-tecnica-dinnes-web.onrender.com
```

## Backend

NestJS se ejecuta como Web Service.

```text
https://prueba-tecnica-dinnes-api.onrender.com
```

El backend escucha el puerto proporcionado por la plataforma y utiliza:

```text
0.0.0.0
```

como interfaz de red.

## PostgreSQL

El backend se conecta a PostgreSQL mediante:

```text
DATABASE_URL
```

La URL se administra mediante variables de entorno y no se almacena en el repositorio.

---

# Migraciones

En producción:

```env
DB_SYNCHRONIZE=false
DB_RUN_MIGRATIONS=true
```

Esto evita depender de:

```typescript
synchronize: true
```

para modificar automáticamente el esquema.

El esquema se administra mediante migraciones TypeORM almacenadas en:

```text
backend/src/database/migrations
```

La migración inicial:

- Crea los enums.
- Crea `customers`.
- Crea `service_requests`.
- Configura la relación entre ambas tablas.
- Crea índices.
- Inserta datos iniciales.

TypeORM registra las migraciones aplicadas en su propia tabla de control.

---

# Health Check

El backend dispone del endpoint:

```http
GET /api/health
```

Este endpoint verifica:

1. Que NestJS esté respondiendo.
2. Que exista conexión con PostgreSQL.

Respuesta esperada:

```json
{
  "status": "ok",
  "database": "up",
  "timestamp": "2026-08-01T00:00:00.000Z"
}
```

Render utiliza esta ruta para verificar el estado del servicio.

---

# CI/CD

El flujo completo del proyecto es:

```text
feature/*
    │
    ▼
Pull Request
    │
    ▼
GitHub Actions
    │
    ├── Lint
    ├── Tests
    ├── Coverage
    └── Build
    │
    ▼
Merge a main
    │
    ▼
Render
    │
    ├── Deploy backend
    └── Deploy frontend
    │
    ▼
Health Check
    │
    ▼
Producción
```

Los servicios de Render observan la rama:

```text
main
```

y realizan despliegues automáticos cuando los cambios aprobados llegan a producción.

---

# Decisiones técnicas

## Autenticación

Se implementó una autenticación simplificada mediante credenciales configurables y JWT.

No se incluyeron:

- Registro de usuarios.
- Recuperación de contraseña.
- Administración de usuarios.
- Roles.
- Autorización por perfiles.

Estas funcionalidades están fuera del alcance original de la prueba técnica.

---

## Fecha de solicitud

El campo `date` representa la fecha asociada a la solicitud.

Al crear una solicitud se inicializa con la fecha actual, pero puede modificarse para registrar solicitudes recibidas anteriormente.

El listado se ordena utilizando este campo.

Cuando varias solicitudes poseen la misma fecha, el identificador se utiliza como segundo criterio de ordenamiento.

---

## Número de solicitud

El número utiliza el prefijo:

```text
SOL-
```

El usuario puede ingresar una forma abreviada:

```text
SOL-1
```

El número debe ser único.

La validación se realiza tanto en frontend como backend.

---

## Clientes

Los clientes se almacenan en una tabla independiente.

Cuando se crea o actualiza una solicitud:

- Se busca el cliente por correo.
- Si existe, se reutiliza y actualiza.
- Si no existe, se crea.
- La solicitud se relaciona con el cliente correspondiente.

Esto evita duplicar innecesariamente clientes.

---

## Integración externa

JSONPlaceholder se utiliza para demostrar:

- Consumo REST.
- Autocompletado.
- Manejo de errores.
- Manejo de timeout.
- Separación entre integración externa y persistencia.

---

## Base de datos

Se utiliza PostgreSQL con TypeORM.

La relación principal es:

```text
Customer
   1
   │
   │
   N
ServiceRequest
```

Los índices se encuentran orientados a:

- Ordenamiento.
- Filtros.
- Relaciones.
- Consultas frecuentes.

En desarrollo se puede utilizar Docker Compose.

En producción se utiliza PostgreSQL administrado en Render.

---

## Reproducibilidad

El repositorio versiona:

```text
package-lock.json
```

Esto permite instalar las mismas versiones de dependencias en desarrollo y en los entornos automatizados.

---

# Mejoras futuras

Aunque el proyecto ya incluye pruebas automatizadas, CI/CD, migraciones y despliegue, existen mejoras que podrían incorporarse posteriormente:

- Pruebas de integración utilizando una base PostgreSQL temporal.
- Pruebas End-to-End del frontend con Playwright.
- Generación automática del número de solicitud.
- Consultar primero la base de datos local antes de utilizar la API externa.
- Reemplazar confirmaciones nativas por modales reutilizables.
- Logging estructurado y centralizado.
- Monitoreo y observabilidad.
- Rate limiting.
- Refresh tokens.
- Gestión real de usuarios y roles.
- Rotación y gestión centralizada de secretos.
- Mayor cobertura automatizada del frontend.

---

# Estado del proyecto

Actualmente el proyecto dispone de:

- [x] Frontend Angular.
- [x] Backend NestJS.
- [x] PostgreSQL.
- [x] API REST.
- [x] JWT.
- [x] Swagger.
- [x] Responsive design.
- [x] Paginación.
- [x] Integración API externa.
- [x] Docker para desarrollo.
- [x] Pruebas automatizadas.
- [x] Reporte de cobertura.
- [x] Migraciones TypeORM.
- [x] GitHub Actions.
- [x] Integración continua.
- [x] Despliegue de frontend.
- [x] Despliegue de backend.
- [x] PostgreSQL administrado.
- [x] Health check.
- [x] Despliegue continuo.

---

# Autor

**Iván Parada**

Repositorio:

```text
https://github.com/IvanParada/prueba_tecnica_dinnes
```
