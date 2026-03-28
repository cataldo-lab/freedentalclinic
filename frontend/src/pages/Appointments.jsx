import { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';
import dentistService from '../services/dentistService';
import treatmentService from '../services/treatmentService';
import './Appointments.css';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    dentistId: '',
  });
  const [formData, setFormData] = useState({
    patientId: '',
    dentistId: '',
    treatmentId: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'scheduled',
    notes: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, patientsData, dentistsData, treatmentsData] = await Promise.all([
        appointmentService.getAll(filters),
        patientService.getAll(),
        dentistService.getAll(),
        treatmentService.getAll(),
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDentists(dentistsData);
      setTreatments(treatmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingAppointment) {
        await appointmentService.update(editingAppointment.id, formData);
      } else {
        await appointmentService.create(formData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId.toString(),
      dentistId: appointment.dentistId.toString(),
      treatmentId: appointment.treatmentId.toString(),
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      notes: appointment.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      return;
    }
    setError(null);
    try {
      await appointmentService.delete(id);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
    setFormData({
      patientId: '',
      dentistId: '',
      treatmentId: '',
      appointmentDate: '',
      appointmentTime: '',
      status: 'scheduled',
      notes: '',
    });
  };

  const getStatusBadge = (status) => {
    const statusLabels = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No Asistió',
    };
    return <span className={`badge badge-${status}`}>{statusLabels[status]}</span>;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1 className="page-title">Citas</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nueva Cita
          </button>
        </div>
      </div>

      <div className="filters card">
        <div className="filters-row">
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              name="status"
              className="form-input"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="scheduled">Programada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
              <option value="no_show">No Asistió</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Dentista</label>
            <select
              name="dentistId"
              className="form-input"
              value={filters.dentistId}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} {d.lastName}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary" onClick={applyFilters}>
            Filtrar
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAppointment ? 'Editar Cita' : 'Nueva Cita'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Paciente *</label>
                <select
                  name="patientId"
                  className="form-input"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Dentista *</label>
                <select
                  name="dentistId"
                  className="form-input"
                  value={formData.dentistId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar dentista</option>
                  {dentists.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.name} {d.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tratamiento *</label>
                <select
                  name="treatmentId"
                  className="form-input"
                  value={formData.treatmentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar tratamiento</option>
                  {treatments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    className="form-input"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora *</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    className="form-input"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="scheduled">Programada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="no_show">No Asistió</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notas</label>
                <textarea
                  name="notes"
                  className="form-input"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAppointment ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        {appointments.length === 0 ? (
          <p className="empty-state">No hay citas programadas</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Dentista</th>
                <th>Tratamiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.patient?.name} {appointment.patient?.lastName}</td>
                  <td>Dr. {appointment.dentist?.name} {appointment.dentist?.lastName}</td>
                  <td>{appointment.treatment?.name}</td>
                  <td>{getStatusBadge(appointment.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => handleEdit(appointment)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(appointment.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Appointments;
