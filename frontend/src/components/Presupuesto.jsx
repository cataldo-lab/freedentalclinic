import { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import treatmentService from '../services/treatmentService';
import dentistService from '../services/dentistService';
import medicalHistoryService from '../services/medicalHistoryService';
import { formatCurrency } from '../utils/formatters';
import './Presupuesto.css';

const STATUS_LABELS = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  expired: 'Vencido',
};

const STATUS_COLORS = {
  draft: '#6b7280',
  sent: '#3b82f6',
  accepted: '#22c55e',
  rejected: '#ef4444',
  expired: '#f59e0b',
};

function Presupuesto({ patientId, patientName }) {
  const [budgets, setBudgets] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    dentistId: '',
    discount: 0,
    notes: '',
    validUntil: '',
    items: [],
  });

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsData, treatmentsData, dentistsData] = await Promise.all([
        budgetService.getByPatientId(patientId),
        treatmentService.getAll(),
        dentistService.getAll(),
      ]);
      setBudgets(budgetsData);
      setTreatments(treatmentsData);
      setDentists(dentistsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTreatment = (treatment) => {
    const existing = formData.items.find(item => item.treatmentId === treatment.id);
    if (existing) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.treatmentId === treatment.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        ),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            treatmentId: treatment.id,
            treatmentName: treatment.name,
            unitPrice: treatment.price,
            quantity: 1,
            subtotal: treatment.price,
          },
        ],
      }));
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleQuantityChange = (index, quantity) => {
    const qty = parseInt(quantity) || 1;
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? { ...item, quantity: qty, subtotal: qty * item.unitPrice }
          : item
      ),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = parseInt(formData.discount) || 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const { subtotal, discount, total } = calculateTotals();

    try {
      const data = {
        patientId: parseInt(patientId),
        dentistId: formData.dentistId ? parseInt(formData.dentistId) : null,
        discount,
        notes: formData.notes,
        validUntil: formData.validUntil || null,
        items: formData.items,
      };

      const isNew = !editingBudget;
      if (editingBudget) {
        await budgetService.update(editingBudget.id, data);
      } else {
        await budgetService.create(data);
      }
      
      await fetchData();
      resetForm();

      const treatmentsList = formData.items.map(i => `${i.treatmentName} (x${i.quantity})`).join(', ');
      await medicalHistoryService.addEntry(patientId, {
        type: 'budget',
        title: isNew ? 'Presupuesto Creado' : 'Presupuesto Actualizado',
        description: `Total: ${formatCurrency(total)}. Tratamientos: ${treatmentsList || 'Sin tratamientos'}`,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      dentistId: budget.dentistId || '',
      discount: budget.discount || 0,
      notes: budget.notes || '',
      validUntil: budget.validUntil || '',
      items: budget.items || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este presupuesto?')) return;
    try {
      await budgetService.delete(id);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await budgetService.updateStatus(id, status);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBudget(null);
    setFormData({
      dentistId: '',
      discount: 0,
      notes: '',
      validUntil: '',
      items: [],
    });
  };

  const { subtotal, discount, total } = calculateTotals();

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="presupuesto">
      <div className="presupuesto-header">
        <h3>Presupuestos</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Nuevo Presupuesto
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal presupuesto-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Dentista</label>
                <select
                  className="form-input"
                  value={formData.dentistId}
                  onChange={e => setFormData(prev => ({ ...prev, dentistId: e.target.value }))}
                >
                  <option value="">Seleccionar dentista</option>
                  {dentists.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.name} {d.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="treatments-selector">
                <label className="form-label">Agregar Tratamientos</label>
                <div className="treatments-grid">
                  {treatments.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className="treatment-btn"
                      onClick={() => handleAddTreatment(t)}
                    >
                      <span className="treatment-name">{t.name}</span>
                      <span className="treatment-price">{formatCurrency(t.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.items.length > 0 && (
                <div className="budget-items">
                  <label className="form-label">Tratamientos Seleccionados</label>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tratamiento</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.treatmentName}</td>
                          <td>{formatCurrency(item.unitPrice)}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              className="quantity-input"
                              value={item.quantity}
                              onChange={e => handleQuantityChange(index, e.target.value)}
                            />
                          </td>
                          <td>{formatCurrency(item.subtotal)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => handleRemoveItem(index)}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="total-row discount">
                      <span>Descuento:</span>
                      <input
                        type="number"
                        min="0"
                        className="discount-input"
                        value={formData.discount}
                        onChange={e => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="total-row total">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Notas</label>
                <textarea
                  className="form-input"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Observaciones..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Válido hasta</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.validUntil}
                  onChange={e => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editingBudget ? 'Actualizar' : 'Crear Presupuesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="budgets-list">
        {budgets.length === 0 ? (
          <p className="empty-state">No hay presupuestos para este paciente</p>
        ) : (
          budgets.map(budget => (
            <div key={budget.id} className="budget-card">
              <div className="budget-card-header">
                <div className="budget-info">
                  <span className="budget-date">
                    {new Date(budget.createdAt).toLocaleDateString('es-CL')}
                  </span>
                  <span 
                    className="budget-status"
                    style={{ backgroundColor: STATUS_COLORS[budget.status] }}
                  >
                    {STATUS_LABELS[budget.status]}
                  </span>
                </div>
                <div className="budget-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(budget)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(budget.id)}>Eliminar</button>
                </div>
              </div>
              
              <table className="table budget-items-table">
                <thead>
                  <tr>
                    <th>Tratamiento</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.treatmentName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="budget-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(budget.subtotal)}</span>
                </div>
                {budget.discount > 0 && (
                  <div className="total-row discount">
                    <span>Descuento:</span>
                    <span>-{formatCurrency(budget.discount)}</span>
                  </div>
                )}
                <div className="total-row total">
                  <span>Total:</span>
                  <span>{formatCurrency(budget.total)}</span>
                </div>
              </div>

              {budget.status === 'sent' && (
                <div className="budget-status-actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusChange(budget.id, 'accepted')}
                  >
                    Aceptar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusChange(budget.id, 'rejected')}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Presupuesto;
