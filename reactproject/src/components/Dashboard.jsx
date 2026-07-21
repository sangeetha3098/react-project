import { getCurrentUser, getUsers, getActivities } from '../utils/authStorage';
import { FiUsers, FiUserCheck, FiBookOpen, FiClock, FiBell, FiShield } from 'react-icons/fi';

const Dashboard = () => {
  const user = getCurrentUser();
  const users = getUsers();
  const activities = getActivities();

  const studentCount = users.filter(u => u.role === 'Student').length;
  const staffCount = users.filter(u => u.role === 'Staff').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin': return 'bg-amber-400/20 text-amber-200 border-amber-400/30';
      case 'Staff': return 'bg-indigo-400/20 text-indigo-200 border-indigo-400/30';
      default: return 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30';
    }
  };

  // Helper function to format timestamp relative to current time
  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getActivityDotColor = (type) => {
    switch (type) {
      case 'student': return 'bg-emerald-500';
      case 'staff': return 'bg-indigo-500';
      case 'delete': return 'bg-rose-500';
      default: return 'bg-amber-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">

      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-64 h-64 rounded-full bg-violet-600/15 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeStyle(user?.role)}`}>
              {user?.role} Access
            </span>
            <span className="text-slate-400 text-xs font-semibold">Greenfield College of Engineering & Technology</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Welcome back, {user?.fullName || 'User'} 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Institute Management Portal — Real-time dynamic activity log tracking student registrations, staff directory updates, and campus announcements.
          </p>
        </div>
      </div>

      {/* Dynamic Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{studentCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-4">Real-time student registry</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Teaching Staff</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{staffCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FiUserCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-indigo-600 font-semibold mt-4">Active faculty members</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Administrators</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{adminCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FiShield className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-4">Full system governance</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Programs</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">6</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FiBookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-purple-600 font-semibold mt-4">B.Tech & M.Tech Departments</p>
        </div>

      </div>

      {/* Dynamic Activity & Announcements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dynamic Recent Activity Feed */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiClock className="w-5 h-5 text-indigo-600" />
              Recent Institute Activity Feed
            </h2>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 animate-pulse">
              ● Live Updates
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent activities logged yet.</p>
            ) : (
              activities.slice(0, 5).map((act) => (
                <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start transition-all hover:bg-slate-100/60">
                  <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${getActivityDotColor(act.type)} flex-shrink-0`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-snug">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{formatTimeAgo(act.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FiBell className="w-5 h-5 text-amber-500" />
            Official Notice Board
          </h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-amber-900">Academic Registration Deadline</h3>
                <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Important</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                All students must submit their course registration forms for the upcoming semester by 15th October.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-indigo-900">Faculty Development Program</h3>
                <span className="text-[10px] uppercase font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">Notice</span>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                Staff workshop on modern engineering curriculum scheduled for Saturday in Auditorium B.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
