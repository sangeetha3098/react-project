// LocalStorage keys
const USERS_KEY = 'institute_users';
const CURRENT_USER_KEY = 'current_user';
const ACTIVITIES_KEY = 'institute_activities';
const COURSES_KEY = 'institute_courses';
const ATTENDANCE_KEY = 'institute_attendance';
const MARKS_KEY = 'institute_marks';

// ==========================================
// Sample Data (loaded on first launch only)
// ==========================================

const sampleCourses = [
  { id: 'course-frontend', name: 'Frontend', code: 'FE-01', description: 'HTML, CSS, JavaScript, React.js and responsive web design', duration: '12 Weeks' },
  { id: 'course-fullstack', name: 'Fullstack', code: 'FS-02', description: 'MERN stack - MongoDB, Express, React, Node.js', duration: '16 Weeks' },
  { id: 'course-automation', name: 'Automation', code: 'AT-03', description: 'Selenium, Cypress, API testing and CI/CD pipelines', duration: '10 Weeks' },
  { id: 'course-digital', name: 'Digital Marketing', code: 'DM-04', description: 'SEO, Google Ads, Social Media Marketing and Analytics', duration: '8 Weeks' },
];

const sampleUsers = [
  {
    id: 'trainer-01',
    role: 'Trainer',
    fullName: 'Ananya Roy',
    email: 'ananya@training.com',
    phone: '9812345678',
    password: 'trainer123',
    mustResetPassword: true,
    assignedCourseId: 'course-frontend',
  },
  {
    id: 'trainer-02',
    role: 'Trainer',
    fullName: 'Vikram Verma',
    email: 'vikram@training.com',
    phone: '9823456789',
    password: 'trainer123',
    mustResetPassword: true,
    assignedCourseId: 'course-fullstack',
  },
  {
    id: 'student-01',
    role: 'Student',
    fullName: 'Aarav Patel',
    email: 'aarav@student.com',
    phone: '9712345678',
    password: 'student123',
    mustResetPassword: true,
    enrolledCourseId: 'course-frontend',
    status: 'Active',
  },
  {
    id: 'student-02',
    role: 'Student',
    fullName: 'Priya Sundaram',
    email: 'priya@student.com',
    phone: '9723456789',
    password: 'student123',
    mustResetPassword: true,
    enrolledCourseId: 'course-digital',
    status: 'Active',
  },
];

const sampleActivities = [
  { id: 'act-1', title: 'Training portal launched successfully', type: 'general', timestamp: new Date().toISOString() },
];

// ==========================================
// Initialize data on first app load
// ==========================================

export function initializeDummyData() {
  if (!localStorage.getItem(COURSES_KEY)) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(sampleCourses));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
  }
  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(sampleActivities));
  }
  if (!localStorage.getItem(ATTENDANCE_KEY)) {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(MARKS_KEY)) {
    localStorage.setItem(MARKS_KEY, JSON.stringify([]));
  }
}

// ==========================================
// Activity Log
// ==========================================

export function getActivities() {
  return JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
}

export function logActivity(title, type = 'general') {
  const activities = getActivities();
  activities.unshift({
    id: 'act-' + crypto.randomUUID(),
    title,
    type,
    timestamp: new Date().toISOString(),
  });
  // keep only last 20
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities.slice(0, 20)));
}

// ==========================================
// Users (Admin, Trainer, Student)
// ==========================================

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUser(newUser) {
  const users = getUsers();

  // check duplicate email
  if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  logActivity(`New ${newUser.role} added: ${newUser.fullName}`, newUser.role.toLowerCase());
  return { success: true };
}

export function updateUser(id, changes) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return { success: false, error: 'User not found' };

  users[index] = { ...users[index], ...changes };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // also update current session if editing yourself
  const current = getCurrentUser();
  if (current && current.id === id) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
  }

  return { success: true };
}

export function deleteUser(id) {
  const users = getUsers();
  const target = users.find(u => u.id === id);
  const remaining = users.filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(remaining));

  if (target) {
    logActivity(`Removed ${target.role}: ${target.fullName}`, 'delete');
  }
  return { success: true };
}

// ==========================================
// Login / Logout
// ==========================================

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'No account found with this email.' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  // If user must reset password, don't fully log in yet
  if (user.mustResetPassword || user.passwordSet === false) {
    return { success: false, mustReset: true, user };
  }

  // Normal login
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ==========================================
// Courses
// ==========================================

export function getCourses() {
  return JSON.parse(localStorage.getItem(COURSES_KEY) || '[]');
}

export function saveCourse(course) {
  const list = getCourses();
  if (list.some(c => c.code.toUpperCase() === course.code.toUpperCase())) {
    return { success: false, error: 'Course code already exists.' };
  }
  list.push(course);
  localStorage.setItem(COURSES_KEY, JSON.stringify(list));
  logActivity(`Course added: ${course.name}`, 'general');
  return { success: true };
}

export function updateCourse(id, changes) {
  const list = getCourses();
  const index = list.findIndex(c => c.id === id);
  if (index === -1) return { success: false, error: 'Course not found.' };
  list[index] = { ...list[index], ...changes };
  localStorage.setItem(COURSES_KEY, JSON.stringify(list));
  logActivity(`Course updated: ${list[index].name}`, 'general');
  return { success: true };
}

export function deleteCourse(id) {
  const list = getCourses().filter(c => c.id !== id);
  localStorage.setItem(COURSES_KEY, JSON.stringify(list));
  logActivity('A course was deleted', 'delete');
  return { success: true };
}

// ==========================================
// Attendance
// ==========================================

export function getAttendance() {
  return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
}

export function saveAttendance(records) {
  const list = getAttendance();

  records.forEach(rec => {
    const existingIndex = list.findIndex(
      a => a.studentId === rec.studentId && a.date === rec.date && a.courseId === rec.courseId
    );
    if (existingIndex !== -1) {
      list[existingIndex].status = rec.status;
    } else {
      list.push({ id: 'att-' + crypto.randomUUID(), ...rec });
    }
  });

  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(list));
  logActivity(`Attendance saved for ${records.length} student(s)`, 'general');
  return { success: true };
}

// ==========================================
// Marks
// ==========================================

export function getMarks() {
  return JSON.parse(localStorage.getItem(MARKS_KEY) || '[]');
}

export function saveMark(mark) {
  const list = getMarks();
  list.push({ id: 'mark-' + crypto.randomUUID(), ...mark });
  localStorage.setItem(MARKS_KEY, JSON.stringify(list));
  logActivity('New grade recorded', 'general');
  return { success: true };
}

export function updateMark(id, changes) {
  const list = getMarks();
  const index = list.findIndex(m => m.id === id);
  if (index === -1) return { success: false, error: 'Mark not found.' };
  list[index] = { ...list[index], ...changes };
  localStorage.setItem(MARKS_KEY, JSON.stringify(list));
  logActivity('Grade updated', 'general');
  return { success: true };
}

export function deleteMark(id) {
  const list = getMarks().filter(m => m.id !== id);
  localStorage.setItem(MARKS_KEY, JSON.stringify(list));
  logActivity('Grade removed', 'delete');
  return { success: true };
}
