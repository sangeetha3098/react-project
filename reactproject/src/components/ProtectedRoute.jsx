import { Navigate } from 'react-router-dom';
import { getCurrentUser, getUsers } from '../utils/authStorage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const users = getUsers();
  const adminExists = users.some(u => u.role === 'Admin');

  if (!adminExists) {
    return <Navigate to="/admin-setup" replace />;
  }

  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
