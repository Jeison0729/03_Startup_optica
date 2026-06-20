// DEPENDENCIAS E IMPORTACIONES
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store.js";

// VISTAS
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import ConsultasView from "../views/ConsultasView.vue";
import PacientesView from "../views/PacientesView.vue";
import SolicitudesView from "../views/SolicitudesView.vue";
import UsuariosView from "../views/UsuariosView.vue";
import AuditoriaView from "../views/AuditoriaView.vue";
import RecuperarContrasenaView from "../views/RecuperarContrasenaView.vue";
import RestablecerContrasenaView from "../views/RestablecerContrasenaView.vue";

// CONFIGURACIÓN DE RUTAS
const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/recuperar-contrasena",
    name: "RecuperarContrasena",
    component: RecuperarContrasenaView,
    meta: { requiresGuest: true },
  },
  {
    path: "/restablecer-contrasena/:token?",
    name: "RestablecerContrasena",
    component: RestablecerContrasenaView,
    meta: { requiresGuest: true },
  },
  {
    path: "/",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/consultas",
    name: "Consultas",
    component: ConsultasView,
    meta: { requiresAuth: true },
  },
  {
    path: "/pacientes",
    name: "Pacientes",
    component: PacientesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/solicitudes",
    name: "Solicitudes",
    component: SolicitudesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    component: UsuariosView,
    meta: { requiresAuth: true },
  },
  {
    path: "/auditoria",
    name: "Auditoria",
    component: AuditoriaView,
    meta: { requiresAuth: true },
  },
];

// CREACIÓN DEL ROUTER
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ─── GUARDIA DE NAVEGACIÓN ───
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = !!auth.token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
