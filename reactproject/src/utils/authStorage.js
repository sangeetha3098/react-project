const USERS_KEY = 'institute_users';

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
