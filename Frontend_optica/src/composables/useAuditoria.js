// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import { listarLogsApi } from "../api/auditoria.api";

// CONSTANTES
const ACCIONES_DISPONIBLES = [
  "LOGIN_OK",
  "LOGIN_FALLIDO",
  "CUENTA_BLOQUEADA",
  "CUENTA_DESBLOQUEADA",
  "USUARIO_CREADO",
  "USUARIO_ACTUALIZADO",
  "USUARIO_DESACTIVADO",
  "USUARIO_REACTIVADO",
  "ROL_ASIGNADO",
  "ROL_REMOVIDO",
  "SOLICITUD_CREADA",
  "SOLICITUD_APROBADA",
  "CODIGO_USADO",
  "CODIGO_EXPIRADO",
  "PACIENTE_CREADO",
  "PACIENTE_ACTUALIZADO",
  "PACIENTE_ESTADO_CAMBIADO",
  "CONSULTA_CREADA",
  "CONSULTA_ACTUALIZADA",
  "CONSULTA_FINALIZADA",
  "CONSULTA_ANULADA",
  "ACOMPANANTE_CREADO",
  "ACOMPANANTE_ACTUALIZADO",
  "ACOMPANANTE_ELIMINADO",
  "MEDICION_CREADA",
  "MEDICION_ACTUALIZADA",
  "ARCHIVO_SUBIDO",
  "ARCHIVO_ELIMINADO",
  "ARCHIVO_ACTUALIZADO",
];

const ACCION_CLASES = {
  LOGIN_OK: "success",
  LOGIN_FALLIDO: "danger",
  CUENTA_BLOQUEADA: "danger",
  CUENTA_DESBLOQUEADA: "success",
  USUARIO_CREADO: "success",
  USUARIO_ACTUALIZADO: "primary",
  USUARIO_DESACTIVADO: "danger",
  USUARIO_REACTIVADO: "success",
  ROL_ASIGNADO: "info",
  ROL_REMOVIDO: "warning",
  SOLICITUD_CREADA: "info",
  SOLICITUD_APROBADA: "success",
  CODIGO_USADO: "success",
  CODIGO_EXPIRADO: "secondary",
  CONSULTA_CREADA: "success",
  CONSULTA_ACTUALIZADA: "primary",
  CONSULTA_FINALIZADA: "success",
  CONSULTA_ANULADA: "danger",
  PACIENTE_CREADO: "success",
  PACIENTE_ACTUALIZADO: "primary",
  PACIENTE_ESTADO_CAMBIADO: "warning",
  MEDICION_CREADA: "success",
  MEDICION_ACTUALIZADA: "primary",
};

// COMPOSABLE DE AUDITORÍA
export function useAuditoria() {
  // ESTADO REACTIVO
  const logs = ref([]);
  const cargando = ref(false);
  const error = ref("");
  const filtroAccion = ref("");
  const filtroResultado = ref("");
  const busqueda = ref("");
  const totalRegistros = ref(0);

  // FUNCIONES DE UTILERÍA

  // Obtiene la clase CSS según la acción
  function getAccionClass(accion) {
    return ACCION_CLASES[accion] || "primary";
  }

  // Obtiene etiqueta legible del resultado
  function getResultadoLabel(resultado) {
    return resultado === 1 ? "Éxito" : "Fallo";
  }

  // Obtiene clase CSS según el resultado
  function getResultadoClass(resultado) {
    return resultado === 1 ? "success" : "danger";
  }

  // COMPUTADOS: Logs filtrados
  const logsFiltrados = computed(() => {
    const texto = busqueda.value.trim().toLowerCase();
    return logs.value.filter((log) => {
      const matchAccion =
        !filtroAccion.value || log.accion === filtroAccion.value;
      const matchResultado =
        !filtroResultado.value ||
        log.resultado?.toString() === filtroResultado.value;
      const matchTexto =
        !texto ||
        log.usuarioNombre?.toLowerCase().includes(texto) ||
        log.detalle?.toLowerCase().includes(texto) ||
        log.ip?.toLowerCase().includes(texto);
      return matchAccion && matchResultado && matchTexto;
    });
  });

  // CARGA LOS LOGS DESDE LA API
  async function cargarLogs() {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await listarLogsApi({ size: 100 });
      logs.value = data?.content ?? [];
      totalRegistros.value = data?.totalElements ?? logs.value.length;
    } catch (err) {
      if (err.response?.status === 204) {
        logs.value = [];
        totalRegistros.value = 0;
      } else {
        error.value = "Error al cargar logs.";
      }
    } finally {
      cargando.value = false;
    }
  }

  // LIMPIA LOS FILTROS
  function limpiarFiltros() {
    filtroAccion.value = "";
    filtroResultado.value = "";
    busqueda.value = "";
  }

  // RETORNO
  return {
    logs,
    logsFiltrados,
    cargando,
    error,
    filtroAccion,
    filtroResultado,
    busqueda,
    totalRegistros,
    accionesDisponibles: ACCIONES_DISPONIBLES,
    getAccionClass,
    getResultadoLabel,
    getResultadoClass,
    cargarLogs,
    limpiarFiltros,
  };
}
