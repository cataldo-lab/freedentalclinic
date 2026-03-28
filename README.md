# dentalLINK

Sistema de gestión integral para clínicas dentales construido con el stack PERN (PostgreSQL, Express, React, Node.js).

## Características

- Gestión de pacientes
- Gestión de dentistas
- Catálogo de tratamientos
- Sistema de citas
- Historiales clínicos
- API RESTful completa
- Código modular y desacoplado
- Tests unitarios para backend y frontend

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Docker (opcional)

## Estructura del Proyecto

```
dentalLINK/
├── backend/           # API REST en Node/Express
│   ├── src/
│   │   ├── config/   # Configuraciones
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── tests/
├── docker-compose.yml
└── SPEC.md
```

## Instalación

### 1. Clonar el repositorio

```bash
cd dentalLINK
```

### 2. Configurar la base de datos

#### Opción A: Docker (Recomendado)

```bash
docker-compose up -d
```

#### Opción B: PostgreSQL local

1. Crear una base de datos llamada `dentallink`
2. Copiar `backend/.env.example` a `backend/.env` y configurar las credenciales

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

## Ejecución

### Backend

```bash
cd backend
npm run dev
```

La API estará disponible en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## API Endpoints

### Pacientes
- `GET /api/patients` - Listar pacientes
- `GET /api/patients/:id` - Obtener paciente
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Dentistas
- `GET /api/dentists` - Listar dentistas
- `GET /api/dentists/:id` - Obtener dentista
- `POST /api/dentists` - Crear dentista
- `PUT /api/dentists/:id` - Actualizar dentista
- `DELETE /api/dentists/:id` - Eliminar dentista

### Tratamientos
- `GET /api/treatments` - Listar tratamientos
- `GET /api/treatments/:id` - Obtener tratamiento
- `POST /api/treatments` - Crear tratamiento
- `PUT /api/treatments/:id` - Actualizar tratamiento
- `DELETE /api/treatments/:id` - Eliminar tratamiento

### Citas
- `GET /api/appointments` - Listar citas (con filtros)
- `GET /api/appointments/today` - Citas de hoy
- `GET /api/appointments/:id` - Obtener cita
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Historiales Clínicos
- `GET /api/medical-records/:patientId` - Obtener historial
- `POST /api/medical-records` - Crear historial
- `PUT /api/medical-records/:patientId` - Actualizar historial

## Tecnologías

### Backend
- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL
- Jest (Testing)
- Supertest (API Testing)

### Frontend
- React 18
- Vite
- React Router
- Vitest
- React Testing Library
