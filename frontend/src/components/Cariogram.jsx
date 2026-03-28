import { useState, useEffect } from 'react';
import cariogramService from '../services/cariogramService';
import dentistService from '../services/dentistService';
import medicalHistoryService from '../services/medicalHistoryService';
import './Cariogram.css';

const DIET_FREQUENCY_OPTIONS = [
  { value: '0', label: '0 veces/día' },
  { value: '1', label: '1 vez/día' },
  { value: '2', label: '2 veces/día' },
  { value: '3', label: '3 veces/día' },
  { value: '4', label: '4 veces/día' },
  { value: '5', label: '5 veces/día' },
  { value: '6', label: '6 veces/día' },
  { value: '7', label: '7+ veces/día' },
];

const DIET_TYPE_OPTIONS = [
  { value: 'no_carbs', label: 'No consume carbohidratos frecuentemente' },
  { value: 'some_carbs', label: 'Consumo moderado de carbohidratos' },
  { value: 'frequent_carbs', label: 'Consumo frecuente de carbohidratos' },
  { value: 'very_frequent_carbs', label: 'Consumo muy frecuente de carbohidratos' },
];

const FLUORIDE_OPTIONS = [
  { value: 'excellent', label: 'Excelente (pasta fluorada, enjuagues)' },
  { value: 'good', label: 'Buena (pasta fluorada)' },
  { value: 'some', label: 'Alguna exposición al flúor' },
  { value: 'none', label: 'Sin exposición al flúor' },
];

