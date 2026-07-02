import api from "./axios";

// Crear una nueva medición
export const crearMedicionApi = (data) => api.post("/api/mediciones", data);

// Buscar medición por ID de consulta
export const buscarMedicionPorConsultaApi = (idConsulta) =>
  api.get(`/api/mediciones/consulta/${idConsulta}`);

// Obtener una medición por ID
export const obtenerMedicionApi = (id) => api.get(`/api/mediciones/${id}`);

// Actualizar una medición
export const actualizarMedicionApi = (id, data) =>
  api.put(`/api/mediciones/${id}`, data);
