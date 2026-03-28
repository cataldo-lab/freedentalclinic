import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dentalRecordService from '../services/dentalRecordService';
import dentistService from '../services/dentistService';
import medicalHistoryService from '../services/medicalHistoryService';
import Cariogram from '../components/Cariogram';
import './FichaOdontologica.css';

const TOOTH_CONDITIONS = [
  { value: 'sano', label: 'Sano', color: '#22c55e' },
  { value: 'caries', label: 'Caries', color: '#ef4444' },
  { value: 'obturado', label: 'Obturado', color: '#3b82f6' },
  { value: 'endodonciado', label: 'Endodonciado', color: '#8b5cf6' },
  { value: 'extraido', label: 'Extraído', color: '#6b7280' },
  { value: 'ausente', label: 'Ausente', color: '#d1d5db' },
  { value: 'provisional', label: 'Provisional', color: '#f59e0b' },
  { value: 'implante', label: 'Implante', color: '#06b6d4' },
  { value: 'corona', label: 'Corona', color: '#ec4899' },
  { value: 'fractura', label: 'Fractura', color: '#dc2626' },
  { value: 'desgaste', label: 'Desgaste', color: '#78716c' },
];

const OCCLUSION_LABELS = {
  normal: 'Normal',
  maloclusion_clase_I: 'Maloclusión Clase I',
  maloclusion_clase_II: 'Maloclusión Clase II',
  malocluse_clase_III: 'Maloclusión Clase III',
  abierta: 'Mordida Abierta',
  cruzada: 'Mordida Cruzada',
};

const PERIODONTAL_LABELS = {
  sano: 'Sano',
  gingivitis: 'Gingivitis',
  periodontitis_leve: 'Periodontitis Leve',
  periodontitis_moderada: 'Periodontitis Moderada',
  periodontitis_severa: 'Periodontitis Severa',
};

const HYGIENE_LABELS = {
  buena: 'Buena',
  regular: 'Regular',
  mala: 'Mala',
};

