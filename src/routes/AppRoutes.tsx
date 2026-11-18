import { Routes, Route, Navigate } from 'react-router-dom';
import TimesheetPage from '../pages/TimesheetPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Vista pública (solo lectura) para la jefa */}
      <Route path="/" element={<TimesheetPage readOnly={true} />} />
      {/* Login del empleado */}
      <Route path="/login" element={<LoginPage />} />
      {/* Vista editable, protegida por auth */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <TimesheetPage readOnly={false} />
          </ProtectedRoute>
        }
      />
      <Route path="/boss" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
