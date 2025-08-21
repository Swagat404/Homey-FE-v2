/**
 * Authentication API service
 */

import { api } from './client';
import { User, UserLogin, UserCreate, UserSession } from './types';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: UserLogin): Promise<UserSession> => {
    return api.post<UserSession>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  register: async (userData: UserCreate): Promise<UserSession> => {
    return api.post<UserSession>('/auth/register', userData);
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<UserSession> => {
    return api.post<UserSession>('/auth/refresh');
  },
};
