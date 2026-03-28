import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import patientService from '../services/patientService';
import Presupuesto from '../components/Presupuesto';
import Historial from '../components/Historial';
import './PatientDetail.css';

function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const data = await patientService.getById(id);
      setPatient(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!patient) return <div className="error">Paciente no encontrado</div>;

  return (
    <div className="patient-detail">
      <div className="page-header">
        <div>
          <Link to="/patients" className="back-link">← Volver a Pacientes</Link>
          <h1 className="page-title">{patient.name} {patient.lastName}</h1>
          <p className="patient-email">{patient.email}</p>
        </div>
        <div className="patient-actions">
          <Link to={`/patients/${id}/ficha-odontologica`} className="btn btn-secondary">
            Ficha Dental
          </Link>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Información
        </button>
        <button 
          className={`tab ${activeTab === 'historial' ? 'active' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial
        </button>
        <button 
          className={`tab ${activeTab === 'presupuesto' ? 'active' : ''}`}
          onClick={() => setActiveTab('presupuesto')}
        >
          Presupuesto
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="patient-info card">
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre</label>
                <span>{patient.name} {patient.lastName}</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>{patient.email}</span>
              </div>
              <div className="info-item">
                <label>Teléfono</label>
                <span>{patient.phone || '-'}</span>
              </div>
              <div className="info-item">
                <label>Fecha de Nacimiento</label>
                <span>{patient.dateOfBirth || '-'}</span>
              </div>
              <div className="info-item">
                <label>Dirección</label>
                <span>{patient.address || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <Historial patientId={id} />
        )}

        {activeTab === 'presupuesto' && (
          <Presupuesto patientId={id} patientName={`${patient.name} ${patient.lastName}`} />
        )}
      </div>
    </div>
  );
}

export default PatientDetail;
