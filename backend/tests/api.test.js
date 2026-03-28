const request = require('supertest');
const app = require('../src/index');

jest.mock('../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn(),
  },
  connectDB: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/models', () => ({
  Patient: {
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findOne: jest.fn().mockResolvedValue(null),
  },
  Dentist: {
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findOne: jest.fn().mockResolvedValue(null),
  },
  Treatment: {
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
  Appointment: {
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
  MedicalRecord: {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
}));

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/patients', () => {
    it('should return all patients', async () => {
      const response = await request(app).get('/api/patients');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient with valid data', async () => {
      const patientData = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      const response = await request(app)
        .post('/api/patients')
        .send(patientData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 with invalid email', async () => {
      const patientData = {
        name: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/patients')
        .send(patientData);

      expect(response.status).toBe(400);
    });

    it('should return 400 with missing required fields', async () => {
      const patientData = {
        name: 'John',
      };

      const response = await request(app)
        .post('/api/patients')
        .send(patientData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/dentists', () => {
    it('should return all dentists', async () => {
      const response = await request(app).get('/api/dentists');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/dentists', () => {
    it('should create a new dentist with valid data', async () => {
      const dentistData = {
        name: 'Dr. John',
        lastName: 'Doe',
        email: 'drjohn@example.com',
        specialty: 'General',
      };

      const response = await request(app)
        .post('/api/dentists')
        .send(dentistData);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/treatments', () => {
    it('should return all treatments', async () => {
      const response = await request(app).get('/api/treatments');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/treatments', () => {
    it('should create a new treatment with valid data', async () => {
      const treatmentData = {
        name: 'Cleaning',
        description: 'Deep cleaning',
        price: 100.50,
        durationMinutes: 60,
      };

      const response = await request(app)
        .post('/api/treatments')
        .send(treatmentData);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/appointments', () => {
    it('should return all appointments', async () => {
      const response = await request(app).get('/api/appointments');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/appointments', () => {
    it('should create a new appointment with valid data', async () => {
      const appointmentData = {
        patientId: 1,
        dentistId: 1,
        treatmentId: 1,
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00:00',
        status: 'scheduled',
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/medical-records/:patientId', () => {
    it('should return 404 when medical record not found', async () => {
      const response = await request(app).get('/api/medical-records/999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('Invalid routes', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/invalid');
      
      expect(response.status).toBe(404);
    });
  });
});
