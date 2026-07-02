import api from "./axios";

// Obtener historia clínica completa de un paciente
export const obtenerHistoriaClinicaApi = (idPaciente) =>
  api.get(`/api/consultas/historial/${idPaciente}`);
