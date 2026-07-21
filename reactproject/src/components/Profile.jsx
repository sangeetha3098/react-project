import { useState } from 'react';
import { getCurrentUser, updateUser } from '../utils/authStorage';
import { FiUser, FiMail, FiPhone, FiShield, FiBookOpen, FiGrid, FiEdit3, FiCheck, FiX } from 'react-icons/fi';

const Profile = () => {
  const user = getCurrentUser();

  if (!user) return null;

  const isStudent = user.role === 'Student';
  const isStaff = user.role === 'Staff';
  const isAdmin = user.role === 'Admin';

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    course: user.course || 'B.Tech Computer Science',
    semester: user.semester || '1st Semester',
    department: user.department || 'Computer Science & Engineering',
  });

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

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'Admin': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Staff': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Profile Details
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Greenfield College of Engineering & Technology Portal Account
          </p>
        </div>

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

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheck className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        {/* Cover Accent */}
        <div className="h-28 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 relative"></div>

        {/* Profile Info Body */}
        <div className="px-6 sm:px-8 pb-8 relative">
          
          {/* Avatar floating */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-inner">
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
                <p className="text-xs text-slate-400 font-mono mt-0.5">User ID: {user.id || 'GCET-USER'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <FiMail className="w-4 h-4 text-indigo-500" />
                    Email Address
                  </div>
                  <p className="text-sm font-bold text-slate-800">{user.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <FiPhone className="w-4 h-4 text-indigo-500" />
                    Contact Number
                  </div>
                  <p className="text-sm font-bold text-slate-800">{user.phone || 'Not specified'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <FiShield className="w-4 h-4 text-indigo-500" />
                    Assigned Role
                  </div>
                  <p className="text-sm font-bold text-slate-800">{user.role}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {isStudent ? <FiBookOpen className="w-4 h-4 text-indigo-500" /> : <FiGrid className="w-4 h-4 text-indigo-500" />}
                    {isStudent ? 'Course & Semester' : 'Department'}
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {isStudent 
                      ? `${user.course || 'B.Tech CSE'} (${user.semester || '1st Semester'})` 
                      : (user.department || 'Institute Administration')}
                  </p>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Course / Branch</label>
                    <select name="course" value={formData.course} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                      <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                      <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                      <option value="B.Tech Mechanical Eng.">B.Tech Mechanical Eng.</option>
                      <option value="B.Tech Civil Engineering">B.Tech Civil Engineering</option>
                      <option value="B.Tech Electronics & Comm.">B.Tech Electronics & Comm.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Semester</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester</option>
                      <option value="8th Semester">8th Semester</option>
                    </select>
                  </div>
                </div>
              )}

              {(isStaff || isAdmin) && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Department</label>
                  <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" />
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

    </div>
  );
};

export default Profile;
