import api from "./axios";

// Listar logs con parámetros opcionales
export const listarLogsApi = (params = {}) => api.get("/api/logs", { params });
