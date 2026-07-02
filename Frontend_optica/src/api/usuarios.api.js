import api from "./axios";

// Listar todos los usuarios
export const listarUsuariosApi = () => api.get("/api/usuarios");

// Obtener un usuario por ID
export const obtenerUsuarioApi = (id) => api.get(`/api/usuarios/${id}`);

// Crear un nuevo usuario
export const crearUsuarioApi = (data) => api.post("/api/usuarios", data);

// Actualizar un usuario
export const actualizarUsuarioApi = (id, data) =>
  api.put(`/api/usuarios/${id}`, data);

// Eliminar (soft delete) un usuario
export const eliminarUsuarioApi = (id) =>
  api.patch(`/api/usuarios/${id}/eliminar`);

// Bloquear un usuario
export const bloquearUsuarioApi = (id) =>
  api.patch(`/api/usuarios/${id}/bloquear`);

// Desbloquear un usuario
export const desbloquearUsuarioApi = (id) =>
  api.patch(`/api/usuarios/${id}/desbloquear`);

// Reactivar un usuario eliminado
export const reactivarUsuarioApi = (id) =>
  api.patch(`/api/usuarios/${id}/reactivar`);
