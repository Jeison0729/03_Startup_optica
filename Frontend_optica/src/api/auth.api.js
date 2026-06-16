import api from "./axios";

// Autenticación de usuario
export const loginApi = (correoElectronico, contrasena) =>
  api.post("/auth/login", { correoElectronico, contrasena });
