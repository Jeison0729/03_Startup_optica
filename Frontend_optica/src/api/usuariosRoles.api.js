import api from "./axios";

// Cambiar rol de un usuario
export const cambiarRolApi = (idUsuario, idRolNuevo) =>
  api.patch(`/api/usuarios-roles/${idUsuario}/rol`, { idRolNuevo });
