// FUNCIÓN PARA CREAR OBJETO DE SESIÓN
export function crearSesion({ token, usuario, roles } = {}) {
  return {
    token: token ?? null,
    usuario: usuario ?? null,
    roles: roles ?? "",
  };
}
