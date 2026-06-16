// DEPENDENCIAS E IMPORTACIONES
import { useAuthStore } from "../stores/auth.store";

// GUARD DE NAVEGACIÓN PARA RUTAS
export function authGuard(to) {
  // INICIALIZACIÓN
  const auth = useAuthStore();

  // RUTAS PÚBLICAS (sin autenticación)
  const rutasPublicas = [
    "/login",
    "/recuperar-contrasena",
    "/restablecer-contrasena",
  ];

  // Si es ruta pública, permite el acceso
  if (rutasPublicas.includes(to.path)) {
    return true;
  }

  // 1. No logueado → redirigir a login
  if (!auth.isLoggedIn) {
    return "/login";
  }

  // Obtiene roles permitidos de la ruta
  const rolesPermitidos = to.meta.roles || [];

  // 2. DEV siempre tiene acceso (permiso total)
  if (auth.rol === "ROLE_DEV") return true;

  // 3. Ruta sin restricción de roles → cualquier logueado pasa
  if (rolesPermitidos.length === 0) return true;

  // 4. Verificar rol si la ruta tiene restricciones
  if (!rolesPermitidos.includes(auth.rol)) {
    // Redirección según rol del usuario
    const redireccion = {
      ROLE_ADMIN: "/dashboard",
    };
    return redireccion[auth.rol] ?? "/login";
  }

  // Acceso permitido
  return true;
}