const BACTERIA_OPTIONS = [
  { value: 'low', label: 'Bajo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
];

const PLAQUE_OPTIONS = [
  { value: 'very_low', label: 'Muy bajo' },
  { value: 'low', label: 'Bajo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
  { value: 'very_high', label: 'Muy alto' },
];

const SALIVA_FLOW_OPTIONS = [
  { value: 'high', label: 'Alto (>1ml/min)' },
  { value: 'normal', label: 'Normal (1ml/min)' },
  { value: 'low', label: 'Bajo (0.7ml/min)' },
  { value: 'very_low', label: 'Muy bajo (<0.7ml/min)' },
];

const SALIVA_BUFFER_OPTIONS = [
  { value: 'high', label: 'Alto (pH > 6)' },
  { value: 'normal', label: 'Normal (pH 5-6)' },
  { value: 'low', label: 'Bajo (pH < 5)' },
];

const SOCIO_OPTIONS = [
  { value: 'high', label: 'Alto' },
  { value: 'medium', label: 'Medio' },
  { value: 'low', label: 'Bajo' },
];

const RISK_COLORS = {
  very_low: '#22c55e',
  low: '#84cc16',
  moderate: '#eab308',
  high: '#f97316',
  very_high: '#ef4444',
};

const RISK_LABELS = {
  very_low: 'Muy Bajo',
  low: 'Bajo',
  moderate: 'Moderado',
  high: 'Alto',
  very_high: 'Muy Alto',
};

function Cariogram({ patientId, onRiskChange, onSave }) {
  const [cariogram, setCariogram] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    dentistId: '',
    dietFrequency: '0',
    dietType: 'no_carbs',
    fluorideExposure: 'good',
    streptococcusMutans: 'low',
    lactobacillus: 'low',
    pastCaries: 0,
    currentCaries: 0,
    fillings: 0,
    missingTeeth: 0,
    plaqueIndex: 'low',
    salivaFlow: 'normal',
    salivaBuffer: 'normal',
    socioeconomicLevel: 'medium',
    observations: '',
  });

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dentistsData, cariogramData] = await Promise.all([
        dentistService.getAll(),
        cariogramService.getByPatientId(patientId).catch(() => null),
      ]);
      setDentists(dentistsData);
      
      if (cariogramData) {
        setCariogram(cariogramData);
        setFormData({
          dentistId: cariogramData.dentistId || '',
          dietFrequency: cariogramData.dietFrequency || '0',
          dietType: cariogramData.dietType || 'no_carbs',
          fluorideExposure: cariogramData.fluorideExposure || 'good',
          streptococcusMutans: cariogramData.streptococcusMutans || 'low',
          lactobacillus: cariogramData.lactobacillus || 'low',
          pastCaries: cariogramData.pastCaries || 0,
          currentCaries: cariogramData.currentCaries || 0,
          fillings: cariogramData.fillings || 0,
          missingTeeth: cariogramData.missingTeeth || 0,
          plaqueIndex: cariogramData.plaqueIndex || 'low',
          salivaFlow: cariogramData.salivaFlow || 'normal',
          salivaBuffer: cariogramData.salivaBuffer || 'normal',
          socioeconomicLevel: cariogramData.socioeconomicLevel || 'medium',
          observations: cariogramData.observations || '',
        });
        if (onRiskChange && cariogramData.cariesRisk) {
          onRiskChange(cariogramData.cariesRisk);
        }
      } else {
        setFormData(prev => ({ ...prev, dentistId: dentistsData[0]?.id || '' }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const isNew = !cariogram;
      await cariogramService.upsert(patientId, {
        ...formData,
        patientId: parseInt(patientId),
      });
      await fetchData();
      
      const riskLabel = RISK_LABELS[formData.streptococcusMutans] || 'evaluado';
      await medicalHistoryService.addEntry(patientId, {
        type: 'cariogram',
        title: isNew ? 'Cariograma Creado' : 'Cariograma Actualizado',
        description: `Riesgo cariogénico: ${riskLabel}. Dentista: ${dentists.find(d => d.id === parseInt(formData.dentistId))?.name || 'No especificado'}`,
      });
      
      if (onSave) onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando cariograma...</div>;
  }

  return (
    <div className="cariogram">
      <div className="cariogram-header">
        <h3>Cariograma - Evaluación de Riesgo Cariogénico</h3>
        {cariogram && (
          <div className="risk-badge" style={{ backgroundColor: RISK_COLORS[cariogram.cariesRisk] }}>
            Riesgo: {RISK_LABELS[cariogram.cariesRisk]}
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="cariogram-grid">
          <div className="cariogram-section">
            <h4>🍬 Dieta</h4>
            <div className="form-group">
              <label className="form-label">Frecuencia de consumo de carbohidratos</label>
              <select name="dietFrequency" className="form-input" value={formData.dietFrequency} onChange={handleChange}>
                {DIET_FREQUENCY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de dieta</label>
              <select name="dietType" className="form-input" value={formData.dietType} onChange={handleChange}>
                {DIET_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cariogram-section">
            <h4>🦠 Bacterias</h4>
            <div className="form-group">
              <label className="form-label">Streptococcus Mutans</label>
              <select name="streptococcusMutans" className="form-input" value={formData.streptococcusMutans} onChange={handleChange}>
                {BACTERIA_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lactobacillus</label>
              <select name="lactobacillus" className="form-input" value={formData.lactobacillus} onChange={handleChange}>
                {BACTERIA_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cariogram-section">
            <h4>🦷 Fluoruro</h4>
            <div className="form-group">
              <label className="form-label">Exposición al flúor</label>
              <select name="fluorideExposure" className="form-input" value={formData.fluorideExposure} onChange={handleChange}>
                {FLUORIDE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cariogram-section">
            <h4>🪥 Higiene</h4>
            <div className="form-group">
              <label className="form-label">Índice de placa</label>
              <select name="plaqueIndex" className="form-input" value={formData.plaqueIndex} onChange={handleChange}>
                {PLAQUE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cariogram-section">
            <h4>💧 Saliva</h4>
            <div className="form-group">
              <label className="form-label">Flujo salival</label>
              <select name="salivaFlow" className="form-input" value={formData.salivaFlow} onChange={handleChange}>
                {SALIVA_FLOW_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capacidad buffer</label>
              <select name="salivaBuffer" className="form-input" value={formData.salivaBuffer} onChange={handleChange}>
                {SALIVA_BUFFER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cariogram-section">
            <h4>📊 Histórico Clínico</h4>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Caries previas</label>
                <input type="number" name="pastCaries" className="form-input" value={formData.pastCaries} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Caries actuales</label>
                <input type="number" name="currentCaries" className="form-input" value={formData.currentCaries} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Obturaciones</label>
                <input type="number" name="fillings" className="form-input" value={formData.fillings} onChange={handleChange} min="0" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Piezas faltantes</label>
              <input type="number" name="missingTeeth" className="form-input" value={formData.missingTeeth} onChange={handleChange} min="0" style={{ maxWidth: '100px' }} />
            </div>
          </div>

          <div className="cariogram-section">
            <h4>👥 Factores Sociales</h4>
            <div className="form-group">
              <label className="form-label">Nivel socioeconómico</label>
              <select name="socioeconomicLevel" className="form-input" value={formData.socioeconomicLevel} onChange={handleChange}>
                {SOCIO_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dentista</label>
              <select name="dentistId" className="form-input" value={formData.dentistId} onChange={handleChange}>
                <option value="">Seleccionar dentista</option>
                {dentists.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.name} {d.lastName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Observaciones</label>
          <textarea name="observations" className="form-input" value={formData.observations} onChange={handleChange} rows={3} placeholder="Observaciones del cariograma..." />
        </div>

        <div className="cariogram-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : cariogram ? 'Actualizar Cariograma' : 'Crear Cariograma'}
          </button>
        </div>

        {cariogram && (
          <div className="cariogram-results">
            <h4>Resultados</h4>
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">Riesgo Total</div>
                <div className="result-value" style={{ color: RISK_COLORS[cariogram.cariesRisk] }}>
                  {RISK_LABELS[cariogram.cariesRisk]}
                </div>
              </div>
              <div className="result-item">
                <div className="result-label">Score Dieta</div>
                <div className="result-value">{cariogram.dietScore}/10</div>
              </div>
              <div className="result-item">
                <div className="result-label">Score Bacterias</div>
                <div className="result-value">{cariogram.bacteriaScore}/10</div>
              </div>
              <div className="result-item">
                <div className="result-label">Score Susceptibilidad</div>
                <div className="result-value">{cariogram.susceptibilityScore}/10</div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Cariogram;
