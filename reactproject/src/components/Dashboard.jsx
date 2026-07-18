import { getCurrentUser, getUsers } from '../utils/authStorage';

const Dashboard = () => {
  const user = getCurrentUser();
  const users = getUsers();
  
  const studentCount = users.filter(u => u.role === 'Student').length;
  const staffCount = users.filter(u => u.role === 'Staff').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user.fullName}!</h2>
        <p className="text-slate-600">You are logged in as <span className="font-bold">{user.role}</span>.</p>
      </div>
      
      {user.role === 'Admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-sm font-medium">Total Students</h3>
            <p className="text-3xl font-bold text-indigo-600">{studentCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-sm font-medium">Total Staff</h3>
            <p className="text-3xl font-bold text-indigo-600">{staffCount}</p>
          </div>
        </div>
      )}

      {user.role === 'Staff' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-sm font-medium">Total Students</h3>
            <p className="text-3xl font-bold text-indigo-600">{studentCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
