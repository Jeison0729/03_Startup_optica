// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardResumenApi } from "../api/dashboard.api";

export function useDashboard() {
  const auth = useAuthStore();
  const cargando = ref(true);
  const error = ref("");

  // ─── DETERMINAR ROL ──────────────────────────────────────
  const esDev = computed(
    () => auth.roles?.includes("ROLE_DEV") || auth.rol === "ROLE_DEV",
  );

  const esAdmin = computed(
    () => auth.roles?.includes("ROLE_ADMIN") || auth.rol === "ROLE_ADMIN",
  );

  // ─── KPIS ──────────────────────────────────────────────
  const totalPacientesActivos = ref(0);
  const totalPacientesInactivos = ref(0);
  const consultasFinalizadas = ref(0);
  const consultasHoy = ref(0);
  const consultasBorrador = ref(0);
  const consultasEnProceso = ref(0);
  const consultasAnuladas = ref(0);
  const pacientesEsteMes = ref(0);

  const totalUsuarios = ref(0);
  const usuariosBloqueados = ref(0);
  const solicitudesPendientes = ref(0);
  const logsHoy = ref(0);

  const consultasPorDia = ref({ labels: [], datasets: [] });
  const ultimasActividades = ref([]);

  const totalPacientes = computed(
    () => totalPacientesActivos.value + totalPacientesInactivos.value,
  );

  // ─── KPIS SEGÚN ROL ────────────────────────────────────
  const kpisVisibles = computed(() => {
    // ✅ TODOS ven pacientes y consultas
    const base = [
      {
        id: "pacientes",
        title: "Pacientes",
        value: totalPacientes.value,
        icon: "bi-people-fill",
        type: "primary",
        ruta: "/pacientes",
      },
      {
        id: "consultas",
        title: "Consultas Ok",
        value: consultasFinalizadas.value,
        icon: "bi-check-circle-fill",
        type: "success",
        ruta: "/consultas",
      },
    ];

    // ADMIN y DEV ven usuarios y solicitudes
    if (esDev.value || esAdmin.value) {
      base.push(
        {
          id: "usuarios",
          title: "Usuarios",
          value: totalUsuarios.value,
          icon: "bi-person-badge-fill",
          type: "info",
          ruta: "/usuarios",
        },
        {
          id: "solicitudes",
          title: "Solicitudes",
          value: solicitudesPendientes.value,
          icon: "bi-envelope-paper-fill",
          type: "warning",
          ruta: "/solicitudes",
        },
      );
    }

    //   SOLO DEV ve logs
    if (esDev.value) {
      base.push({
        id: "logs",
        title: "Logs",
        value: logsHoy.value,
        icon: "bi-journal-text",
        type: "secondary",
        ruta: "/auditoria",
      });
    }

    return base;
  });

  async function cargarDashboard(periodo = "semana") {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await getDashboardResumenApi({ periodo });

      // ─── TODOS LOS DATOS ──────────────────────────────────
      totalPacientesActivos.value = data.totalPacientesActivos ?? 0;
      totalPacientesInactivos.value = data.totalPacientesInactivos ?? 0;
      consultasFinalizadas.value = data.consultasFinalizadas ?? 0;
      consultasHoy.value = data.consultasHoy ?? 0;
      consultasBorrador.value = data.consultasBorrador ?? 0;
      consultasEnProceso.value = data.consultasEnProceso ?? 0;
      consultasAnuladas.value = data.consultasAnuladas ?? 0;
      pacientesEsteMes.value = data.pacientesEsteMes ?? 0;

      // ─── DATOS DE SISTEMA (llegan para todos, pero se filtran por rol) ──
      totalUsuarios.value = data.totalUsuarios ?? 0;
      usuariosBloqueados.value = data.usuariosBloqueados ?? 0;
      solicitudesPendientes.value = data.solicitudesPendientes ?? 0;
      logsHoy.value = data.logsHoy ?? 0; // ← AHORA SÍ SE GUARDA

      // ─── GRÁFICA Y ACTIVIDADES ──────────────────────────
      consultasPorDia.value = data.consultasPorDia || {
        labels: [],
        datasets: [],
      };
      ultimasActividades.value = data.ultimasActividades || [];
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
    esAdmin,
    totalPacientes,
    totalPacientesActivos,
    totalPacientesInactivos,
    consultasFinalizadas,
    consultasHoy,
    consultasBorrador,
    consultasEnProceso,
    consultasAnuladas,
    pacientesEsteMes,
    totalUsuarios,
    usuariosBloqueados,
    solicitudesPendientes,
    logsHoy,
    consultasPorDia,
    ultimasActividades,
    kpisVisibles,
    cargarDashboard,
  };
}
