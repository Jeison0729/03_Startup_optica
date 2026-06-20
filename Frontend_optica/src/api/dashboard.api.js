// DEPENDENCIAS E IMPORTACIONES
import api from "./axios";

// OBTENER RESUMEN DEL DASHBOARD
export const getDashboardResumenApi = (params = {}) =>
  api.get("/api/dashboard/resumen", { params });
