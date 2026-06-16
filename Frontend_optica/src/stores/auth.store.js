// DEPENDENCIAS E IMPORTACIONES
import { defineStore } from "pinia";
import { ref, computed } from "vue";

// STORE DE AUTENTICACIÓN
export const useAuthStore = defineStore("auth", () => {
  // ESTADO REACTIVO (desde localStorage)
  const token = ref(localStorage.getItem("token") || null);
  const usuario = ref(localStorage.getItem("usuario") || null);
  const idUsuario = ref(Number(localStorage.getItem("idUsuario")) || null);
  const rol = ref(localStorage.getItem("rol") || null);

  // COMPUTADOS
  const isLoggedIn = computed(() => !!token.value);
  const isDev = computed(() => rol.value === "ROLE_DEV");
  const isAdmin = computed(() => rol.value === "ROLE_ADMIN");

  // FUNCIONES

  // Guarda la sesión en el store y localStorage
  function guardarSesion(nuevoToken, nuevoUsuario, roles, nuevoId) {
    const rolPrincipal = roles.split(",")[0].trim();
    token.value = nuevoToken;
    usuario.value = nuevoUsuario;
    idUsuario.value = nuevoId;
    rol.value = rolPrincipal;
    localStorage.setItem("token", nuevoToken);
    localStorage.setItem("usuario", nuevoUsuario);
    localStorage.setItem("idUsuario", String(nuevoId));
    localStorage.setItem("rol", rolPrincipal);
  }

  // Cierra sesión (limpia store y localStorage)
  function logout() {
    token.value = null;
    usuario.value = null;
    idUsuario.value = null;
    rol.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("rol");
  }

  // RETORNO
  return {
    token,
    usuario,
    idUsuario,
    rol,
    isLoggedIn,
    isDev,
    isAdmin,
    guardarSesion,
    logout,
  };
});
