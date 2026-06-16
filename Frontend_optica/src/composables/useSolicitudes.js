// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import {
  recuperarApi,
  restablecerApi,
  listarPendientesApi,
  listarTodasApi,
  aprobarSolicitudApi,
  reenviarSolicitudApi,
} from "../api/solicitudes.api";

// COMPOSABLE DE SOLICITUDES
export function useSolicitudes() {
  // ESTADO REACTIVO
  const cargando = ref(false);
  const error = ref("");
  const mensaje = ref("");
  const solicitudes = ref([]);
  const vistaActual = ref("pendientes"); // "pendientes" | "historial"
  const codigoGenerado = ref("");
  const usuarioAprobado = ref("");

  // FUNCIONES

  // Limpia errores y mensajes
  function limpiar() {
    error.value = "";
    mensaje.value = "";
  }

  // COLUMNAS BASE
  const columnasBase = [
    { titulo: "Usuario", valor: (s) => s.nombreUsuario },
    { titulo: "Correo", valor: (s) => s.correoUsuario },
    {
      titulo: "Fecha Solicitud",
      valor: (s) => new Date(s.fechaSolicitud).toLocaleString(),
    },
  ];

  // Obtiene etiqueta del estado
  function getEstadoLabel(estado) {
    const labels = {
      1: "Pendiente",
      2: "Aprobada",
      3: "Usada",
      4: "Expirada",
      5: "Correo fallido",
    };
    return labels[estado] || "Desconocido";
  }

  // Obtiene clase CSS del estado
  function getEstadoClass(estado) {
    const classes = {
      1: "warning",
      2: "success",
      3: "secondary",
      4: "secondary",
      5: "danger",
    };
    return classes[estado] || "secondary";
  }

  // COLUMNAS PARA HISTORIAL
  const columnasHistorial = [
    ...columnasBase,
    {
      titulo: "Fecha Uso",
      valor: (s) => (s.fechaUso ? new Date(s.fechaUso).toLocaleString() : "—"),
    },
    { titulo: "Código", valor: (s) => s.codigo, tipo: "codigo" },
    {
      titulo: "Estado",
      valor: (s) => getEstadoLabel(s.estado),
      tipo: "badge",
      badgeClass: (s) => getEstadoClass(s.estado),
    },
  ];

  // COLUMNAS PARA PENDIENTES
  const columnasPendientes = [
    ...columnasBase,
    {
      titulo: "Estado",
      valor: (s) => getEstadoLabel(s.estado),
      tipo: "badge",
      badgeClass: (s) => getEstadoClass(s.estado),
    },
  ];

  // COMPUTADOS: Columnas según vista
  const columnas = computed(() =>
    vistaActual.value === "historial" ? columnasHistorial : columnasPendientes,
  );

  // ACCIONES DISPONIBLES
  const acciones = [
    {
      id: "aprobar",
      icono: "bi-check-circle-fill",
      tooltip: "Aprobar",
      clase: "success",
      visible: (s) => s.estado === 1,
    },
    {
      id: "reenviar",
      icono: "bi-envelope-fill",
      tooltip: "Reenviar",
      clase: "warning",
      visible: (s) => s.estado === 5,
    },
  ];

  // Solicita recuperación de contraseña
  async function solicitarRecuperacion(correoOUsuario) {
    error.value = "";
    mensaje.value = "";
    cargando.value = true;
    try {
      const { data } = await recuperarApi(correoOUsuario);
      mensaje.value = data.mensaje;
      return true;
    } catch (err) {
      const status = err.response?.status;
      const msgBack = err.response?.data?.error || "";
      if (status === 409) {
        error.value = "Ya tienes una solicitud pendiente.";
      } else if (msgBack.includes("LIMITE")) {
        error.value =
          "Has superado el límite de solicitudes. Intenta en 1 hora.";
      } else {
        error.value = "No se pudo procesar la solicitud.";
      }
      return false;
    } finally {
      cargando.value = false;
    }
  }

  // Restablece la contraseña con código
  async function restablecerContrasena(
    correoOUsuario,
    codigo,
    nuevaContrasena,
  ) {
    error.value = "";
    mensaje.value = "";
    cargando.value = true;
    try {
      const { data } = await restablecerApi(
        correoOUsuario,
        codigo,
        nuevaContrasena,
      );
      mensaje.value = data.mensaje;
      return true;
    } catch (err) {
      const msgBack = err.response?.data?.error || "";
      if (msgBack.includes("EXPIRADO")) {
        error.value = "El código ha expirado. Solicita uno nuevo.";
      } else {
        error.value = "Código inválido o ya utilizado.";
      }
      return false;
    } finally {
      cargando.value = false;
    }
  }

  // Lista solicitudes pendientes
  async function listarPendientes() {
    cargando.value = true;
    try {
      const { data } = await listarPendientesApi();
      return data ?? [];
    } catch {
      error.value = "No se pudieron cargar las solicitudes pendientes.";
      return [];
    } finally {
      cargando.value = false;
    }
  }

  // Lista todas las solicitudes
  async function listarTodas() {
    cargando.value = true;
    try {
      const { data } = await listarTodasApi();
      return data ?? [];
    } catch {
      error.value = "No se pudo cargar el historial.";
      return [];
    } finally {
      cargando.value = false;
    }
  }

  // Aprueba una solicitud
  async function aprobar(id) {
    try {
      const { data } = await aprobarSolicitudApi(id);
      return data;
    } catch {
      error.value = "No se pudo aprobar la solicitud.";
      return null;
    }
  }

  // Reenvía código de solicitud
  async function reenviar(id) {
    try {
      const { data } = await reenviarSolicitudApi(id);
      return data;
    } catch {
      error.value = "No se pudo reenviar el código.";
      return null;
    }
  }

  // Carga solicitudes según vista actual
  async function cargar() {
    cargando.value = true;
    error.value = "";
    try {
      const lista =
        vistaActual.value === "historial"
          ? await listarTodas()
          : await listarPendientes();
      solicitudes.value = lista;
    } finally {
      cargando.value = false;
    }
  }

  // Cambia la vista activa
  function cambiarVista(vista) {
    vistaActual.value = vista;
    cargar();
  }

  // Aprueba solicitud y muestra código generado
  async function aprobarSolicitud(id) {
    const data = await aprobar(id);
    if (data) {
      codigoGenerado.value = data.codigo;
      usuarioAprobado.value = data.usuario;
      mensaje.value = data.mensaje;
      await cargar();
    }
  }

  // Reenvía solicitud
  async function reenviarSolicitud(id, nombre) {
    const data = await reenviar(id);
    if (data) {
      mensaje.value = data.mensaje || `Código reenviado a ${nombre}.`;
      await cargar();
    }
  }

  // Cierra modal de éxito
  function cerrarExito() {
    mensaje.value = "";
    codigoGenerado.value = "";
  }

  // RETORNO
  return {
    cargando,
    error,
    mensaje,
    limpiar,
    solicitudes,
    vistaActual,
    columnas,
    acciones,
    codigoGenerado,
    usuarioAprobado,
    solicitarRecuperacion,
    restablecerContrasena,
    listarPendientes,
    listarTodas,
    aprobar,
    reenviar,
    cargar,
    cambiarVista,
    aprobarSolicitud,
    reenviarSolicitud,
    cerrarExito,
  };
}
