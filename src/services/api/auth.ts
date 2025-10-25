// services/api/auth.ts
import axiosInstance from '../../utils/axios';
import { SignInData, SignUpData, AuthResponse, User } from '../../types';

export const authApi = {
  signUp: async (data: SignUpData): Promise<User> => {
    const response = await axiosInstance.post('/api/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/api/auth/signin', data);
    return response.data;
  },

  signOut: async (): Promise<void> => {
    // Optional: Call backend logout if needed
    // await axiosInstance.post('/api/auth/signout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  forgotPassword: async (email: string): Promise<void> => {
    const response = await axiosInstance.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    const response = await axiosInstance.post('/api/auth/reset-password', { token, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await axiosInstance.get('/api/auth/me');
    return data?.data?.user;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await axiosInstance.post('/api/auth/refresh');
    return response.data;
  },
};
