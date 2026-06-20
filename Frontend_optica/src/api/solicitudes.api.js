import api from "./axios";

// Solicitar recuperación de contraseña
export const recuperarApi = (correoOUsuario) =>
  api.post("/api/solicitudes/solicitar", { correoOUsuario });

// Restablecer contraseña con código
export const restablecerApi = (correoOUsuario, codigo, nuevaContrasena) =>
  api.post("/api/solicitudes/restablecer", {
    correoOUsuario,
    codigo,
    nuevaContrasena,
  });

// Listar solicitudes pendientes
export const listarPendientesApi = () => api.get("/api/solicitudes/pendientes");

// Listar todas las solicitudes
export const listarTodasApi = () => api.get("/api/solicitudes");

// Aprobar una solicitud
export const aprobarSolicitudApi = (id) =>
  api.patch(`/api/solicitudes/${id}/aprobar`);

// Reenviar solicitud
export const reenviarSolicitudApi = (id) =>
  api.patch(`/api/solicitudes/${id}/reenviar`);
