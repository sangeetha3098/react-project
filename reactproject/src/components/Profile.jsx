import { useState } from 'react';
import { getCurrentUser, updateUser, getCourses } from '../utils/authStorage';
import { FiMail, FiPhone, FiShield, FiBookOpen, FiEdit3, FiCheck, FiX, FiLock } from 'react-icons/fi';

const Profile = () => {
  const user = getCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    enrolledCourseId: user?.enrolledCourseId || '',
    assignedCourseId: user?.assignedCourseId || '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!user) return null;

  const isStudent = user.role === 'Student';
  const isTrainer = user.role === 'Trainer';

  const courses = getCourses();

  const getCourseName = (courseId) => {
    const c = courses.find(cr => cr.id === courseId);
    return c ? c.name : 'Unassigned Program';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const result = updateUser(user.id, formData);
    if (result.success) {
      setIsEditing(false);
      setSuccessMsg('Profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (user.password && user.password !== passwordData.oldPassword) {
      setPasswordError('Current password is incorrect.');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const result = updateUser(user.id, { password: passwordData.newPassword, mustResetPassword: false });
    if (result.success) {
      setShowPasswordForm(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('Password updated successfully!');
      setTimeout(() => setPasswordSuccess(''), 4000);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'Admin': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Trainer': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your training portal profile details
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              <FiEdit3 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheck className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {passwordSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheck className="w-4 h-4 text-emerald-600" />
          {passwordSuccess}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        {/* Cover Accent */}
        <div className="h-28 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 relative">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl"></div>
        </div>

        {/* Profile Info Body */}
        <div className="px-6 sm:px-8 pb-8 relative">
          
          {/* Avatar floating */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black text-2xl flex items-center justify-center shadow-inner">
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            
            <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${getRoleBadgeStyle(user.role)}`}>
              {user.role} Account
            </span>
          </div>

          {!isEditing ? (
            /* View Mode */
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-slate-900">{user.fullName}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Account ID: {user.id || 'GCET-USER'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ProfileField icon={FiMail} label="Email Address" value={user.email} />
                <ProfileField icon={FiPhone} label="Contact Number" value={user.phone || 'Not specified'} />
                <ProfileField icon={FiShield} label="Assigned Role" value={user.role} />
                {(isStudent || isTrainer) && (
                  <ProfileField 
                    icon={FiBookOpen} 
                    label={isStudent ? 'Enrolled Program' : 'Assigned Course'} 
                    value={isStudent ? getCourseName(user.enrolledCourseId) : getCourseName(user.assignedCourseId)} 
                  />
                )}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Contact Phone</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" />
                </div>
              </div>

              {isStudent && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Enrolled Program</label>
                  <select name="enrolledCourseId" value={formData.enrolledCourseId} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {isTrainer && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Assigned Program</label>
                  <select name="assignedCourseId" value={formData.assignedCourseId} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security Credentials</h3>
              <p className="text-[11px] text-slate-400 font-medium">Update your login password</p>
            </div>
          </div>
          {!showPasswordForm && (
            <button 
              onClick={() => setShowPasswordForm(true)} 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all"
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSave} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Current Password</label>
              <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="Enter current password" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">New Password</label>
                <input required type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Confirm New Password</label>
                <input required type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="Repeat new password" />
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">{passwordError}</div>
            )}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowPasswordForm(false); setPasswordError(''); }} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md">
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
      <Icon className="w-4 h-4 text-indigo-500" />
      {label}
    </div>
    <p className="text-sm font-bold text-slate-800">{value}</p>
  </div>
);

export default Profile;
