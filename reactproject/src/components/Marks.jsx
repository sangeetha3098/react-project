import { useState, useEffect } from 'react';
import { getMarks, saveMark, updateMark, deleteMark, getCourses, getUsers, getCurrentUser } from '../utils/authStorage';
import { FiX, FiPlus, FiEdit2, FiTrash2, FiAward, FiSearch, FiFileText } from 'react-icons/fi';

const Marks = () => {
  const currentUser = getCurrentUser();
  const isStudent = currentUser?.role === 'Student';
  const isTrainer = currentUser?.role === 'Trainer';
  const isAdmin = currentUser?.role === 'Admin';
  
  // Trainer can add/modify grades. Admin can only view.
  const canModify = isTrainer; 

  const [marks, setMarks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  // Filter & Modal State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Pre-defined project milestones dropdown options
  const defaultMilestones = [
    "HTML/CSS Responsive Website",
    "JavaScript Calculator App",
    "React E-Commerce Client",
    "Fullstack Node/Express REST API",
    "Cypress Integration Test Suite",
    "Figma Landing Page Wireframe",
    "Google SEO Performance Audit",
    "Final Capstone Project"
  ];
  
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    assignmentName: defaultMilestones[0],
    marksObtained: '',
    maxMarks: '100'
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setMarks(getMarks());
    const crs = getCourses();
    setCourses(crs);
    
    if (isStudent) {
      // Handled in render
    } else if (isTrainer) {
      setSelectedCourseId(currentUser.assignedCourseId || '');
    } else if (isAdmin && crs.length > 0) {
      setSelectedCourseId(crs[0].id);
    }

    const allUsers = getUsers();
    setStudents(allUsers.filter(u => u.role === 'Student'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleOpenAddModal = () => {
    if (!canModify) return;
    const courseStudents = getUsers().filter(
      u => u.role === 'Student' && u.enrolledCourseId === selectedCourseId
    );
    
    if (courseStudents.length === 0) {
      alert("No students registered in this bootcamp. Add students first!");
      return;
    }

    setEditingId(null);
    setFormData({
      studentId: courseStudents[0].id,
      courseId: selectedCourseId,
      assignmentName: defaultMilestones[0],
      marksObtained: '',
      maxMarks: '100'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (mark) => {
    if (!canModify) return;
    setEditingId(mark.id);
    setFormData({
      studentId: mark.studentId,
      courseId: mark.courseId,
      assignmentName: mark.assignmentName,
      marksObtained: mark.marksObtained.toString(),
      maxMarks: mark.maxMarks.toString()
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canModify) return;
    const obtained = parseFloat(formData.marksObtained);
    const max = parseFloat(formData.maxMarks);

    if (isNaN(obtained) || obtained < 0) {
      setErrorMsg('Marks obtained must be a positive number');
      return;
    }
    if (isNaN(max) || max <= 0) {
      setErrorMsg('Maximum marks must be greater than 0');
      return;
    }
    if (obtained > max) {
      setErrorMsg('Marks obtained cannot be greater than maximum marks');
      return;
    }

    const payload = {
      studentId: formData.studentId,
      courseId: formData.courseId,
      assignmentName: formData.assignmentName.trim(),
      marksObtained: obtained,
      maxMarks: max
    };

    if (editingId) {
      updateMark(editingId, payload);
    } else {
      saveMark(payload);
    }

    setShowModal(false);
    setMarks(getMarks());
  };

  const handleDeleteMark = (id) => {
    if (!canModify) return;
    if (confirm("Are you sure you want to delete this grade record?")) {
      deleteMark(id);
      setMarks(getMarks());
    }
  };

  const getStudentName = (sid) => {
    const s = students.find(stud => stud.id === sid);
    return s ? s.fullName : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Bootcamp';
  };

  const displayedMarks = marks.filter(m => {
    const stud = students.find(s => s.id === m.studentId);
    if (!stud) return false;
    
    // Search filter
    const matchSearch = stud.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        m.assignmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Course filter
    const matchCourse = stud.enrolledCourseId === selectedCourseId;
    
    return matchSearch && matchCourse;
  });

  // Student specific logic
  const myMarks = marks.filter(m => m.studentId === currentUser?.id);
  const totalObtained = myMarks.reduce((sum, m) => sum + m.marksObtained, 0);
  const totalMax = myMarks.reduce((sum, m) => sum + m.maxMarks, 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bootcamp Grades
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isStudent ? 'Your transcript of assignment and project grades' : 'Log and manage bootcamp student grades'}
          </p>
        </div>

        {canModify && (
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Enter Student Grades
          </button>
        )}
      </div>

      {!isStudent && (
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Bootcamp Course</label>
              {isTrainer ? (
                <div className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-100 text-slate-700 font-semibold">
                  {getCourseName(currentUser.assignedCourseId)}
                </div>
              ) : (
                <select 
                  value={selectedCourseId} 
                  onChange={(e) => setSelectedCourseId(e.target.value)} 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Search Inside Grades</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search student or project name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Assignment / Project</th>
                    <th className="py-3.5 px-6 text-center">Score</th>
                    <th className="py-3.5 px-6 text-center">Percentage</th>
                    {canModify && <th className="py-3.5 px-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayedMarks.length === 0 ? (
                    <tr>
                      <td colSpan={canModify ? "5" : "4"} className="py-12 text-center text-slate-400">
                        <FiAward className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-xs">No grade records logged for this program selection.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedMarks.map((mark) => {
                      const pct = Math.round((mark.marksObtained / mark.maxMarks) * 100);
                      return (
                        <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{getStudentName(mark.studentId)}</td>
                          <td className="py-4 px-6 font-semibold text-slate-700">{mark.assignmentName}</td>
                          <td className="py-4 px-6 text-center font-mono font-bold text-slate-800">
                            {mark.marksObtained} / {mark.maxMarks}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-xs ${
                              pct >= 80 ? 'bg-emerald-50 text-emerald-700' : pct >= 50 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {pct}%
                            </span>
                          </td>
                          {canModify && (
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-1">
                                <button 
                                  onClick={() => handleOpenEditModal(mark)} 
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Grades"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMark(mark.id)} 
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Grades"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div className="space-y-6">
          {/* Dashboard Summary for student */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative GPA Average</p>
              <h3 className={`text-3xl font-extrabold mt-1 ${
                overallPercentage >= 80 ? 'text-emerald-600' : 'text-slate-800'
              }`}>{overallPercentage}%</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-4">Calculated across all submitted milestones</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Points Scored</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalObtained}</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-4">Total score sum</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Possible Points</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalMax}</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-4">Total milestone maximum score</p>
            </div>
          </div>

          {/* Transcript List Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Bootcamp Learning Transcript</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Bootcamp / Program</th>
                    <th className="py-3.5 px-6">Project Milestone</th>
                    <th className="py-3.5 px-6 text-center">Score Card</th>
                    <th className="py-3.5 px-6 text-right">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {myMarks.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400">
                        <FiFileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-xs">No grades published for your account milestones yet.</p>
                      </td>
                    </tr>
                  ) : (
                    myMarks.map((m) => {
                      const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-800">
                            {getCourseName(m.courseId)}
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-semibold">{m.assignmentName}</td>
                          <td className="py-4 px-6 text-center font-mono font-bold text-slate-800">
                            {m.marksObtained} / {m.maxMarks}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              pct >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : pct >= 50 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {pct >= 50 ? `Complete (${pct}%)` : `Needs Work (${pct}%)`}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Student Grade' : 'Log Project Evaluation'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Select Bootcamp Student</label>
                <select 
                  name="studentId" 
                  value={formData.studentId} 
                  onChange={handleChange} 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                  disabled={!!editingId}
                >
                  {getUsers().filter(
                    u => u.role === 'Student' && u.enrolledCourseId === selectedCourseId
                  ).map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Bootcamp Course</label>
                  <select 
                    name="courseId" 
                    value={formData.courseId} 
                    onChange={handleChange} 
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    disabled={true}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Milestone Project</label>
                  <select 
                    name="assignmentName" 
                    value={formData.assignmentName} 
                    onChange={handleChange} 
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                  >
                    {defaultMilestones.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Marks Obtained</label>
                  <input required type="number" step="0.5" name="marksObtained" value={formData.marksObtained} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. 85" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Maximum Marks</label>
                  <input required type="number" step="1" name="maxMarks" value={formData.maxMarks} onChange={handleChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600" placeholder="e.g. 100" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                  {errorMsg}
                </div>
              )}

              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md">
                  {editingId ? 'Save Changes' : 'Log Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marks;
