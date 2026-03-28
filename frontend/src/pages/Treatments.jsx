import { useState, useEffect } from 'react';
import treatmentService from '../services/treatmentService';
import { formatCurrency, formatDuration } from '../utils/formatters';
import './Treatments.css';

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const data = await treatmentService.getAll();
      setTreatments(data);
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
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes),
      };
      if (editingTreatment) {
        await treatmentService.update(editingTreatment.id, data);
      } else {
        await treatmentService.create(data);
      }
      await fetchTreatments();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      name: treatment.name,
      description: treatment.description || '',
      price: treatment.price.toString(),
      durationMinutes: treatment.durationMinutes.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este tratamiento?')) {
      return;
    }
    setError(null);
    try {
      await treatmentService.delete(id);
      await fetchTreatments();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTreatment(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      durationMinutes: '',
    });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="treatments-page">
      <div className="page-header">
        <h1 className="page-title">Tratamientos</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuevo Tratamiento
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTreatment ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
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
                <label className="form-label">Descripción</label>
                <textarea
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio (CLP) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duración (minutos) *</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    className="form-input"
                    value={formData.durationMinutes}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTreatment ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        {treatments.length === 0 ? (
          <p className="empty-state">No hay tratamientos registrados</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td><strong>{treatment.name}</strong></td>
                  <td>{treatment.description || '-'}</td>
                  <td>{formatCurrency(treatment.price)}</td>
                  <td>{formatDuration(treatment.durationMinutes)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => handleEdit(treatment)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(treatment.id)}
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

export default Treatments;
