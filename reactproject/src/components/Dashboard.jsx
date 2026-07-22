import { getCurrentUser, getUsers, getActivities, getCourses } from '../utils/authStorage';
import { FiUsers, FiUserCheck, FiBookOpen, FiClock, FiBell, FiShield, FiMail, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = getCurrentUser();
  const users = getUsers();
  const activities = getActivities();
  const courses = getCourses();

  const studentCount = users.filter(u => u.role === 'Student').length;
  const trainerCount = users.filter(u => u.role === 'Trainer').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const courseCount = courses.length;

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin': return 'bg-amber-400/20 text-amber-200 border-amber-400/30';
      case 'Trainer': return 'bg-indigo-400/20 text-indigo-200 border-indigo-400/30';
      default: return 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30';
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unassigned';
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getActivityDotColor = (type) => {
    switch (type) {
      case 'student': return 'bg-emerald-500';
      case 'staff': return 'bg-indigo-500';
      case 'delete': return 'bg-rose-500';
      case 'admin': return 'bg-amber-500';
      default: return 'bg-violet-500';
    }
  };

  const isAdmin = user?.role === 'Admin';
  const isTrainer = user?.role === 'Trainer';
  const isStudent = user?.role === 'Student';

  // Trainer view helper data
  const myStudents = users.filter(
    u => u.role === 'Student' && u.enrolledCourseId === user?.assignedCourseId
  );
  
  // Student view helper data
  const myCourse = courses.find(c => c.id === user?.enrolledCourseId);
  const myTrainer = users.find(
    u => u.role === 'Trainer' && u.assignedCourseId === user?.enrolledCourseId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">

      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-8 sm:p-10 text-white shadow-2xl border border-slate-800/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-emerald-600/10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(user?.role)}`}>
              {user?.role} Access
            </span>
            <span className="text-slate-400 text-xs font-semibold">Training Institute Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {isAdmin 
              ? 'Provision technical bootcamps, manage trainer schedules, admit students, and track learning progress.'
              : isTrainer
                ? `You are assigned to lead the ${getCourseName(user?.assignedCourseId)} Bootcamp batch. Evaluate projects and log daily attendance below.`
                : `Welcome to your learning portal. Access your assigned training milestones, attendance registry, and transcript.`}
          </p>
        </div>
      </div>

      {/* Admin Dashboard Stats */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard icon={FiUsers} label="Total Students" value={studentCount} color="emerald" sub="Enrolled bootcampers" />
            <MetricCard icon={FiUserCheck} label="Trainers" value={trainerCount} color="indigo" sub="Active technical coaches" />
            <MetricCard icon={FiBookOpen} label="Bootcamp Courses" value={courseCount} color="sky" sub="Active program catalog" />
            <MetricCard icon={FiShield} label="Administrators" value={adminCount} color="amber" sub="Full system governance" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic Activity Feed */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-indigo-600" />
                  Recent Activity Feed
                </h2>
              </div>
              <div className="space-y-3.5 text-sm">
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No recent activities logged yet.</p>
                ) : (
                  activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start transition-all hover:bg-slate-100/60">
                      <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${getActivityDotColor(act.type)} flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-snug truncate">{act.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{formatTimeAgo(act.timestamp)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FiBell className="w-5 h-5 text-amber-500" />
                Official Notices
              </h2>
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80">
                  <h3 className="font-bold text-amber-900 mb-1">Final Capstone Presentation</h3>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    All students must submit project repositories by Friday midnight for review.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200/80">
                  <h3 className="font-bold text-indigo-900 mb-1">Figma UI/UX Workshop</h3>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    Guest session by lead designer on Design Systems. Check event schedules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Trainer Dashboard - Assigned Batch details and list of students */}
      {isTrainer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Detail Sidebar */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Batch Course</h2>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{getCourseName(user.assignedCourseId)}</h3>
              <p className="text-xs text-slate-500 mt-2">
                All students registered in this course program fall under your supervision.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Tools</h4>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/attendance" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold p-3 rounded-xl text-center border border-indigo-100 transition-colors">
                  📝 Mark Attendance
                </Link>
                <Link to="/marks" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold p-3 rounded-xl text-center border border-emerald-100 transition-colors">
                  🏆 Log Project Marks
                </Link>
              </div>
            </div>
          </div>

          {/* Batch Students Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                My Batch Student Roster ({myStudents.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Email Address</th>
                    <th className="py-3.5 px-6">Phone Number</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {myStudents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400">
                        No students are currently enrolled in your batch.
                      </td>
                    </tr>
                  ) : (
                    myStudents.map((stud) => (
                      <tr key={stud.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{stud.fullName}</td>
                        <td className="py-4 px-6 text-slate-600">{stud.email}</td>
                        <td className="py-4 px-6 text-slate-500">{stud.phone}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-block text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                            {stud.status || 'Active'}
                          </span>
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

      {/* Student Dashboard - Enrolled course & assigned instructor info */}
      {isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Program Detail Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Enrolled Bootcamp
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">{myCourse?.name || 'Unassigned'}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {myCourse?.description || 'You are set to begin your training soon.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Course Duration</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{myCourse?.duration || 'N/A'}</p>
            </div>
          </div>

          {/* Instructor detail card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Assigned Instructor
              </span>
              {myTrainer ? (
                <div className="mt-3">
                  <h4 className="text-lg font-extrabold text-slate-900">{myTrainer.fullName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Technical bootcamp coach</p>
                  
                  <div className="space-y-2 mt-4 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <FiMail className="text-slate-400" />
                      <span>{myTrainer.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-slate-400" />
                      <span>{myTrainer.phone}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-3">
                  No technical trainer has been assigned to this batch yet.
                </p>
              )}
            </div>
          </div>

          {/* Quick shortcuts */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4 justify-between flex flex-col">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bootcamp Quick Links</h3>
              <p className="text-xs text-slate-500 mt-1">Easily view your learning logs.</p>
            </div>
            
            <div className="space-y-2">
              <Link to="/attendance" className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-xs">
                📊 Check My Attendance
              </Link>
              <Link to="/marks" className="block text-center border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all">
                🏆 View My Grades Transcript
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, color, sub }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const textColor = {
    emerald: 'text-emerald-600',
    indigo: 'text-indigo-600',
    sky: 'text-sky-600',
    amber: 'text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover-lift flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h3>
        <p className={`text-[10px] font-semibold ${textColor[color]} mt-2`}>{sub}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Dashboard;
