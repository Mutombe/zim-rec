import axios from "axios";

const api = axios.create({
  baseURL: "https://zim-rec-backend.onrender.com/",
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

// Response interceptor — auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, not on login/register/refresh requests
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login/") &&
      !originalRequest.url.includes("refresh/") &&
      !originalRequest.url.includes("register/")
    ) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authData = JSON.parse(localStorage.getItem("auth"));
      const refreshToken = authData?.refresh;

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        // Clear stale auth
        localStorage.removeItem("auth");
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          "https://zim-rec-backend.onrender.com/refresh/",
          { refresh: refreshToken }
        );

        const newAccess = data.access;
        const updatedAuth = {
          ...authData,
          access: newAccess,
        };
        localStorage.setItem("auth", JSON.stringify(updatedAuth));

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — token fully expired, clear auth
        localStorage.removeItem("auth");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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
