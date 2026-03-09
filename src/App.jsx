import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/constants';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Admin Dashboard Pages
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import RequestManagement from './pages/dashboard/admin/RequestManagement';
import WorkerManagement from './pages/dashboard/admin/WorkerManagement';

// Client Dashboard Pages
import ClientDashboard from './pages/dashboard/client/ClientDashboard';
import CreateRequest from './pages/dashboard/client/CreateRequest';

// Worker Dashboard Pages
import WorkerDashboard from './pages/dashboard/worker/WorkerDashboard';
import WorkerAvailability from './pages/dashboard/worker/WorkerAvailability';
import WorkerJobHistory from './pages/dashboard/worker/WorkerJobHistory';

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="wrench">
          <i className="fa-solid fa-wrench" />
        </div>
      </div>
    );
  }

  if (userRole === ROLES.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === ROLES.CLIENT) {
    return <Navigate to="/client/dashboard" replace />;
  } else if (userRole === ROLES.WORKER) {
    return <Navigate to="/worker/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 20px'
            }
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <RequestManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workers"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <WorkerManagement />
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/create-request"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/requests"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Worker Routes */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.WORKER]}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/availability"
            element={
              <ProtectedRoute allowedRoles={[ROLES.WORKER]}>
                <WorkerAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/history"
            element={
              <ProtectedRoute allowedRoles={[ROLES.WORKER]}>
                <WorkerJobHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/salary"
            element={
              <ProtectedRoute allowedRoles={[ROLES.WORKER]}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
