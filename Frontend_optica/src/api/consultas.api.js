import api from "./axios";

// Listar consultas con parámetros
export const listarConsultasApi = (params = {}) =>
  api.get("/api/consultas", { params });

// Obtener una consulta por ID
export const obtenerConsultaApi = (id) => api.get(`/api/consultas/${id}`);

// Crear una nueva consulta
export const crearConsultaApi = (data) => api.post("/api/consultas", data);

// Actualizar una consulta
export const actualizarConsultaApi = (id, data) =>
  api.put(`/api/consultas/${id}`, data);

// Cambiar estado de una consulta
export const cambiarEstadoConsultaApi = (id, payload) =>
  api.patch(`/api/consultas/${id}/estado`, payload);
