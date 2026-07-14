import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardResumenApi } from "../api/dashboard.api";

export function useDashboard() {
  const auth = useAuthStore();
  const cargando = ref(true);
  const error = ref("");

  const esDev = computed(
    () => auth.roles?.includes("ROLE_DEV") || auth.rol === "ROLE_DEV",
  );

  // ─── KPIS ──────────────────────────────────────────────
  const consultasEnProceso = ref(0);
  const consultasBorrador = ref(0);
  const solicitudesPendientes = ref(0);
  const usuariosBloqueados = ref(0);

  const consultasPorDia = ref({ labels: [], datasets: [] });
  const ultimasActividades = ref([]);

  // ─── KPIS SEGÚN ROL ────────────────────────────────────
  const kpisVisibles = computed(() => {
    const base = [
      {
        id: "enProceso",
        title: "En proceso",
        value: consultasEnProceso.value,
        icon: "bi-hourglass-split",
        type: "warning",
        ruta: "/consultas",
      },
      {
        id: "borrador",
        title: "Borradores",
        value: consultasBorrador.value,
        icon: "bi-file-earmark-text",
        type: "secondary",
        ruta: "/consultas",
      },
      {
        id: "solicitudes",
        title: "Solicitudes pendientes",
        value: solicitudesPendientes.value,
        icon: "bi-envelope-paper-fill",
        type: "info",
        ruta: "/solicitudes",
      },
    ];

    if (esDev.value) {
      base.push({
        id: "bloqueados",
        title: "Usuarios bloqueados",
        value: usuariosBloqueados.value,
        icon: "bi-person-x-fill",
        type: "danger",
        ruta: "/usuarios",
      });
    }

    return base;
  });

  async function cargarDashboard(periodo = "semana") {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await getDashboardResumenApi({ periodo });

      consultasEnProceso.value = data.consultasEnProceso ?? 0;
      consultasBorrador.value = data.consultasBorrador ?? 0;
      solicitudesPendientes.value = data.solicitudesPendientes ?? 0;
      usuariosBloqueados.value = data.usuariosBloqueados ?? 0;

      const grafica = data.consultasPorDia;
      consultasPorDia.value = grafica?.labels?.length
        ? {
            labels: grafica.labels,
            datasets: [
              {
                label: "Consultas",
                data: grafica.data,
                backgroundColor: grafica.backgroundColors,
              },
            ],
          }
        : { labels: [], datasets: [] };

      ultimasActividades.value = data.ultimasActividades ?? [];
    } catch (err) {
      error.value = "Error al cargar el dashboard.";
      console.error(err);
    } finally {
      cargando.value = false;
    }
  }

  return {
    auth,
    cargando,
    error,
    esDev,
    consultasEnProceso,
    consultasBorrador,
    solicitudesPendientes,
    usuariosBloqueados,
    consultasPorDia,
    ultimasActividades,
    kpisVisibles,
    cargarDashboard,
  };
}
