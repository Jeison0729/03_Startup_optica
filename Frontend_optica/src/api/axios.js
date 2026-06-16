import axios from "axios";

// CONFIGURACIÓN BASE DE AXIOS
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// INTERCEPTOR DE SOLICITUDES (agrega token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR DE RESPUESTAS (maneja 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");

      const esPeticionLogin = error.config?.url?.includes("/auth/login");

      if (!esPeticionLogin) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