function FichaOdontologica() {
  const { patientId } = useParams();
  const [record, setRecord] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [activeTab, setActiveTab] = useState('odontograma');

  const [formData, setFormData] = useState({
    dentistId: '',
    occlusion: 'normal',
    periodontalStatus: 'sano',
    hygieneGrade: 'buena',
    observations: '',
    teeth: [],
  });

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dentistsData, recordData] = await Promise.all([
        dentistService.getAll(),
        dentalRecordService.getByPatientId(patientId).catch(() => null),
      ]);
      setDentists(dentistsData);
      
      if (recordData) {
        setRecord(recordData);
        setFormData({
          dentistId: recordData.dentistId || '',
          occlusion: recordData.occlusion || 'normal',
          periodontalStatus: recordData.periodontalStatus || 'sano',
          hygieneGrade: recordData.hygieneGrade || 'buena',
          observations: recordData.observations || '',
          teeth: recordData.teeth || [],
        });
      } else {
        setFormData(prev => ({ ...prev, dentistId: dentistsData[0]?.id || '' }));
      }
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

  const handleToothClick = (tooth) => {
    setSelectedTooth(tooth);
  };

  const handleToothConditionChange = (condition) => {
    if (!selectedTooth) return;
    
    const updatedTeeth = formData.teeth.map(t => 
      t.id === selectedTooth.id ? { ...t, condition } : t
    );
    setFormData(prev => ({ ...prev, teeth: updatedTeeth }));
    setSelectedTooth(prev => prev ? { ...prev, condition } : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const isNew = !record;
      if (record) {
        await dentalRecordService.update(patientId, formData);
        setSuccess('Ficha odontológica actualizada correctamente');
      } else {
        await dentalRecordService.create({ ...formData, patientId: parseInt(patientId) });
        setSuccess('Ficha odontológica creada correctamente');
      }
      await fetchData();

      const healthyTeeth = formData.teeth.filter(t => t.condition === 'sano').length;
      const cariesTeeth = formData.teeth.filter(t => t.condition === 'caries').length;
      const filledTeeth = formData.teeth.filter(t => t.condition === 'obturado').length;
      
      await medicalHistoryService.addEntry(patientId, {
        type: 'dental_record',
        title: isNew ? 'Ficha Odontológica Creada' : 'Ficha Odontológica Actualizada',
        description: `Oclusión: ${OCCLUSION_LABELS[formData.occlusion]}. Piezas sanas: ${healthyTeeth}, caries: ${cariesTeeth}, obturadas: ${filledTeeth}. Higiene: ${HYGIENE_LABELS[formData.hygieneGrade]}`,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getToothColor = (tooth) => {
    const condition = TOOTH_CONDITIONS.find(c => c.value === tooth?.condition);
    return condition?.color || '#e5e7eb';
  };

  const renderTooth = (tooth, index) => (
    <div
      key={tooth?.id || index}
      className={`tooth ${selectedTooth?.id === tooth?.id ? 'selected' : ''}`}
      style={{ backgroundColor: getToothColor(tooth) }}
      onClick={() => handleToothClick(tooth)}
      title={`${tooth?.toothNumber || '?'} - ${TOOTH_CONDITIONS.find(c => c.value === tooth?.condition)?.label || 'Sano'}`}
    >
      <span className="tooth-number">{tooth?.toothNumber || '?'}</span>
    </div>
  );

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="ficha-odontologica">
      <div className="page-header">
        <div>
          <Link to="/patients" className="back-link">← Volver a Pacientes</Link>
          <h1 className="page-title">Ficha Odontológica</h1>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="tabs">
        <button 
          type="button" 
          className={`tab ${activeTab === 'odontograma' ? 'active' : ''}`}
          onClick={() => setActiveTab('odontograma')}
        >
          Odontograma
        </button>
        <button 
          type="button" 
          className={`tab ${activeTab === 'cariograma' ? 'active' : ''}`}
          onClick={() => setActiveTab('cariograma')}
        >
          Cariograma
        </button>
      </div>

      {activeTab === 'odontograma' ? (
      <form onSubmit={handleSubmit}>
        <div className="ficha-grid">
          <div className="card">
            <h3>Información General</h3>
            <div className="form-group">
              <label className="form-label">Dentista</label>
              <select
                name="dentistId"
                className="form-input"
                value={formData.dentistId}
                onChange={handleInputChange}
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
              <label className="form-label">Oclusión</label>
              <select
                name="occlusion"
                className="form-input"
                value={formData.occlusion}
                onChange={handleInputChange}
              >
                {Object.entries(OCCLUSION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estado Periodontal</label>
              <select
                name="periodontalStatus"
                className="form-input"
                value={formData.periodontalStatus}
                onChange={handleInputChange}
              >
                {Object.entries(PERIODONTAL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Higiene</label>
              <select
                name="hygieneGrade"
                className="form-input"
                value={formData.hygieneGrade}
                onChange={handleInputChange}
              >
                {Object.entries(HYGIENE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observations"
                className="form-input"
                value={formData.observations}
                onChange={handleInputChange}
                rows={4}
                placeholder="Observaciones generales..."
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : record ? 'Actualizar Ficha' : 'Crear Ficha'}
            </button>
          </div>

          <div className="card">
            <h3>Odontograma</h3>
            <div className="odontograma">
              <div className="quadrant sup">
                <div className="quadrant-label">Superior Derecha</div>
                <div className="teeth-row">
                  {formData.teeth.filter(t => t.position === 'sup_der').map(renderTooth)}
                </div>
              </div>
              <div className="quadrant sup">
                <div className="quadrant-label">Superior Izquierda</div>
                <div className="teeth-row">
                  {formData.teeth.filter(t => t.position === 'sup_izq').map(renderTooth)}
                </div>
              </div>
              <div className="quadrant inf">
                <div className="quadrant-label">Inferior Izquierda</div>
                <div className="teeth-row">
                  {formData.teeth.filter(t => t.position === 'inf_izq').map(renderTooth)}
                </div>
              </div>
              <div className="quadrant inf">
                <div className="quadrant-label">Inferior Derecha</div>
                <div className="teeth-row">
                  {formData.teeth.filter(t => t.position === 'inf_der').map(renderTooth)}
                </div>
              </div>
            </div>

            <div className="legend">
              <h4>Leyenda</h4>
              <div className="legend-items">
                {TOOTH_CONDITIONS.map((c) => (
                  <div key={c.value} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: c.color }}></span>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedTooth && (
              <div className="tooth-editor">
                <h4>Pieza {selectedTooth.toothNumber}</h4>
                <div className="condition-buttons">
                  {TOOTH_CONDITIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`condition-btn ${selectedTooth.condition === c.value ? 'active' : ''}`}
                      style={{ backgroundColor: selectedTooth.condition === c.value ? c.color : '#f3f4f6' }}
                      onClick={() => handleToothConditionChange(c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
      ) : (
        <Cariogram 
          patientId={patientId} 
          onSave={() => {
            setSuccess('Cariograma guardado correctamente');
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      )}
    </div>
  );
}

export default FichaOdontologica;
