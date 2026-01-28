import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://talent-iq-backend-h0rb.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to attach Clerk session token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Try to get token from Clerk (if available)
    if (window.Clerk && window.Clerk.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("Could not get Clerk token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
