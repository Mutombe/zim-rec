import axios from "axios";

// Centralized token refresh function
export const refreshTokens = async (refresh) => {
  try {
    const { data } = await axios.post(
      "http://127.0.0.1:8000/core/auth/refresh/", 
      { refresh },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return {
      access: data.access,
      refresh: data.refresh || refresh 
    };
  } catch (error) {
    console.error("Token Refresh Error:", error);
    throw error;
  }
};


const api = axios.create({
  baseURL:  'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const token = JSON.parse(localStorage.getItem('auth'))?.access;
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
        const newToken = await refreshTokens();
        localStorage.setItem('accessToken', newToken);
        return api(originalRequest);
      }
      return Promise.reject(error);
    }
  );

export const deviceAPI = {
  getFuelOptions: () => api.get('/fuel-options/'),
  getTechnologyOptions: (fuelType) => 
    api.get(`/technology-options/?fuel_type=${fuelType}`),
  getAll: () => api.get('/devices/'),
  create: (data) => api.post('/devices/', data),
  update: (id, data) => api.patch(`/devices/${id}/`, data),
  delete: (id) => api.delete(`/devices/${id}/`),
  submit: (id) => api.post(`/devices/${id}/submit/`),
};

export const issueRequestAPI = {
  create: (data) => api.post('/issue-requests/', data),
  submit: (id) => api.patch(`/issue-requests/${id}/submit/`),
};

export default api;