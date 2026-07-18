import { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser, updateUser } from '../utils/authStorage';
import { FiX, FiEdit2, FiTrash2, FiMail, FiPhone, FiGrid } from 'react-icons/fi';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', department: '' });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const allUsers = getUsers();
    setStaff(allUsers.filter(u => u.role === 'Staff' || u.role === 'Admin')); // Show all staff/admins
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingStaffId) {
      updateUser(editingStaffId, formData);
    } else {
      saveUser({
        id: crypto.randomUUID(),
        role: 'Staff',
        ...formData,
        createdAt: new Date().toISOString()
      });
    }
    setFormData({ fullName: '', email: '', phone: '', password: '', department: '' });
    setShowAddForm(false);
    setEditingStaffId(null);
    loadStaff();
  };

  const handleEdit = (member) => {
    setFormData({ 
      fullName: member.fullName, 
      email: member.email, 
      phone: member.phone, 
      password: member.password || '', 
      department: member.department || '' 
    });
    setEditingStaffId(member.id);
    setShowAddForm(true);
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteUser(memberToDelete.id);
      loadStaff();
      setMemberToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Staff Directory
          </h1>
          <p className="text-slate-500 mt-2">Manage institute faculty and administration</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(true);
            setEditingStaffId(null);
            setFormData({ fullName: '', email: '', phone: '', password: '', department: '' });
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
        >
          + Add New Staff
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingStaffId ? 'Edit Staff Member' : 'Add New Staff'}
              </h2>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddOrUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50" placeholder="e.g. Jane Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50" placeholder="jane@institute.edu" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50" placeholder="555-0199" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50" placeholder="e.g. Physics" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50" placeholder="••••••••" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all font-medium">
                  {editingStaffId ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {memberToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
                <FiTrash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Staff Member?</h2>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{memberToDelete.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setMemberToDelete(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-medium">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            No staff members found. Add one to get started.
          </div>
        ) : (
          staff.map(member => (
            <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl ring-2 ring-indigo-100">
                    {member.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{member.fullName}</h3>
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium mt-1">
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(member)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteClick(member)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-slate-400" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-slate-400" />
                  {member.phone}
                </div>
                {member.department && (
                  <div className="flex items-center gap-2">
                    <FiGrid className="w-4 h-4 text-slate-400" />
                    {member.department}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Staff;

