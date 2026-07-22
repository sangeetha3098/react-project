import { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser, updateUser, getCurrentUser, getCourses } from '../utils/authStorage';
import { FiX, FiEdit2, FiTrash2, FiMail, FiPhone, FiBookOpen, FiPlus, FiSearch } from 'react-icons/fi';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    assignedCourseId: '',
    temporaryPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    setTrainers(allUsers.filter(u => u.role === 'Trainer'));

    const crs = getCourses();
    setCourses(crs);
    if (crs.length > 0) {
      setFormData(prev => ({ ...prev, assignedCourseId: crs[0].id }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleOpenAddModal = () => {
    if (courses.length === 0) {
      alert("Please configure courses first!");
      return;
    }
    setEditingTrainerId(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      assignedCourseId: courses[0]?.id || '',
      temporaryPassword: ''
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleOpenEditModal = (trainer) => {
    setEditingTrainerId(trainer.id);
    setFormData({
      fullName: trainer.fullName || '',
      email: trainer.email || '',
      phone: trainer.phone || '',
      assignedCourseId: trainer.assignedCourseId || courses[0]?.id || '',
      temporaryPassword: ''
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assignedCourseId) {
      setErrorMsg('An assigned course must be selected');
      return;
    }

    if (!editingTrainerId) {
      if (!formData.temporaryPassword || formData.temporaryPassword.length < 6) {
        setErrorMsg('Temporary password must be at least 6 characters');
        return;
      }
    }

    if (editingTrainerId) {
      updateUser(editingTrainerId, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        assignedCourseId: formData.assignedCourseId
      });
    } else {
      const res = saveUser({
        id: 'usr-trainer-' + crypto.randomUUID().substring(0, 8),
        role: 'Trainer',
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        assignedCourseId: formData.assignedCourseId,
        password: formData.temporaryPassword,
        mustResetPassword: true,
        createdAt: new Date().toISOString()
      });

      if (!res.success) {
        setErrorMsg(res.error);
        return;
      }
    }
    setShowForm(false);
    loadData();
  };

  const confirmDelete = () => {
    if (trainerToDelete) {
      deleteUser(trainerToDelete.id);
      loadData();
      setTrainerToDelete(null);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'General/Unassigned';
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCourseName(trainer.assignedCourseId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trainers & Instructors
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage course instructors and technical trainers
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Trainer
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Search trainers by name, email or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Trainers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            No trainers or instructors found matching your search.
          </div>
        ) : (
          filteredTrainers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 hover-lift relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center border border-indigo-200 text-base">
                    {member.fullName ? member.fullName.charAt(0) : 'T'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{member.fullName}</h3>
                    <div className="flex gap-1.5 items-center mt-1">
                      <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${!member.mustResetPassword
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {!member.mustResetPassword ? 'Active' : 'Pending Password Reset'}
                      </span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(member)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Trainer"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTrainerToDelete(member)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Trainer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
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
                <div className="flex items-center gap-2">
                  <FiBookOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">{getCourseName(member.assignedCourseId)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Staff Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingTrainerId ? 'Edit Trainer' : 'Add New Trainer'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name & Title</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. Ananya Roy" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="name@gmail.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Phone Number</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="10-digit number" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Assigned Course</label>
                <select name="assignedCourseId" value={formData.assignedCourseId} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {!editingTrainerId && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Temporary Password</label>
                  <input required type="password" name="temporaryPassword" value={formData.temporaryPassword} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="Min 6 characters - share with trainer" />
                </div>
              )}

              {!editingTrainerId && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-700 font-semibold leading-relaxed">
                  ℹ️ <strong>First Login:</strong> Share this temporary password with the trainer. They must reset it on first login.
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                  {errorMsg}
                </div>
              )}

              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md">
                  {editingTrainerId ? 'Save Changes' : 'Add Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {trainerToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Trainer?</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Are you sure you want to remove <strong>{trainerToDelete.fullName}</strong> from the records?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setTrainerToDelete(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Trainers;
