import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://talent-iq-backend-h0rb.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to attach Clerk session token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Try multiple methods to get Clerk token reliably
    try {
      let token = null;
      
      // Method 1: Try window.Clerk (set by @clerk/clerk-react)
      if (window.Clerk?.session) {
        token = await window.Clerk.session.getToken();
      }
      
      // Method 2: Try __clerk_frontend_api if available
      if (!token && window.__clerk_frontend_api?.session) {
        token = await window.__clerk_frontend_api.session.getToken();
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Could not get Clerk token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
