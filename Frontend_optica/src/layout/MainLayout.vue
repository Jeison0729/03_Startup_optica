<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import UiNavbar from "../components/shared/UiNavbar.vue";
import UiSidebar from "../components/shared/UiSidebar.vue";

// INICIALIZACIÓN
const auth = useAuthStore();
const router = useRouter();

// ESTADO REACTIVO
const colapsado = ref(false);

// FUNCIONES

// Alterna el estado del sidebar (colapsado/expandido)
function toggleSidebar() {
  colapsado.value = !colapsado.value;
}

// Maneja acciones del navbar
function manejarAccion(accion) {
  if (accion === "logout") {
    auth.logout();
    router.push("/login");
  }
}

// CONFIGURACIÓN

// Botones del navbar
const botonesNavbar = [
  {
    texto: "Salir",
    icono: "bi-box-arrow-right",
    accion: "logout",
    clase: "btn-logout-custom",
  },
];

// Enlaces del sidebar con sus roles permitidos
const links = [
  {
    roles: [],
    ruta: "/dashboard",
    icono: "bi-house-door-fill",
    texto: "Dashboard",
  },
  {
    roles: ["ROLE_DEV", "ROLE_ADMIN"],
    ruta: "/pacientes",
    icono: "bi-person-vcard-fill",
    texto: "Pacientes",
  },
  {
    roles: ["ROLE_DEV", "ROLE_ADMIN"],
    ruta: "/consultas",
    icono: "bi-clipboard2-pulse-fill",
    texto: "Consultas",
  },
  {
    roles: ["ROLE_DEV", "ROLE_ADMIN"],
    ruta: "/usuarios",
    icono: "bi-people-fill",
    texto: "Usuarios",
  },
  {
    roles: ["ROLE_DEV", "ROLE_ADMIN"],
    ruta: "/solicitudes",
    icono: "bi-envelope-paper-fill",
    texto: "Solicitudes",
  },
  {
    roles: ["ROLE_DEV"],
    ruta: "/auditoria",
    icono: "bi-search",
    texto: "Auditoría",
  },
];
</script>

<template>
  <!-- ESTRUCTURA PRINCIPAL DEL LAYOUT -->
  <div class="main-wrapper">
    <!-- SIDEBAR LATERAL -->
    <UiSidebar
      titulo-app="Óptica"
      :links="links"
      :colapsado="colapsado"
      :rol-usuario="auth.rol"
      @toggle="toggleSidebar"
    />

    <!-- CONTENIDO PRINCIPAL -->
    <div class="content-container" :class="{ collapsed: colapsado }">
      <!-- NAVBAR SUPERIOR -->
      <UiNavbar
        titulo="Óptica"
        :usuario="auth.usuario"
        :rol="auth.rol"
        :botones="botonesNavbar"
        @accion-boton="manejarAccion"
      />

      <!-- CONTENIDO DE LA PÁGINA (VISTA ACTUAL) -->
      <main class="main-page-content">
        <router-view />
      </main>

      <!-- FOOTER -->
      <footer class="app-footer">
        <span>
          © 2026
          <strong>Óptica</strong>
          · Todos los derechos reservados
        </span>
        <span>v1.0.0</span>
      </footer>
    </div>
  </div>
</template>
