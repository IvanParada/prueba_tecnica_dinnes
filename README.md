# Prueba Técnica Dinnes

Proyecto monorepo con backend (NestJS) y frontend (Angular).

## 📁 Estructura del Proyecto

```
.
├── backend/          # API NestJS
├── frontend/         # Aplicación Angular
├── package.json      # Configuración del monorepo
├── .gitignore        # Ignorar archivos para git
└── README.md         # Este archivo
```

## 🚀 Quick Start

### Instalación de dependencias

```bash
# Instalar todas las dependencias (backend y frontend)
npm install
```

### Desarrollo

```bash
# Iniciar backend en modo watch
npm run start:backend

# Iniciar frontend en modo desarrollo
npm run start:frontend

# Iniciar ambos simultáneamente (en terminales separadas)
npm run start:backend  # Terminal 1
npm run start:frontend # Terminal 2
```

### Build

```bash
# Build del backend
npm run build:backend

# Build del frontend
npm run build:frontend

# Build de ambos
npm run build:all
```

### Testing

```bash
# Tests del backend
npm run test:backend

# Tests del frontend
npm run test:frontend
```

### Linting y Formateo

```bash
# Lint del backend
npm run lint:backend

# Formatear código de ambos proyectos
npm run format:all
```

## 📋 Requisitos Previos

- Node.js v18 o superior
- npm v10 o superior

## 🔧 Configuraciones

### Variables de Entorno

Crear archivos `.env` en cada carpeta si es necesario:

```bash
# backend/.env
NODE_ENV=development
PORT=3000

# frontend/.env
API_URL=http://localhost:3000
```

## 📚 Documentación Adicional

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

**Última actualización:** 2026-07-28
