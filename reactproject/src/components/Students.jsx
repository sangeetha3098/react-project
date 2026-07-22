import { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser, updateUser, getCurrentUser, getCourses } from '../utils/authStorage';
import { FiX, FiUsers, FiEdit2, FiTrash2, FiPlus, FiSearch, FiMail, FiPhone, FiBookOpen } from 'react-icons/fi';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrolledCourseId: '',
    status: 'Active',
    temporaryPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = getCurrentUser();
  const canModify = currentUser?.role === 'Admin' || currentUser?.role === 'Trainer';
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    setStudents(allUsers.filter(u => u.role === 'Student'));

    const crs = getCourses();
    setCourses(crs);
    if (crs.length > 0) {
      setFormData(prev => ({ ...prev, enrolledCourseId: crs[0].id }));
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
    setEditingStudentId(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      enrolledCourseId: courses[0]?.id || '',
      status: 'Active',
      temporaryPassword: ''
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudentId(student.id);
    setFormData({
      fullName: student.fullName || '',
      email: student.email || '',
      phone: student.phone || '',
      enrolledCourseId: student.enrolledCourseId || courses[0]?.id || '',
      status: student.status || 'Active',
      temporaryPassword: ''
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.enrolledCourseId) {
      setErrorMsg('An enrolled course must be selected');
      return;
    }

    if (!editingStudentId) {
      if (!formData.temporaryPassword || formData.temporaryPassword.length < 6) {
        setErrorMsg('Temporary password must be at least 6 characters');
        return;
      }
    }

    if (editingStudentId) {
      updateUser(editingStudentId, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        enrolledCourseId: formData.enrolledCourseId,
        status: formData.status
      });
    } else {
      const res = saveUser({
        id: 'usr-student-' + crypto.randomUUID().substring(0, 8),
        role: 'Student',
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        enrolledCourseId: formData.enrolledCourseId,
        status: formData.status,
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
    if (studentToDelete) {
      deleteUser(studentToDelete.id);
      loadData();
      setStudentToDelete(null);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unassigned';
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCourseName(s.enrolledCourseId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bootcamp Students
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Student roster and active learning profiles
          </p>
        </div>

        {canModify && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Admit Student
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Search students by name, email or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">Enrolled Program</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Setup Status</th>
                {canModify && <th className="py-3.5 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={canModify ? "6" : "5"} className="py-12 text-center text-slate-400">
                    <FiUsers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No student records found.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center border border-emerald-200">
                          {student.fullName ? student.fullName.charAt(0) : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.fullName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col text-xs text-slate-600 gap-0.5">
                        <span className="flex items-center gap-1.5 font-medium"><FiMail className="w-3.5 h-3.5 text-slate-400" />{student.email}</span>
                        <span className="flex items-center gap-1.5 text-slate-500"><FiPhone className="w-3.5 h-3.5 text-slate-400" />{student.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                        <FiBookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        {getCourseName(student.enrolledCourseId)}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${student.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : student.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                        {student.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 border rounded-full ${!student.mustResetPassword
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {!student.mustResetPassword ? 'Active' : 'Pending Password Reset'}
                      </span>
                    </td>

                    {canModify && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setStudentToDelete(student)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingStudentId ? 'Edit Student Record' : 'Admit Bootcamp Student'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. Priya Sharma" />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Enrolled Bootcamp</label>
                  <select name="enrolledCourseId" value={formData.enrolledCourseId} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
              </div>

              {!editingStudentId && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Temporary Password</label>
                  <input required type="password" name="temporaryPassword" value={formData.temporaryPassword} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="Min 6 characters - share with student" />
                </div>
              )}

              {!editingStudentId && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-700 font-semibold leading-relaxed">
                  ℹ️ <strong>First Login:</strong> Share this temporary password with the student. They must reset it on first login.
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
                  {editingStudentId ? 'Save Changes' : 'Admit Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Student Record?</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Are you sure you want to remove <strong>{studentToDelete.fullName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStudentToDelete(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold">
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

export default Students;
