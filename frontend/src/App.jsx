import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Dentists from './pages/Dentists';
import Treatments from './pages/Treatments';
import Appointments from './pages/Appointments';
import FichaOdontologica from './pages/FichaOdontologica';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="patients/:id/medical-record" element={<PatientDetail />} />
        <Route path="patients/:patientId/ficha-odontologica" element={<FichaOdontologica />} />
        <Route path="dentists" element={<Dentists />} />
        <Route path="treatments" element={<Treatments />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
