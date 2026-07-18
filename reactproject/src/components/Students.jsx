import { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser, getCurrentUser } from '../utils/authStorage';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const currentUser = getCurrentUser();

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

  const handleAddStudent = (e) => {
    e.preventDefault();
    saveUser({
      id: crypto.randomUUID(),
      role: 'Student',
      ...formData,
      createdAt: new Date().toISOString()
    });
    setFormData({ fullName: '', email: '', phone: '', password: '' });
    setShowAddForm(false);
    loadStudents();
  };

  const handleDelete = (id) => {
    deleteUser(id);
    loadStudents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Students</h1>
        {currentUser.role === 'Admin' && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {showAddForm ? 'Cancel' : 'Add Student'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
          <form onSubmit={handleAddStudent} className="space-y-4 max-w-md">
            <input required type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full border rounded p-2" />
            <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2" />
            <input required type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2" />
            <input required type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border rounded p-2" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Student</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
              {currentUser.role === 'Admin' && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {students.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-slate-500">No students found.</td></tr>
            ) : (
              students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.phone}</td>
                  {currentUser.role === 'Admin' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
