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
      {
        path: "dashboard",
        component: () => import("../views/DashboardView.vue"),
      },
      {
        path: "pacientes",
        component: () => import("../views/PacientesView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      // ─── HISTORIA CLÍNICA (protegida, SIN layout) ────────
      {
        path: "/pacientes/:id/historia-clinica",
        name: "HistoriaClinica",
        component: () => import("../views/HistoriaClinicaView.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "consultas",
        component: () => import("../views/ConsultasView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      {
        path: "usuarios",
        component: () => import("../views/UsuariosView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      {
        path: "solicitudes",
        component: () => import("../views/SolicitudesView.vue"),
        meta: { roles: ["ROLE_DEV", "ROLE_ADMIN"] },
      },
      {
        path: "auditoria",
        component: () => import("../views/AuditoriaView.vue"),
        meta: { roles: ["ROLE_DEV"] },
      },
    ],
  },

  // ─── COMODÍN ────────────────────────────────────────────
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
