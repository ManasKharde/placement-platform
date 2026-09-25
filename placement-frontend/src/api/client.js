import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true, // Enables sending/receiving HTTP-only cookies
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to catch unauthorized responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized or session expired.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;