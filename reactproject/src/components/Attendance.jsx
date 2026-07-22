import { useState, useEffect } from 'react';
import { getAttendance, saveAttendance, getCourses, getUsers, getCurrentUser } from '../utils/authStorage';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const Attendance = () => {
  const currentUser = getCurrentUser();
  const isStudent = currentUser?.role === 'Student';
  const isTrainer = currentUser?.role === 'Trainer';
  const isAdmin = currentUser?.role === 'Admin';
  
  // Trainer or Admin view config
  const canMark = isTrainer; // Only Trainers can mark attendance. Admin can only view.

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Selection states
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  
  // Attendance marking state
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Student view states
  const [studentStats, setStudentStats] = useState({ present: 0, absent: 0, late: 0, percentage: 0 });
  const [studentRecords, setStudentRecords] = useState([]);

  useEffect(() => {
    const crs = getCourses();
    setCourses(crs);

    if (isStudent) {
      loadStudentAttendance();
    } else if (isTrainer) {
      // Lock trainer to their assigned course
      setSelectedCourseId(currentUser.assignedCourseId || '');
    } else if (isAdmin && crs.length > 0) {
      setSelectedCourseId(crs[0].id);
    }
  }, []);

  // When selected course changes, load matching students
  useEffect(() => {
    if (!selectedCourseId) return;
    loadStudentsForAttendance();
  }, [selectedCourseId]);

  // When selected course or date changes, load attendance records
  useEffect(() => {
    if (!selectedCourseId || !selectedDate) return;
    loadExistingAttendance();
  }, [selectedCourseId, selectedDate, students]);

  const loadStudentsForAttendance = () => {
    const allUsers = getUsers();
    // Filter students by course
    const filteredStudents = allUsers.filter(
      u => u.role === 'Student' && u.enrolledCourseId === selectedCourseId
    );
    setStudents(filteredStudents);
    
    // Default attendance sheet is Present
    const initialSheet = filteredStudents.map(s => ({
      studentId: s.id,
      fullName: s.fullName,
      status: 'Present'
    }));
    setAttendanceSheet(initialSheet);
  };

  const loadExistingAttendance = () => {
    const allAtt = getAttendance();
    const existing = allAtt.filter(
      a => a.courseId === selectedCourseId && a.date === selectedDate
    );

    if (existing.length > 0) {
      setAttendanceSheet(prev => 
        prev.map(row => {
          const match = existing.find(e => e.studentId === row.studentId);
          return match ? { ...row, status: match.status } : row;
        })
      );
    } else {
      setAttendanceSheet(students.map(s => ({
        studentId: s.id,
        fullName: s.fullName,
        status: 'Present'
      })));
    }
  };

  const loadStudentAttendance = () => {
    const allAtt = getAttendance();
    const allCourses = getCourses();
    
    // Filter strictly to this student's records
    const myAtt = allAtt.filter(a => a.studentId === currentUser.id);
    
    let present = 0;
    let absent = 0;
    let late = 0;
    
    myAtt.forEach(a => {
      if (a.status === 'Present') present++;
      if (a.status === 'Absent') absent++;
      if (a.status === 'Late') late++;
    });

    const total = myAtt.length;
    const percentage = total > 0 ? Math.round(((present + (late * 0.5)) / total) * 100) : 100;

    setStudentStats({ present, absent, late, percentage });
    
    const formatted = myAtt.map(a => {
      const crs = allCourses.find(c => c.id === a.courseId);
      return {
        id: a.id,
        date: a.date,
        courseName: crs ? crs.name : 'Bootcamp',
        courseCode: crs ? crs.code : '',
        status: a.status
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    setStudentRecords(formatted);
  };

  const handleStatusChange = (studentId, status) => {
    if (!canMark) return; // Prevent admin or students from changing
    setAttendanceSheet(prev => 
      prev.map(row => row.studentId === studentId ? { ...row, status } : row)
    );
  };

  const handleSave = () => {
    if (!canMark || !selectedCourseId) return;
    const records = attendanceSheet.map(row => ({
      studentId: row.studentId,
      courseId: selectedCourseId,
      date: selectedDate,
      status: row.status
    }));

    const res = saveAttendance(records);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const getCourseName = (courseId) => {
    const crs = courses.find(c => c.id === courseId);
    return crs ? crs.name : '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Attendance Registry
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isStudent 
            ? 'Your personal daily attendance record' 
            : isTrainer 
              ? `Manage student attendance for ${getCourseName(currentUser.assignedCourseId)}`
              : 'View student daily attendance records'}
        </p>
      </div>

      {!isStudent && (
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Bootcamp Course</label>
              {isTrainer ? (
                // Trainer course is locked
                <div className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-100 text-slate-700 font-semibold">
                  {getCourseName(currentUser.assignedCourseId)}
                </div>
              ) : (
                // Admin can filter by course
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                disabled={!canMark && isAdmin} // Admin can only select date to view
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              Attendance sheet saved successfully!
            </div>
          )}

          {/* Students List Table */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                Attendance Roster ({students.length} Student{students.length !== 1 ? 's' : ''})
              </h2>
              {canMark && (
                <button 
                  onClick={handleSave} 
                  disabled={students.length === 0} 
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-xs"
                >
                  Submit Attendance
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="py-12 text-center text-slate-400">
                        <FiAlertTriangle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-xs">No students registered in this bootcamp program.</p>
                      </td>
                    </tr>
                  ) : (
                    attendanceSheet.map((row) => (
                      <tr key={row.studentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{row.fullName}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            {['Present', 'Absent', 'Late'].map((st) => {
                              const isActive = row.status === st;
                              let btnClass = "px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ";
                              if (st === 'Present') {
                                btnClass += isActive 
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" 
                                  : "bg-white text-emerald-600 border-slate-200 hover:bg-emerald-50";
                              } else if (st === 'Absent') {
                                btnClass += isActive 
                                  ? "bg-rose-500 text-white border-rose-500 shadow-sm" 
                                  : "bg-white text-rose-600 border-slate-200 hover:bg-rose-50";
                              } else {
                                btnClass += isActive 
                                  ? "bg-amber-500 text-white border-amber-500 shadow-sm" 
                                  : "bg-white text-amber-600 border-slate-200 hover:bg-amber-50";
                              }
                              return (
                                <button 
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(row.studentId, st)}
                                  className={btnClass}
                                  disabled={!canMark} // Disable for Admin
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div className="space-y-6">
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</p>
              <h3 className={`text-3xl font-extrabold mt-1 ${
                studentStats.percentage >= 80 ? 'text-emerald-600' : 'text-rose-600'
              }`}>{studentStats.percentage}%</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-4">80% attendance required to graduate</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Days Present</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{studentStats.present}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-4">Full session attendance</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Days Absent</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{studentStats.absent}</h3>
              <p className="text-[10px] text-rose-600 font-semibold mt-4">Missed learning sessions</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Days Late</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{studentStats.late}</h3>
              <p className="text-[10px] text-amber-600 font-semibold mt-4">Grace period entries</p>
            </div>
          </div>

          {/* Attendance History Logs */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Attendance History Logs</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Session Date</th>
                    <th className="py-3.5 px-6">Bootcamp / Program</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {studentRecords.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-slate-400">
                        <p className="font-semibold text-xs">No attendance logs found for your account.</p>
                      </td>
                    </tr>
                  ) : (
                    studentRecords.map((rec) => {
                      let statusBadge = '';
                      if (rec.status === 'Present') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      else if (rec.status === 'Absent') statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                      else statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 text-slate-700 font-medium">
                            {new Date(rec.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{rec.courseName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{rec.courseCode}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                              {rec.status}
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

    </div>
  );
};

export default Attendance;
