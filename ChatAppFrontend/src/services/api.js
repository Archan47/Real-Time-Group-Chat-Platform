import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8070",
  withCredentials: true
});

// Attach JWT token automatically to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// If 401 on a PROTECTED route, clear tokens and redirect to login
// But DO NOT redirect on auth endpoints — those handle their own errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/refresh") ||
      url.includes("/api/users/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userPicture");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;