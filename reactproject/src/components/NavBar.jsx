import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import { FiHome, FiUsers, FiUserCheck, FiUser, FiLogOut, FiBookOpen } from 'react-icons/fi';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome, show: true },
    { name: 'Student Directory', path: '/students', icon: FiUsers, show: user.role === 'Admin' || user.role === 'Staff' },
    { name: 'Staff Directory', path: '/staff', icon: FiUserCheck, show: user.role === 'Admin' },
    { name: 'My Profile', path: '/profile', icon: FiUser, show: true }
  ].filter(link => link.show);

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Staff': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      default: return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform duration-200">
                <FiBookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                  GCET Portal
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Institute System
                </span>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Status & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-none">
                  {user.fullName}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border mt-1 w-max ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl transition-all duration-200 hover:shadow-xs"
              title="Sign Out"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 border-t border-slate-100 gap-1 scrollbar-none">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link 
                key={link.name}
                to={link.path} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
};

export default NavBar;
