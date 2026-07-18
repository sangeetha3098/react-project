import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/authStorage';

const NavBar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-4 items-center">
            <Link to="/dashboard" className="font-bold text-xl hover:text-indigo-200">Institute Mgmt</Link>
            <div className="flex space-x-4 ml-8">
              <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
              {(user.role === 'Admin' || user.role === 'Staff') && (
                <Link to="/students" className="hover:text-indigo-200">Students</Link>
              )}
              {user.role === 'Admin' && (
                <Link to="/staff" className="hover:text-indigo-200">Staff</Link>
              )}
              <Link to="/profile" className="hover:text-indigo-200">Profile</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hi, {user.fullName} ({user.role})</span>
            <button 
              onClick={handleLogout}
              className="bg-indigo-800 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
