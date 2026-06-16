// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardStatsApi } from "../api/dashboard.api";
import { listarLogsApi } from "../api/auditoria.api";

// COMPOSABLE DE DASHBOARD
export function useDashboard() {
  // INICIALIZACIÓN
  const auth = useAuthStore();
  const cargando = ref(true);

  // COMPUTADOS
  const esDev = computed(() => auth.rol === "ROLE_DEV");

  // ESTADO REACTIVO
  const kpis = ref({
    totalPacientes: 0,
    consultasMes: 0,
    solicitudesPendientes: 0,
    usuariosBloqueados: 0,
  });

  const ultimasConsultas = ref([]);
  const logsRecientes = ref([]);
  const distribucionMateriales = ref([]);

  // FUNCIONES

  // Inicializa el dashboard cargando todos los datos
  const inicializarDashboard = async () => {
    cargando.value = true;
    try {
      const { data } = await getDashboardStatsApi(esDev.value);

      kpis.value = data.kpis || kpis.value;
      ultimasConsultas.value = data.ultimasConsultas || [];
      distribucionMateriales.value = data.materiales || [];

      // Solo para desarrolladores: carga logs recientes
      if (esDev.value) {
        const { data: logs } = await listarLogsApi();
        logsRecientes.value = (logs.content || []).slice(0, 5);
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      cargando.value = false;
    }
  };

  // RETORNO
  return {
    auth,
    cargando,
    esDev,
    kpis,
    ultimasConsultas,
    logsRecientes,
    distribucionMateriales,
    inicializarDashboard,
  };
}
