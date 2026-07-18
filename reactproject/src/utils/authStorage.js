const USERS_KEY = 'institute_users';

const dummyData = [
  { id: crypto.randomUUID(), role: 'Admin', fullName: 'Admin User', email: 'admin@institute.edu', phone: '555-0001', password: 'password', department: 'Administration' },
  { id: crypto.randomUUID(), role: 'Staff', fullName: 'Dr. Alan Turing', email: 'alan@institute.edu', phone: '555-0101', password: 'password', department: 'Computer Science' },
  { id: crypto.randomUUID(), role: 'Staff', fullName: 'Marie Curie', email: 'marie@institute.edu', phone: '555-0102', password: 'password', department: 'Physics' },
  { id: crypto.randomUUID(), role: 'Student', fullName: 'Alice Smith', email: 'alice@student.edu', phone: '555-0201', password: 'password', course: 'B.Sc Computer Science', semester: '4th' },
  { id: crypto.randomUUID(), role: 'Student', fullName: 'Bob Johnson', email: 'bob@student.edu', phone: '555-0202', password: 'password', course: 'B.Sc Physics', semester: '2nd' },
];

export function initializeDummyData() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(dummyData));
  }
}

export function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user) {
  const users = getUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (exists) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

export function updateUser(id, updatedData) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  }
  return { success: false, error: 'User not found' };
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    return { success: false, error: 'Email not found.' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }
  localStorage.setItem('current_user', JSON.stringify(user));
  return { success: true, user };
}

export function getCurrentUser() {
  const data = localStorage.getItem('current_user');
  return data ? JSON.parse(data) : null;
}

export function logoutUser() {
  localStorage.removeItem('current_user');
  return { success: true };
}

export function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  return { success: true };
}
