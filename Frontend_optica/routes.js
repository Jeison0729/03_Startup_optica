// DEPENDENCIAS E IMPORTACIONES
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

// VISTAS
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

// CONFIGURACIÓN DE RUTAS
const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true }, // Solo usuarios NO logueados
  },
  {
    path: "/",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true }, // Solo usuarios logueados
  },
];

// CREACIÓN DEL ROUTER
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ─── GUARDIA DE NAVEGACIÓN (verifica permisos antes de cada ruta) ───
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = !!auth.token;

  // Si requiere autenticación y NO está logueado → va al login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  }
  // Si requiere invitado y SÍ está logueado → va al dashboard
  else if (to.meta.requiresGuest && isAuthenticated) {
    next("/");
  }
  // Todo ok → permite el acceso
  else {
    next();
  }
});

// EXPORTACIÓN
export default router;
