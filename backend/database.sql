-- dentalLINK Database Schema

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dentists table
CREATE TABLE IF NOT EXISTS dentists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialty VARCHAR(100),
    phone VARCHAR(20),
    license_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Treatments table
CREATE TABLE IF NOT EXISTS treatments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id INTEGER NOT NULL REFERENCES dentists(id) ON DELETE CASCADE,
    treatment_id INTEGER NOT NULL REFERENCES treatments(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical Records table
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id INTEGER REFERENCES dentists(id) ON DELETE SET NULL,
    allergies TEXT,
    medical_conditions TEXT,
    medications TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dentist ON appointments(dentist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_dentists_email ON dentists(email);

-- Insert sample data
INSERT INTO patients (name, last_name, email, phone, date_of_birth) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '612345678', '1985-03-15'),
('María', 'García', 'maria.garcia@email.com', '623456789', '1990-07-22'),
('Carlos', 'López', 'carlos.lopez@email.com', '634567890', '1978-11-08');

INSERT INTO dentists (name, last_name, email, specialty, phone, license_number) VALUES
('Roberto', 'Martínez', 'dr.martinez@clinic.com', 'Ortodoncia', '645678901', 'ORT-001'),
('Ana', 'Rodríguez', 'dr.rodriguez@clinic.com', 'Endodoncia', '656789012', 'END-002'),
('Luis', 'Sánchez', 'dr.sanchez@clinic.com', 'General', '667890123', 'GEN-003');

INSERT INTO treatments (name, description, price, duration_minutes) VALUES
('Limpieza Dental', 'Limpieza y prophylaxis dental', 40000, 60),
('Empaste', 'Obturación dental con composite', 60000, 45),
('Extracción', 'Extracción dental simple', 50000, 30),
('Blanqueamiento', 'Blanqueamiento dental profesional', 150000, 90),
('Ortodoncia', 'Tratamiento de ortodoncia', 800000, 60),
('Endodoncia', 'Tratamiento de conducto', 250000, 90),
('Corona', 'Colocación de corona dental', 350000, 90),
('Implante', 'Implante dental', 600000, 120),
('Radiografía', 'Radiografía periapical', 15000, 15),
('Sellante', 'Aplicación de sellante', 25000, 30);

INSERT INTO appointments (patient_id, dentist_id, treatment_id, appointment_date, appointment_time, status) VALUES
(1, 1, 1, CURRENT_DATE, '09:00:00', 'scheduled'),
(2, 2, 2, CURRENT_DATE, '10:00:00', 'scheduled'),
(3, 3, 3, CURRENT_DATE + 1, '11:00:00', 'scheduled'),
(1, 2, 4, CURRENT_DATE + 2, '14:00:00', 'scheduled');

INSERT INTO medical_records (patient_id, dentist_id, allergies, medical_conditions, medications) VALUES
(1, 1, 'Ninguna', 'Ninguna', 'Ninguno'),
(2, 2, 'Penicilina', 'Asma', 'Salbutamol'),
(3, 3, 'Ninguna', 'Diabetes tipo 2', 'Metformina');

-- Dental Records table
CREATE TABLE IF NOT EXISTS dental_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id INTEGER REFERENCES dentists(id) ON DELETE SET NULL,
    occlusion VARCHAR(50) DEFAULT 'normal',
    periodontal_status VARCHAR(50) DEFAULT 'sano',
    hygiene_grade VARCHAR(20) DEFAULT 'buena',
    observations TEXT,
    last_update_dentist_id INTEGER REFERENCES dentists(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tooth Records table
CREATE TABLE IF NOT EXISTS tooth_records (
    id SERIAL PRIMARY KEY,
    dental_record_id INTEGER NOT NULL REFERENCES dental_records(id) ON DELETE CASCADE,
    tooth_number VARCHAR(10) NOT NULL,
    position VARCHAR(20) NOT NULL,
    condition VARCHAR(50) DEFAULT 'sano',
    surface VARCHAR(20) DEFAULT 'ninguna',
    mobility VARCHAR(20) DEFAULT 'ninguna',
    BOOLEAN DEFAULT FALSE,
    notes VARCHAR(500),
    last_update_dentist_id INTEGER REFERENCES dentists(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dental_records_patient ON dental_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_tooth_records_dental ON tooth_records(dental_record_id);
