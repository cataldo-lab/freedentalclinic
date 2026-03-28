# dentalLINK - Sistema de Gestión Dental

## 1. Project Overview

**Project Name:** dentalLINK
**Project Type:** Full-stack Web Application (PERN Stack)
**Core Functionality:** Sistema de gestión integral para clínicas dentales que permite gestionar pacientes, citas, dentistas, tratamientos e historiales clínicos.
**Target Users:** Administradores de clínica dental, dentistas, secretarios(as)

## 2. Architecture

### Stack Tecnológico
- **Database:** PostgreSQL (v14+)
- **Backend:** Node.js (v18+) con Express.js
- **Frontend:** React (v18+) con Vite
- **Testing:** Jest + Supertest (backend), Vitest + React Testing Library (frontend)

### Estructura del Proyecto (Monorepo)
```
dentalLINK/
├── backend/                 # API REST en Node/Express
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, app)
│   │   ├── controllers/    # Controladores (lógica de negocio)
│   │   ├── routes/         # Rutas de la API
│   │   ├── models/         # Modelos de datos (Sequelize)
│   │   ├── middleware/     # Middlewares personalizados
│   │   ├── services/       # Servicios (lógica reutilizable)
│   │   ├── utils/          # Utilidades
│   │   └── index.js        # Entry point
│   ├── tests/              # Tests unitarios
│   └── package.json
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la app
│   │   ├── services/       # Servicios API
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Contextos de React
│   │   ├── utils/          # Utilidades
│   │   └── main.jsx        # Entry point
│   ├── tests/              # Tests unitarios
│   └── package.json
└── docker-compose.yml      # PostgreSQL container
```

## 3. Database Schema

### Tablas

#### patients (Pacientes)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| phone | VARCHAR(20) | |
| address | TEXT | |
| date_of_birth | DATE | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

#### dentists (Dentistas)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| specialty | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| license_number | VARCHAR(50) | UNIQUE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

#### treatments (Tratamientos)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| price | DECIMAL(10,2) | NOT NULL |
| duration_minutes | INTEGER | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

#### appointments (Citas)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| patient_id | INTEGER | FOREIGN KEY -> patients(id) |
| dentist_id | INTEGER | FOREIGN KEY -> dentists(id) |
| treatment_id | INTEGER | FOREIGN KEY -> treatments(id) |
| appointment_date | DATE | NOT NULL |
| appointment_time | TIME | NOT NULL |
| status | ENUM | 'scheduled', 'completed', 'cancelled', 'no_show' |
| notes | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

#### medical_records (Historiales Clínicos)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| patient_id | INTEGER | FOREIGN KEY -> patients(id), UNIQUE |
| dentist_id | INTEGER | FOREIGN KEY -> dentists(id) |
| allergies | TEXT | |
| medical_conditions | TEXT | |
| medications | TEXT | |
| notes | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

## 4. API Endpoints

### Patients
- `GET /api/patients` - Listar todos los pacientes
- `GET /api/patients/:id` - Obtener paciente por ID
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Dentists
- `GET /api/dentists` - Listar todos los dentistas
- `GET /api/dentists/:id` - Obtener dentista por ID
- `POST /api/dentists` - Crear dentista
- `PUT /api/dentists/:id` - Actualizar dentista
- `DELETE /api/dentists/:id` - Eliminar dentista

### Treatments
- `GET /api/treatments` - Listar tratamientos
- `GET /api/treatments/:id` - Obtener tratamiento por ID
- `POST /api/treatments` - Crear tratamiento
- `PUT /api/treatments/:id` - Actualizar tratamiento
- `DELETE /api/treatments/:id` - Eliminar tratamiento

### Appointments
- `GET /api/appointments` - Listar citas (con filtros)
- `GET /api/appointments/:id` - Obtener cita por ID
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Medical Records
- `GET /api/medical-records/:patientId` - Obtener historial clínico
- `POST /api/medical-records` - Crear historial clínico
- `PUT /api/medical-records/:patientId` - Actualizar historial clínico

## 5. Frontend Pages

### Dashboard (`/`)
- Resumen de estadísticas (citas hoy, pacientes totales, citas próximas)
- Lista de citas del día
- Accesos rápidos

### Pacientes (`/patients`)
- Lista de pacientes con búsqueda
- Formulario para crear/editar paciente
- Ver detalles del paciente

### Dentistas (`/dentists`)
- Lista de dentistas
- Formulario para crear/editar dentista

### Citas (`/appointments`)
- Calendario de citas
- Lista de citas con filtros (fecha, estado, dentista)
- Formulario para crear/editar cita

### Tratamientos (`/treatments`)
- Lista de tratamientos
- Formulario para crear/editar tratamiento

### Historial Clínico (`/patients/:id/medical-record`)
- Ver historial clínico del paciente
- Formulario para editar historial

## 6. Best Practices

### Backend
- Patrón MVC (Model-View-Controller) adaptado a API REST
- Inyección de dependencias
- Manejo de errores centralizado
- Validación de datos con Joi/Zod
- Variables de entorno para configuración
- Logging estructurado

### Frontend
- Componentes funcionales con hooks
- Separación clara de responsabilidades
- Estado global con React Context
- Fetch data con custom hooks
- Componentes UI reutilizables
- CSS Modules o styled-components

### Testing
- Coverage mínimo: 70%
- Tests unitarios para servicios y controladores
- Tests de integración para rutas API
- Tests de componentes React
- Mock de dependencias externas

## 7. Acceptance Criteria

- [ ] Base de datos PostgreSQL configurada con todas las tablas
- [ ] API REST completa con CRUD para todos los módulos
- [ ] Frontend React con todas las páginas implementadas
- [ ] Tests unitarios funcionando para backend (≥70% coverage)
- [ ] Tests unitarios funcionando para frontend
- [ ] Código modular y desacoplado
- [ ] Instrucciones de ejecución en README
