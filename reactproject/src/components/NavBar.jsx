import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import { 
  FiHome, FiUsers, FiUserCheck, FiUser, FiLogOut, FiBookOpen, 
  FiCalendar, FiAward, FiChevronRight 
} from 'react-icons/fi';

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
    { name: 'Students', path: '/students', icon: FiUsers, show: user.role === 'Admin' },
    { name: 'Trainers', path: '/trainers', icon: FiUserCheck, show: user.role === 'Admin' },
    { name: 'Attendance', path: '/attendance', icon: FiCalendar, show: true },
    { name: 'Marks', path: '/marks', icon: FiAward, show: true },
    { name: 'My Profile', path: '/profile', icon: FiUser, show: true }
  ].filter(link => link.show);

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Trainer': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <aside 
      className="fixed top-0 left-0 h-screen z-50 bg-slate-900 border-r border-slate-800 text-slate-400 w-20 hover:w-64 transition-all duration-300 ease-in-out group flex flex-col justify-between shadow-2xl"
    >
      {/* Top Section / Logo */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-lg flex-shrink-0">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden pointer-events-none group-hover:pointer-events-auto">
              <span className="font-black text-base text-white tracking-tight leading-tight">
                GCET Portal
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                Course Institute
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3.5 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group-hover:justify-start group-hover:gap-3 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                    {link.name}
                  </span>
                </div>
                {isActive && (
                  <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section / User Profile & Logout */}
      <div className="p-3.5 border-t border-slate-800 space-y-3 bg-slate-950/40">
        
        {/* User Card */}
        <div className="flex items-center gap-3 p-1 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-inner">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden pointer-events-none group-hover:pointer-events-auto">
            <span className="text-xs font-bold text-slate-200 leading-none">
              {user.fullName}
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1 w-max ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center group-hover:justify-start gap-3 p-3 text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-200"
          title="Sign Out"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden pointer-events-none group-hover:pointer-events-auto">
            Logout
          </span>
        </button>

      </div>
    </aside>
  );
};

export default NavBar;
