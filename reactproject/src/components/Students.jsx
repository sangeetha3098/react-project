import { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser, updateUser, getCurrentUser } from '../utils/authStorage';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', course: '', semester: '' });
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';
  const isStaff = currentUser?.role === 'Staff';
  const canEdit = isAdmin || isStaff;

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allUsers = getUsers();
    setStudents(allUsers.filter(u => u.role === 'Student'));
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingStudentId) {
      updateUser(editingStudentId, formData);
    } else {
      saveUser({
        id: crypto.randomUUID(),
        role: 'Student',
        ...formData,
        createdAt: new Date().toISOString()
      });
    }
    setFormData({ fullName: '', email: '', phone: '', password: '', course: '', semester: '' });
    setShowAddForm(false);
    setEditingStudentId(null);
    loadStudents();
  };

  const handleEdit = (student) => {
    setFormData({ 
      fullName: student.fullName, 
      email: student.email, 
      phone: student.phone, 
      password: student.password || '',
      course: student.course || '',
      semester: student.semester || ''
    });
    setEditingStudentId(student.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if(confirm('Are you sure you want to delete this student record?')) {
      deleteUser(id);
      loadStudents();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            Student Records
          </h1>
          <p className="text-slate-500 mt-2">Manage enrolled students and their academic details</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => {
              setShowAddForm(true);
              setEditingStudentId(null);
              setFormData({ fullName: '', email: '', phone: '', password: '', course: '', semester: '' });
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            + Register Student
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingStudentId ? 'Edit Student Record' : 'Register New Student'}
              </h2>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddOrUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50" placeholder="e.g. John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50" placeholder="john@student.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50" placeholder="555-0299" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course/Program</label>
                  <input required type="text" name="course" value={formData.course} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50" placeholder="e.g. B.Sc Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semester/Year</label>
                  <input required type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50" placeholder="e.g. 4th Semester" />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all font-medium">
                  {editingStudentId ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80 backdrop-blur">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Info</th>
                {canEdit && <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? "4" : "3"} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <p>No students enrolled yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg ring-2 ring-white">
                          {student.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{student.fullName}</div>
                          <div className="text-xs text-slate-500">ID: {student.id.substring(0, 8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{student.email}</div>
                      <div className="text-sm text-slate-500">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{student.course || 'Not Assigned'}</div>
                      <div className="text-sm text-slate-500">{student.semester ? `Semester: ${student.semester}` : 'N/A'}</div>
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(student)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <span className="sr-only">Edit</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          {isAdmin && (
                            <button onClick={() => handleDelete(student.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <span className="sr-only">Delete</span>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
    </div>
  );
};

export default Students;

