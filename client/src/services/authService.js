import API from './api';

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data;
  },

  verifyEmail: async (email, otp) => {
    const response = await API.post('/auth/verify-email', { email, otp });
    return response.data;
  },

  resendOTP: async (email) => {
    const response = await API.post('/auth/resend-otp', { email });
    return response.data;
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/auth/profile', profileData);
    return response.data;
  },

  getAdminStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },

  getAdminUsers: async () => {
    const response = await API.get('/admin/users');
    return response.data;
  }
};
