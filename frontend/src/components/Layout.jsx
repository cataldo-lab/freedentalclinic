import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">dentalLINK</h1>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/patients" 
            className={`nav-link ${isActive('/patients') ? 'active' : ''}`}
          >
            Pacientes
          </Link>
          <Link 
            to="/dentists" 
            className={`nav-link ${isActive('/dentists') ? 'active' : ''}`}
          >
            Dentistas
          </Link>
          <Link 
            to="/treatments" 
            className={`nav-link ${isActive('/treatments') ? 'active' : ''}`}
          >
            Tratamientos
          </Link>
          <Link 
            to="/appointments" 
            className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
          >
            Citas
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
