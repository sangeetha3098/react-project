import { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser, updateUser, getCurrentUser } from '../utils/authStorage';
import { FiX, FiEdit2, FiTrash2, FiMail, FiPhone, FiGrid, FiPlus, FiSearch } from 'react-icons/fi';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', department: '' });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const allUsers = getUsers();
    setStaffList(allUsers.filter(u => u.role === 'Staff' || u.role === 'Admin'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditingStaffId(null);
    setFormData({ fullName: '', email: '', phone: '', password: 'staff', department: 'Computer Science & Engineering' });
    setShowForm(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingStaffId(member.id);
    setFormData({
      fullName: member.fullName || '',
      email: member.email || '',
      phone: member.phone || '',
      password: member.password || '',
      department: member.department || 'Computer Science & Engineering'
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
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
    setShowForm(false);
    loadStaff();
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteUser(memberToDelete.id);
      loadStaff();
      setMemberToDelete(null);
    }
  };

  const filteredStaff = staffList.filter(member => 
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.department && member.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff & Faculty Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Professors, department heads, and institute administrators
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Staff Member
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-slate-400 ml-1" />
        <input 
          type="text" 
          placeholder="Search staff by name, email or department..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Add / Edit Staff Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name & Title</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. Prof. Ananya Roy" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="ananya.roy@gcet.edu.in" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Phone Number</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="10-digit number" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Department</label>
                <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. Computer Science & Engineering" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="••••••••" />
              </div>

              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md">
                  {editingStaffId ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Staff Member?</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Are you sure you want to remove <strong>{memberToDelete.fullName}</strong> from the staff record?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setMemberToDelete(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            No staff or faculty members found matching your search.
          </div>
        ) : (
          filteredStaff.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 hover-lift relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center border border-indigo-200 text-base">
                    {member.fullName ? member.fullName.charAt(0) : 'T'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{member.fullName}</h3>
                    <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mt-0.5 ${
                      member.role === 'Admin' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenEditModal(member)} 
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Staff Member"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    {member.id !== currentUser?.id && (
                      <button 
                        onClick={() => setMemberToDelete(member)} 
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Staff Member"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
                {member.department && (
                  <div className="flex items-center gap-2">
                    <FiGrid className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-700">{member.department}</span>
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
