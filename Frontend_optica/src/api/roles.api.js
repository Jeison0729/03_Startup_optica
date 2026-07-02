import api from "./axios";

// Listar todos los roles
export const listarRolesApi = () => api.get("/api/roles");
