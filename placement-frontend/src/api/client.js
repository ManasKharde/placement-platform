import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Enables sending/receiving HTTP-only cookies
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dedicated isolated axios instance for silent token refresh (avoids interceptor loops)
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor: automatically catch 401s, silently refresh access token, and replay requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const isAuthError =
      status === 401 ||
      (status === 403 &&
        error.response?.data?.message?.toLowerCase().includes("expired"));

    // Guard: ignore non-auth errors, already retried requests, or auth entrypoint calls
    if (
      !isAuthError ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout") ||
      originalRequest.url?.includes("/auth/signup")
    ) {
      return Promise.reject(error);
    }

    // If another request is currently refreshing the token, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Trigger silent token refresh via HTTP-only cookie
      await refreshClient.post("/auth/refresh");

      // Flush queued requests
      processQueue(null);

      // Replay the original request with the fresh access token cookie
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // Refresh token is expired or revoked. Notify application to cleanly redirect to login
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;