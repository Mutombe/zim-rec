import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        localStorage.setItem('accessToken', newToken);
        return api(originalRequest);
      }
      return Promise.reject(error);
    }
  );

export const deviceAPI = {
  getFuelOptions: () => api.get('/api/fuel-options/'),
  getTechnologyOptions: (fuelType) => 
        api.get(`/api/technology-options/?fuel_type=${fuelType}`),
  getAll: () => api.get('/api/devices/'),
  create: (data) => api.post('/api/devices/', data),
  update: (id, data) => api.patch(`/api/devices/${id}/`, data),
  delete: (id) => api.delete(`/api/devices/${id}/`),
  submit: (id) => api.post(`/api/devices/${id}/submit/`),
};

export const issueRequestAPI = {
  create: (data) => api.post('/api/issue-requests/', data),
  submit: (id) => api.patch(`/api/issue-requests/${id}/submit/`),
};

export default api;