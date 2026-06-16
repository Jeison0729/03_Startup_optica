// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { loginApi } from "../api/auth.api";

// COMPOSABLE DE AUTENTICACIÓN
export function useAuth() {
  // INICIALIZACIÓN
  const router = useRouter();
  const auth = useAuthStore();

  // ESTADO REACTIVO
  const cargando = ref(false);
  const error = ref("");

  // FUNCIONES

  // Limpia el mensaje de error
  function limpiarError() {
    error.value = "";
  }

  // Inicia sesión de usuario
  async function login(correoElectronico, contrasena, recordarme) {
    error.value = "";
    cargando.value = true;

    try {
      const { data } = await loginApi(correoElectronico, contrasena);
      auth.guardarSesion(data.token, data.usuario, data.roles, data.id);

      // Guarda o elimina el "recordar usuario" según la opción
      if (recordarme) {
        localStorage.setItem("recordar_usuario", correoElectronico);
      } else {
        localStorage.removeItem("recordar_usuario");
      }

      router.push("/dashboard");
      return true;
    } catch (err) {
      const status = err.response?.status;
      if (status === 423) {
        error.value = "Tu cuenta está bloqueada. Contacta al administrador.";
      } else if (status === 401 || status === 403) {
        error.value =
          "Las credenciales son incorrectas. Verifica tu correo y contraseña.";
      } else {
        error.value =
          "Error al intentar ingresar. Por favor, intente más tarde.";
      }
      return false;
    } finally {
      cargando.value = false;
    }
  }

  // Cierra sesión
  function logout() {
    auth.logout();
    router.push("/login");
  }

  // RETORNO
  return { cargando, error, login, logout, limpiarError };
}
