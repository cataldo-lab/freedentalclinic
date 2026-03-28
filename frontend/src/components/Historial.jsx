import { useState, useEffect } from 'react';
import medicalHistoryService from '../services/medicalHistoryService';
import { formatCurrency } from '../utils/formatters';
import './Historial.css';

const TYPE_ICONS = {
  cariogram: '🦷',
  dental_record: '🦷',
  budget: '💰',
  appointment: '📅',
  note: '📝',
};

const TYPE_LABELS = {
  cariogram: 'Cariograma',
  dental_record: 'Ficha Odontológica',
  budget: 'Presupuesto',
  appointment: 'Cita',
  note: 'Nota',
};

function Historial({ patientId }) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', description: '', dentistId: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistories();
  }, [patientId]);

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const data = await medicalHistoryService.getByPatientId(patientId);
      setHistories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await medicalHistoryService.addNote(patientId, {
        ...noteData,
        dentistId: noteData.dentistId || null,
      });
      setShowNoteForm(false);
      setNoteData({ title: '', description: '', dentistId: '' });
      await fetchHistories();
    } catch (err) {
      setError(err.message);
    }
  };

  const getDetailContent = (history) => {
    switch (history.type) {
      case 'cariogram':
        const riskLabels = {
          very_low: 'Muy Bajo',
          low: 'Bajo',
          moderate: 'Moderado',
          high: 'Alto',
          very_high: 'Muy Alto',
        };
        return (
          <div className="history-detail">
            <p><strong>Riesgo:</strong> {riskLabels[history.data?.cariesRisk] || '-'}</p>
            {history.data?.dietScore !== undefined && (
              <p><strong>Score Dieta:</strong> {history.data.dietScore}/10</p>
            )}
            {history.data?.bacteriaScore !== undefined && (
              <p><strong>Score Bacterias:</strong> {history.data.bacteriaScore}/10</p>
            )}
          </div>
        );
      case 'budget':
        return (
          <div className="history-detail">
            <p><strong>Total:</strong> {formatCurrency(history.data?.total)}</p>
            {history.data?.items && (
              <p><strong>Tratamientos:</strong> {history.data.items.length}</p>
            )}
          </div>
        );
      case 'appointment':
        return (
          <div className="history-detail">
            <p><strong>Fecha:</strong> {history.data?.appointmentDate}</p>
            <p><strong>Hora:</strong> {history.data?.appointmentTime}</p>
          </div>
        );
      case 'dental_record':
        return (
          <div className="history-detail">
            <p><strong>Piezas:</strong> {history.data?.teeth?.filter(t => t.condition !== 'sano').length || 0} modificadas</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="historial">
      <div className="historial-header">
        <h3>Historial Clínico</h3>
        <button className="btn btn-primary" onClick={() => setShowNoteForm(true)}>
          + Agregar Nota
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showNoteForm && (
        <div className="modal-overlay" onClick={() => setShowNoteForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Nota</h2>
              <button className="modal-close" onClick={() => setShowNoteForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitNote}>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-input"
                  value={noteData.title}
                  onChange={e => setNoteData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={noteData.description}
                  onChange={e => setNoteData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowNoteForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="histories-list">
        {histories.length === 0 ? (
          <p className="empty-state">No hay historial clínico registrado</p>
        ) : (
          histories.map(history => (
            <div key={history.id} className="history-card">
              <div className="history-header">
                <span className="history-icon">{TYPE_ICONS[history.type]}</span>
                <div className="history-info">
                  <span className="history-type">{TYPE_LABELS[history.type]}</span>
                  <h4 className="history-title">{history.title}</h4>
                </div>
                <span className="history-date">
                  {new Date(history.createdAt).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="history-description">{history.description}</p>
              {getDetailContent(history)}
              {history.dentist && (
                <p className="history-dentist">
                  👨‍⚕️ Dr. {history.dentist.name} {history.dentist.lastName}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Historial;
