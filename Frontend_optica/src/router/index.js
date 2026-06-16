// DEPENDENCIAS E IMPORTACIONES
import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "../guards/auth.guard";
import MainLayout from "../layout/MainLayout.vue";

// CONFIGURACIÓN DE RUTAS
const routes = [
  // REDIRECCIÓN PRINCIPAL
  { path: "/", redirect: "/login" },

  // ─── RUTAS PÚBLICAS (sin autenticación) ──────────────
  { path: "/login", component: () => import("../views/LoginView.vue") },
  {
    path: "/recuperar-contrasena",
    component: () => import("../views/RecuperarContrasenaView.vue"),
  },
  {
    path: "/restablecer-contrasena",
    component: () => import("../views/RestablecerContrasenaView.vue"),
  },

  // ─── RUTAS PROTEGIDAS (con layout y guard) ────────────
  {
    path: "/",
    component: MainLayout,
    beforeEnter: authGuard,
    children: [
      // Dashboard (acceso todos los logueados)
      {
        path: "dashboard",
        component: () => import("../views/DashboardView.vue"),
      },
      // Pacientes (solo DEV y ADMIN)
      {
        path: "pacientes",
        component: () => import("../views/PacientesView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      // Consultas (solo DEV y ADMIN)
      {
        path: "consultas",
        component: () => import("../views/ConsultasView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      // Usuarios (solo DEV y ADMIN)
      {
        path: "usuarios",
        component: () => import("../views/UsuariosView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      // Solicitudes (solo DEV y ADMIN)
      {
        path: "solicitudes",
        component: () => import("../views/SolicitudesView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      // Auditoría (solo DEV)
      {
        path: "auditoria",
        component: () => import("../views/AuditoriaView.vue"),
        meta: { roles: ["ROLE_DEV"] },
      },
    ],
  },

  // ─── COMODÍN (captura rutas no encontradas) ────────────
  // Siempre debe ser la última ruta para evitar falsos positivos
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

// CREACIÓN DEL ROUTER
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// EXPORTACIÓN
export default router;
