import api from './api';

export const authService = {
  // Login
  // login: async (username, password) => {
  //   const response = await api.post('/api/auth/login', { username, password });
  //   if (response.data.access_token) {
  //     localStorage.setItem('token', response.data.access_token);
  //     localStorage.setItem('role', response.data.role);
  //   }
  //   return response.data;
  // },

  login: async (username, password) => {
    // We pass { withCredentials: true } as the 3rd argument (config object)
    const response = await api.post(
        '/api/auth/login', 
        { username, password }, 
        { withCredentials: true } 
    );

    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
    }
    return response.data;
},

  // Create User
  createUser: async (userData) => {
    const response = await api.post('/api/auth/create', userData);
    return response.data;
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // --- NEW: REAL GET ALL USERS ---
  getAllUsers: async () => {
    const response = await api.get('/api/auth/users');
    return response.data; 
    // Expects: [{ id, username, role, created_at }, ...]
  },

  // Change Password
  changePassword: async (targetUsername, newPassword) => {
    const response = await api.post('/api/auth/change-password', {
      target_username: targetUsername,
      new_password: newPassword
    });
    return response.data;
  },

  // Delete User
  deleteUser: async (username) => {
    const response = await api.delete(`/api/auth/delete?username=${username}`);
    return response.data;
  }

};
