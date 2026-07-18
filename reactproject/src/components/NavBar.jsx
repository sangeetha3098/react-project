import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import { useState } from 'react';

const NavBar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    ...(user.role === 'Admin' || user.role === 'Staff' ? [{ name: 'Students', path: '/students' }] : []),
    ...(user.role === 'Admin' ? [{ name: 'Staff', path: '/staff' }] : []),
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                I
              </div>
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-slate-800 tracking-tight">
                InstituteMgmt
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user.fullName}</p>
                <p className="text-xs text-slate-500 mt-1">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                {user.fullName.charAt(0)}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname.startsWith(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

