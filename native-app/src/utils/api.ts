import axios, { AxiosInstance } from 'axios';
import { useAuth } from '@clerk/clerk-expo';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
console.log('API_BASE_URL:', API_BASE_URL);

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  
  api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      console.log('Token being sent:', token); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Failed to get token', error);
      return config;
    }
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const authApi = {
  getProfile: (api: AxiosInstance) => api.get('/api/auth/profile'),
  syncUser: (api: AxiosInstance) => api.post('/api/auth/register'),
  updateUser: (api: AxiosInstance) => api.put('/api/auth/profile/update'),
};
