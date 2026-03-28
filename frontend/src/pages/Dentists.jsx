import { useState, useEffect } from 'react';
import dentistService from '../services/dentistService';
import './Dentists.css';

function Dentists() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDentist, setEditingDentist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    specialty: '',
    phone: '',
    licenseNumber: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    setLoading(true);
    try {
      const data = await dentistService.getAll();
      setDentists(data);
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
      if (editingDentist) {
        await dentistService.update(editingDentist.id, formData);
      } else {
        await dentistService.create(formData);
      }
      await fetchDentists();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (dentist) => {
    setEditingDentist(dentist);
    setFormData({
      name: dentist.name,
      lastName: dentist.lastName,
      email: dentist.email,
      specialty: dentist.specialty || '',
      phone: dentist.phone || '',
      licenseNumber: dentist.licenseNumber || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este dentista?')) {
      return;
    }
    setError(null);
    try {
      await dentistService.delete(id);
      await fetchDentists();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingDentist(null);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      specialty: '',
      phone: '',
      licenseNumber: '',
    });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dentists-page">
      <div className="page-header">
        <h1 className="page-title">Dentistas</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuevo Dentista
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDentist ? 'Editar Dentista' : 'Nuevo Dentista'}</h2>
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
                  <label className="form-label">Especialidad</label>
                  <input
                    type="text"
                    name="specialty"
                    className="form-input"
                    value={formData.specialty}
                    onChange={handleInputChange}
                  />
                </div>
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
              </div>
              <div className="form-group">
                <label className="form-label">Número de Licencia</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="form-input"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDentist ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        {dentists.length === 0 ? (
          <p className="empty-state">No hay dentistas registrados</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th>Licencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dentists.map((dentist) => (
                <tr key={dentist.id}>
                  <td>Dr. {dentist.name} {dentist.lastName}</td>
                  <td>{dentist.email}</td>
                  <td>{dentist.specialty || '-'}</td>
                  <td>{dentist.phone || '-'}</td>
                  <td>{dentist.licenseNumber || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => handleEdit(dentist)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(dentist.id)}
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

export default Dentists;
