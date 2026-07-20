import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getCurrentUser } from './utils/authStorage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Staff from "./components/Staff";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="bg-slate-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to={getCurrentUser() ? "/dashboard" : "/login"} replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Staff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
