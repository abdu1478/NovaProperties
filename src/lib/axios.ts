import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Request interceptor to add access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip adding token for auth endpoints
    if (config.url?.includes("/auth")) {
      return config;
    }

    // Get access token from cookie (frontend can't read httpOnly, so we rely on browser)
    // We'll assume browser automatically sends cookies
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/auth/refresh") {
        // Refresh failed, logout user
        await authService.logout();
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Attempt to refresh token
          await authService.refreshToken();
          isRefreshing = false;

          // Retry all queued requests
          refreshSubscribers.forEach((cb) => cb("new-token"));
          refreshSubscribers = [];

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          await authService.logout();
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        }
      }

      // Queue request while token is being refreshed
      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// Auth service methods
const authService = {
  // Register new user
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Google login
  googleLogin: async (token: string) => {
    const response = await api.post("/auth/google", { token });
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.get("/auth/refresh");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Logout user
  logout: async () => {
    await api.get("/auth/logout");
  },

  // Password reset request
  requestPasswordReset: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },
};

// Property service methods
const propertyService = {
  getProperties: async (params = {}) => {
    const response = await api.get("/properties", { params });
    return response.data;
  },

  getPropertyById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: FormData) => {
    const response = await api.post("/properties", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProperty: async (id: string, data: FormData) => {
    const response = await api.put(`/properties/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

// User service methods
const userService = {
  updateProfile: async (data: { name: string; email: string }) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put("/users/password", data);
    return response.data;
  },
};

// Export services
export { api, authService, propertyService, userService };
