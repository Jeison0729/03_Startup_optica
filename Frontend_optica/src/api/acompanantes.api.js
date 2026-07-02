import api from "./axios";

// Crear un nuevo acompañante
export const crearAcompananteApi = (data) =>
  api.post("/api/acompanantes", data);

// Listar acompañantes por consulta
export const listarAcompanantesApi = (idConsulta, params = {}) =>
  api.get("/api/acompanantes", { params: { idConsulta, ...params } });

// Obtener un acompañante por ID
export const obtenerAcompananteApi = (id) => api.get(`/api/acompanantes/${id}`);

// Actualizar un acompañante
export const actualizarAcompananteApi = (id, data) =>
  api.put(`/api/acompanantes/${id}`, data);

// Eliminar un acompañante
export const eliminarAcompananteApi = (id) =>
  api.delete(`/api/acompanantes/${id}`);
