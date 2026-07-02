import api from "./axios";

// Listar pacientes con parámetros
export const listarPacientesApi = (params = {}) =>
  api.get("/api/pacientes", { params });

// Obtener un paciente por ID
export const obtenerPacienteApi = (id) => api.get(`/api/pacientes/${id}`);

// Crear un nuevo paciente
export const crearPacienteApi = (data) => api.post("/api/pacientes", data);

// Actualizar un paciente
export const actualizarPacienteApi = (id, data) =>
  api.put(`/api/pacientes/${id}`, data);

// Cambiar estado de un paciente
export const cambiarEstadoPacienteApi = (id, idEstado) =>
  api.patch(`/api/pacientes/${id}/estado`, { idEstado });
