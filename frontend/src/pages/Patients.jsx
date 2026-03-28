import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import patientService from '../services/patientService';
import './Patients.css';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingPatient) {
        await patientService.update(editingPatient.id, formData);
      } else {
        await patientService.create(formData);
      }
      await fetchPatients();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone || '',
      address: patient.address || '',
      dateOfBirth: patient.dateOfBirth || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este paciente?')) {
      return;
    }
    setError(null);
    try {
      await patientService.delete(id);
      await fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
    });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="patients-page">
      <div className="page-header">
        <h1 className="page-title">Pacientes</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuevo Paciente
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <textarea
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPatient ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        {patients.length === 0 ? (
          <p className="empty-state">No hay pacientes registrados</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha de Nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name} {patient.lastName}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone || '-'}</td>
                  <td>{patient.dateOfBirth || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/patients/${patient.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Ver
                      </Link>
                      <Link 
                        to={`/patients/${patient.id}/ficha-odontologica`}
                        className="btn btn-secondary btn-sm"
                      >
                        Ficha Dental
                      </Link>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => handleEdit(patient)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(patient.id)}
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

export default Patients;
