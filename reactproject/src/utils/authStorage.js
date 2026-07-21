// LocalStorage helper for Institute Management Portal
const USERS_KEY = 'institute_users';
const CURRENT_USER_KEY = 'current_user';
const ACTIVITIES_KEY = 'institute_activities';

// Initial sample activities so the feed has historical events
const dummyActivities = [
  {
    id: 'act-1',
    title: 'New student record registered: Aarav Patel (B.Tech CSE)',
    type: 'student',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'act-2',
    title: 'Staff Directory updated by Dr. Rajesh Sharma',
    type: 'staff',
    timestamp: new Date(Date.now() - 3600000 * 26).toISOString() // yesterday
  },
  {
    id: 'act-3',
    title: 'Semester examination schedule uploaded to portal',
    type: 'notice',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
  }
];

// Initial mock users
const dummyUsers = [
  { 
    id: 'usr-admin-01', 
    role: 'Admin', 
    fullName: 'Dr. Rajesh Sharma', 
    email: 'admin@gcet.edu.in', 
    phone: '9876543210', 
    password: 'admin', 
    department: 'Institute Administration' 
  },
  { 
    id: 'usr-staff-01', 
    role: 'Staff', 
    fullName: 'Prof. Ananya Roy', 
    email: 'ananya.roy@gcet.edu.in', 
    phone: '9812345678', 
    password: 'staff', 
    department: 'Computer Science & Engineering' 
  },
  { 
    id: 'usr-staff-02', 
    role: 'Staff', 
    fullName: 'Dr. Vikramaditya Verma', 
    email: 'vikram.verma@gcet.edu.in', 
    phone: '9823456789', 
    password: 'staff', 
    department: 'Electrical Engineering' 
  },
  { 
    id: 'usr-student-01', 
    role: 'Student', 
    fullName: 'Aarav Patel', 
    email: 'aarav.patel@student.gcet.edu.in', 
    phone: '9712345678', 
    password: 'student', 
    course: 'B.Tech Computer Science', 
    semester: '4th Semester' 
  },
  { 
    id: 'usr-student-02', 
    role: 'Student', 
    fullName: 'Priya Sundaram', 
    email: 'priya.s@student.gcet.edu.in', 
    phone: '9723456789', 
    password: 'student', 
    course: 'B.Tech Electronics', 
    semester: '6th Semester' 
  }
];

export const initializeDummyData = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(dummyUsers));
  }
  const existingActivities = localStorage.getItem(ACTIVITIES_KEY);
  if (!existingActivities) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(dummyActivities));
  }
};

export const getActivities = () => {
  const data = localStorage.getItem(ACTIVITIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const logActivity = (title, type = 'general') => {
  let activities = getActivities();
  const newActivity = {
    id: 'act-' + crypto.randomUUID(),
    title,
    type,
    timestamp: new Date().toISOString()
  };
  // Add to beginning of array
  activities.unshift(newActivity);
  // Keep latest 20 activities
  if (activities.length > 20) {
    activities = activities.slice(0, 20);
  }
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
};

export const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (newUser) => {
  let users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (exists) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Log dynamic activity event
  const currentActor = getCurrentUser()?.fullName || newUser.fullName;
  if (newUser.role === 'Student') {
    logActivity(`New student record registered: ${newUser.fullName} (${newUser.course || 'Enrolled Student'})`, 'student');
  } else if (newUser.role === 'Staff') {
    logActivity(`Staff Directory updated by ${currentActor}: Added ${newUser.fullName}`, 'staff');
  } else {
    logActivity(`New Admin account created: ${newUser.fullName}`, 'admin');
  }

  return { success: true };
};

export const updateUser = (id, updatedData) => {
  let users = getUsers();
  let foundIndex = users.findIndex(u => u.id === id);
  if (foundIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  const oldUser = users[foundIndex];
  users[foundIndex] = { ...oldUser, ...updatedData };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update current session if the updated user is logged in
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[foundIndex]));
  }

  // Log dynamic activity event
  const actorName = currentUser?.fullName || oldUser.fullName;
  if (oldUser.role === 'Student') {
    logActivity(`Student profile updated for ${users[foundIndex].fullName} by ${actorName}`, 'student');
  } else if (oldUser.role === 'Staff') {
    logActivity(`Staff Directory updated by ${actorName}: Updated record of ${users[foundIndex].fullName}`, 'staff');
  } else {
    logActivity(`Admin details updated for ${users[foundIndex].fullName}`, 'admin');
  }

  return { success: true };
};

export const deleteUser = (id) => {
  let users = getUsers();
  const targetUser = users.find(u => u.id === id);
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));

  // Log dynamic activity event
  if (targetUser) {
    const actorName = getCurrentUser()?.fullName || 'Admin';
    logActivity(`${targetUser.role} record for ${targetUser.fullName} removed by ${actorName}`, 'delete');
  }

  return { success: true };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, error: 'User with this email not found.' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Invalid password. Please check and try again.' };
  }
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
};

export const getCurrentUser = () => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true };
};
