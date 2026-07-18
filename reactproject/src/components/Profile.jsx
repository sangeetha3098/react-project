import { getCurrentUser } from '../utils/authStorage';

const Profile = () => {
  const user = getCurrentUser();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500">Full Name</label>
            <div className="mt-1 text-lg text-slate-900">{user.fullName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500">Email Address</label>
            <div className="mt-1 text-lg text-slate-900">{user.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500">Phone Number</label>
            <div className="mt-1 text-lg text-slate-900">{user.phone}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500">Role</label>
            <div className="mt-1 inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
