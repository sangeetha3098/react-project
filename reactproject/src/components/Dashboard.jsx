import { getCurrentUser, getUsers } from '../utils/authStorage';
import { FiUsers, FiUser, FiGrid, FiBookOpen, FiClock, FiBell } from 'react-icons/fi';

const Dashboard = () => {
  const user = getCurrentUser();
  const users = getUsers();
  
  const studentCount = users.filter(u => u.role === 'Student').length;
  const staffCount = users.filter(u => u.role === 'Staff' || u.role === 'Admin').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Welcome back, {user.fullName}! 👋
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl">
            You are logged in as <span className="font-semibold text-white bg-white/20 px-3 py-1 rounded-full text-sm ml-2">{user.role}</span>
          </p>
          <p className="text-indigo-200 mt-4 text-sm max-w-2xl">
            Here's what's happening at your institute today. Access quick stats, manage directories, and monitor the overall health of your operations.
          </p>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="rounded-xl bg-blue-50 p-4 text-blue-600 mr-5 group-hover:scale-110 transition-transform">
            <FiUsers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Total Students</h3>
            <p className="text-3xl font-bold text-slate-800">{studentCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="rounded-xl bg-purple-50 p-4 text-purple-600 mr-5 group-hover:scale-110 transition-transform">
            <FiUser className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Total Staff</h3>
            <p className="text-3xl font-bold text-slate-800">{staffCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="rounded-xl bg-emerald-50 p-4 text-emerald-600 mr-5 group-hover:scale-110 transition-transform">
            <FiGrid className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Departments</h3>
            <p className="text-3xl font-bold text-slate-800">4</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="rounded-xl bg-orange-50 p-4 text-orange-600 mr-5 group-hover:scale-110 transition-transform">
            <FiBookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Active Courses</h3>
            <p className="text-3xl font-bold text-slate-800">12</p>
          </div>
        </div>
      </div>

      {/* Recent Activity and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <FiClock className="w-6 h-6 mr-2 text-indigo-500" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">New student registered: John Doe</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Staff directory updated by Admin</p>
                <p className="text-xs text-slate-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">System maintenance completed</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <FiBell className="w-6 h-6 mr-2 text-rose-500" />
            Announcements
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-rose-900">Upcoming Holiday</h3>
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">Important</span>
              </div>
              <p className="text-sm text-rose-700">The institute will remain closed on Friday for the national holiday.</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-indigo-900">Semester Exams</h3>
                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">Academic</span>
              </div>
              <p className="text-sm text-indigo-700">Final semester schedules have been published. Check student portal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

