// We use localStorage to save data locally in the user's browser.
// This is a simple substitute for a real database (like MongoDB or SQL).
const USERS_KEY = 'institute_users';
const CURRENT_USER_KEY = 'current_user';

// These are our initial mock users so the app isn't empty on first load.
const dummyData = [
  { id: crypto.randomUUID(), role: 'Admin', fullName: 'Admin User', email: 'admin@institute.edu', phone: '555-0001', password: 'password', department: 'Administration' },
  { id: crypto.randomUUID(), role: 'Staff', fullName: 'Dr. Alan Turing', email: 'alan@institute.edu', phone: '555-0101', password: 'password', department: 'Computer Science' },
  { id: crypto.randomUUID(), role: 'Staff', fullName: 'Marie Curie', email: 'marie@institute.edu', phone: '555-0102', password: 'password', department: 'Physics' },
  { id: crypto.randomUUID(), role: 'Student', fullName: 'Alice Smith', email: 'alice@student.edu', phone: '555-0201', password: 'password', course: 'B.Sc Computer Science', semester: '4th' },
  { id: crypto.randomUUID(), role: 'Student', fullName: 'Bob Johnson', email: 'bob@student.edu', phone: '555-0202', password: 'password', course: 'B.Sc Physics', semester: '2nd' },
];

/**
 * Populates our fake database with dummyData if it's currently empty.
 * Runs once when the app starts in main.jsx.
 */
export const initializeDummyData = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    // Save the dummy data as a string in local storage
    localStorage.setItem(USERS_KEY, JSON.stringify(dummyData));
  }
}

/**
 * Retrieves ALL users from the browser's localStorage.
 */
export const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  
  // If we have data, parse the JSON string back into a real JavaScript array
  if (data) {
    return JSON.parse(data);
  } else {
    return []; // Return an empty array if nothing is saved yet
  }
}

/**
 * Adds a new user to the storage.
 */
export const saveUser = (newUser) => {
  let users = getUsers();
  
  // 1. Check if someone already signed up with this email
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === newUser.email.toLowerCase()) {
      return { success: false, error: 'An account with this email already exists.' };
    }
  }
  
  // 2. Add the new user to the end of the array
  users.push(newUser);
  
  // 3. Save the updated array back to local storage
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return { success: true };
}

/**
 * Updates an existing user's information.
 */
export const updateUser = (id, updatedData) => {
  let users = getUsers();
  let found = false;
  
  // 1. Loop through all users to find the one we want to update
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      
      // 2. We found them! Update their data.
      // The ... spreads out the old data, then the updatedData overwrites it.
      users[i] = { ...users[i], ...updatedData };
      found = true;
      break; // Stop looping since we found the user
    }
  }

  // If we didn't find the user, return an error
  if (!found) {
    return { success: false, error: 'User not found' };
  }

  // 3. Save the updated array back to local storage
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

/**
 * Deletes a user by their ID.
 */
export const deleteUser = (id) => {
  let users = getUsers();
  let remainingUsers = [];
  
  // 1. Loop through all users
  for (let i = 0; i < users.length; i++) {
    
    // 2. If this is NOT the user we want to delete, keep them
    if (users[i].id !== id) {
      remainingUsers.push(users[i]);
    }
  }
  
  // 3. Save the new array (which is missing the deleted user) back to storage
  localStorage.setItem(USERS_KEY, JSON.stringify(remainingUsers));
  
  return { success: true };
}


/* ==============================================================
   AUTHENTICATION FUNCTIONS (LOGIN, LOGOUT, GET CURRENT USER)
   ============================================================== */

/**
 * Verifies email and password to log someone in.
 */
export const loginUser = (email, password) => {
  let users = getUsers();
  
  // 1. Loop through users to find a matching email
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase()) {
      
      // 2. Check if the password matches
      if (users[i].password === password) {
        
        // 3. Password matches! Save them as the currently logged in user
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[i]));
        return { success: true, user: users[i] };
        
      } else {
        return { success: false, error: 'Incorrect password.' };
      }
    }
  }
  
  // If the loop finishes and we didn't find the email
  return { success: false, error: 'Email not found.' };
}

/**
 * Gets the profile of the person who is currently logged in.
 */
export const getCurrentUser = () => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  
  if (data) {
    return JSON.parse(data);
  } else {
    return null; // Nobody is logged in
  }
}

/**
 * Logs the user out by removing their info from localStorage.
 */
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true };
}

