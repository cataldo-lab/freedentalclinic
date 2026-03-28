const AppointmentService = require('../src/services/AppointmentService');
const { Appointment, Patient, Dentist, Treatment } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all appointments with filters', async () => {
      const mockAppointments = [
        { id: 1, patientId: 1, dentistId: 1, status: 'scheduled' },
      ];
      const mockFindAll = jest.fn().mockResolvedValue(mockAppointments);
      Appointment.findAll = mockFindAll;

      const result = await AppointmentService.findAll({ status: 'scheduled' });

      expect(result).toEqual(mockAppointments);
      expect(mockFindAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return appointment with associations when found', async () => {
      const mockAppointment = {
        id: 1,
        patientId: 1,
        dentistId: 1,
        treatmentId: 1,
      };
      const mockPatient = { id: 1, name: 'John', lastName: 'Doe' };
      const mockDentist = { id: 1, name: 'Dr. Smith' };
      const mockTreatment = { id: 1, name: 'Cleaning' };

      Appointment.findByPk = jest.fn().mockResolvedValue({
        ...mockAppointment,
        patient: mockPatient,
        dentist: mockDentist,
        treatment: mockTreatment,
      });

      const result = await AppointmentService.findById(1);

      expect(result).toBeDefined();
      expect(Appointment.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it('should return null when appointment not found', async () => {
      Appointment.findByPk = jest.fn().mockResolvedValue(null);

      const result = await AppointmentService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new appointment', async () => {
      const appointmentData = {
        patientId: 1,
        dentistId: 1,
        treatmentId: 1,
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00:00',
        status: 'scheduled',
      };
      const mockCreatedAppointment = { id: 1, ...appointmentData };
      Appointment.create = jest.fn().mockResolvedValue(mockCreatedAppointment);
      Appointment.findByPk = jest.fn().mockResolvedValue(mockCreatedAppointment);

      const result = await AppointmentService.create(appointmentData);

      expect(Appointment.create).toHaveBeenCalledWith(appointmentData);
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update appointment when found', async () => {
      const appointmentData = { status: 'completed' };
      const mockAppointment = {
        id: 1,
        status: 'scheduled',
        update: jest.fn().mockResolvedValue(true),
      };
      Appointment.findByPk = jest.fn().mockResolvedValue(mockAppointment);
      Appointment.findByPk = jest.fn().mockResolvedValue({ ...mockAppointment, ...appointmentData });

      const result = await AppointmentService.update(1, appointmentData);

      expect(mockAppointment.update).toHaveBeenCalledWith(appointmentData);
    });

    it('should return null when appointment not found', async () => {
      Appointment.findByPk = jest.fn().mockResolvedValue(null);

      const result = await AppointmentService.update(999, { status: 'completed' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete appointment when found', async () => {
      const mockAppointment = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Appointment.findByPk = jest.fn().mockResolvedValue(mockAppointment);

      const result = await AppointmentService.delete(1);

      expect(result).toBe(true);
      expect(mockAppointment.destroy).toHaveBeenCalled();
    });

    it('should return false when appointment not found', async () => {
      Appointment.findByPk = jest.fn().mockResolvedValue(null);

      const result = await AppointmentService.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('findByDate', () => {
    it('should return appointments for specific date', async () => {
      const mockAppointments = [
        { id: 1, appointmentDate: '2024-01-15', appointmentTime: '10:00:00' },
      ];
      Appointment.findAll = jest.fn().mockResolvedValue(mockAppointments);

      const result = await AppointmentService.findByDate('2024-01-15');

      expect(result).toEqual(mockAppointments);
      expect(Appointment.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { appointmentDate: '2024-01-15' },
        })
      );
    });
  });
});
