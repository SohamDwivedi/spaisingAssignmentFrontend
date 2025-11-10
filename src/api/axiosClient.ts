import axios from "axios";
import Swal from "sweetalert2";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    const status = error.response?.status;
    const token = localStorage.getItem("token");
    const requestUrl = error.config?.url || "";

    // 🟣 Skip handling for public/auth routes
    const isPublicOrAuthRoute =requestUrl.includes("/auth/") 
      || requestUrl.includes("/public/") 
      || requestUrl.includes("/register")
      || requestUrl.includes("/login");

    console.log(isPublicOrAuthRoute,'---url--',requestUrl);
    // Only trigger session-expired flow for protected endpoints with a token
    if ((status === 401 || message === "Unauthorized or invalid token") && token && !isPublicOrAuthRoute) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      const result = await Swal.fire({
        icon: "warning",
        title: "Session expired",
        text: "Your session has expired. Please login again.",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#9333ea",
        cancelButtonColor: "#6b7280",
        background: "#1f1f1f",
        color: "#fff",
      });

      if (result.isConfirmed) {
        setTimeout(() => {
          if (window.showAuthModal) window.showAuthModal(); // Trigger modal globally
        }, 300);
      } else {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
