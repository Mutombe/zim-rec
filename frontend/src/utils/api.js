import axios from "axios";

// Centralized token refresh function
export const refreshTokens = async (refresh) => {
  try {
    const { data } = await axios.post(
      "http://127.0.0.1:8000/core/auth/refresh/",
      { refresh },
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      access: data.access,
      refresh: data.refresh || refresh,
    };
  } catch (error) {
    console.error("Token Refresh Error:", error);
    throw error;
  }
};

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", //|| import.meta.env.VITE_API_BASE_URL ,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("auth"))?.access; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export const deviceAPI = {
  getFuelOptions: () => api.get("/fuel-options/"),
  getTechnologyOptions: (fuelType) =>
    api.get(`/technology-options/?fuel_type=${fuelType}`),
  getAll: () => api.get("/devices/"),
  getById: (id) => api.get(`/devices/${id}/`),
  getUserDevices: (userId) => api.get(`/devices/?user_id=${userId}`),
  create: (data) => api.post("/devices/", data),
  update: (id, data) => api.patch(`/devices/${id}/`, data),
  delete: (id) => api.delete(`/devices/${id}/`),
  submit: (id) => api.post(`/devices/${id}/submit/`),
};

export const issueRequestAPI = {
  create: (data) => api.post("/issue-requests/", {
    ...data,
    production_amount: parseFloat(data.production_amount).toFixed(6)
  }),
  getAll: () => api.get("/issue-requests/"),
  getUserRequests: (userId) => api.get(`/issue-requests/?user_id=${userId}`),
  submit: (id) => api.post(`/issue-requests/${id}/submit/`),
  update: (id, data) => api.patch(`/issue-requests/${id}/`, {
    ...data,
    production_amount: data.production_amount ? 
      parseFloat(data.production_amount).toFixed(6) : undefined
  }),
};

export default api;
