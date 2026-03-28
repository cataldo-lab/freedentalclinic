import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patients, today] = await Promise.all([
          patientService.getAll(),
          appointmentService.getToday(),
        ]);
        setStats({
          totalPatients: patients.length,
          todayAppointments: today.length,
          upcomingAppointments: today.filter(a => a.status === 'scheduled').length,
        });
        setTodayAppointments(today);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon patients-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalPatients}</span>
            <span className="stat-label">Pacientes Totales</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon appointments-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.todayAppointments}</span>
            <span className="stat-label">Citas Hoy</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon upcoming-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.upcomingAppointments}</span>
            <span className="stat-label">Citas Programadas</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Citas de Hoy</h2>
            <Link to="/appointments" className="btn btn-outline">Ver Todas</Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="empty-state">No hay citas programadas para hoy</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Tratamiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.patient?.name} {appointment.patient?.lastName}</td>
                    <td>{appointment.treatment?.name}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="quick-actions card">
          <h2 className="card-title">Accesos Rápidos</h2>
          <div className="actions-list">
            <Link to="/patients?action=new" className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Nuevo Paciente
            </Link>
            <Link to="/appointments?action=new" className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <line x1="12" y1="14" x2="12" y2="18"></line>
                <line x1="10" y1="16" x2="14" y2="16"></line>
              </svg>
              Nueva Cita
            </Link>
            <Link to="/dentists?action=new" className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
              </svg>
              Nuevo Dentista
            </Link>
            <Link to="/treatments?action=new" className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Nuevo Tratamiento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
