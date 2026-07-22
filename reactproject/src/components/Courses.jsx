import { useState, useEffect } from 'react';
import { getCourses, saveCourse, updateCourse, deleteCourse, getCurrentUser } from '../utils/authStorage';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiSearch, FiBookOpen } from 'react-icons/fi';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', duration: '12 Weeks' });
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCourses(getCourses());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      code: '', 
      description: '', 
      duration: '12 Weeks' 
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name || '',
      code: course.code || '',
      description: course.description || '',
      duration: course.duration || '12 Weeks'
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      const res = updateCourse(editingId, formData);
      if (res.success) {
        setShowForm(false);
        setCourses(getCourses());
      } else {
        setErrorMsg(res.error);
      }
    } else {
      const res = saveCourse({
        id: 'course-' + crypto.randomUUID().substring(0, 8),
        ...formData
      });
      if (res.success) {
        setShowForm(false);
        setCourses(getCourses());
      } else {
        setErrorMsg(res.error);
      }
    }
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setCourses(getCourses());
      setCourseToDelete(null);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bootcamp Programs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Training bootcamps and programs offered at GCET Training Institute
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Bootcamp Course
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-slate-400 ml-1" />
        <input 
          type="text" 
          placeholder="Search by course name or code..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            No bootcamps found matching your search.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 hover-lift relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center border border-emerald-200 text-base">
                    <FiBookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{course.name}</h3>
                    <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full mt-1">
                      Code: {course.code}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenEditModal(course)} 
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Course"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCourseToDelete(course)} 
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <p className="text-slate-500 mb-2 leading-relaxed h-12 overflow-y-auto">{course.description || 'No description provided.'}</p>
                <div className="flex justify-between pt-1 border-t border-slate-50">
                  <span className="font-semibold text-slate-400">Duration:</span>
                  <span className="font-bold text-slate-700">{course.duration}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Course Details' : 'Add New Course'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Course Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. Frontend" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Course Code</label>
                  <input required type="text" name="code" value={formData.code} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. FSWD-01" disabled={!!editingId} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Duration</label>
                  <select name="duration" value={formData.duration} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600">
                    <option value="8 Weeks">8 Weeks (UI/UX)</option>
                    <option value="12 Weeks">12 Weeks (Web Dev)</option>
                    <option value="16 Weeks">16 Weeks (Data Science)</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. Master React, Node, Express, MongoDB..." />
              </div>

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
                  {editingId ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Course?</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Are you sure you want to delete course <strong>{courseToDelete.name}</strong>? This will detach any students currently enrolled under it.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCourseToDelete(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold">
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

export default Courses;
