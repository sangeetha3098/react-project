import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { getCurrentUser } from './utils/authStorage';
import Login from './pages/Login';
import AdminSetup from './pages/AdminSetup';
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Trainers from "./components/Trainers";
import Courses from "./components/Courses";
import Attendance from "./components/Attendance";
import Marks from "./components/Marks";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

const AppLayout = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const noSidebarPaths = ['/login', '/admin-setup'];
  const showSidebar = user && !noSidebarPaths.includes(location.pathname);

  return (
    <>
      {showSidebar && <NavBar />}
      <div className={showSidebar ? "sidebar-content bg-slate-50 min-h-screen" : "bg-slate-50 min-h-screen"}>
        <Routes>
          <Route path="/" element={<Navigate to={getCurrentUser() ? "/dashboard" : "/login"} replace />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute allowedRoles={['Admin']}><Students /></ProtectedRoute>} />
          <Route path="/trainers" element={<ProtectedRoute allowedRoles={['Admin']}><Trainers /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute allowedRoles={['Admin']}><Courses /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/marks" element={<ProtectedRoute><Marks /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
