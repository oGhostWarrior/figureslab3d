import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.message || 'Erro na operação';
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;