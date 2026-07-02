// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import {
  listarConsultasApi,
  obtenerConsultaApi,
  crearConsultaApi,
  actualizarConsultaApi,
  cambiarEstadoConsultaApi,
} from "../api/consultas.api";

// COMPOSABLE DE CONSULTAS
export function useConsultas() {
  // ─── ESTADO REACTIVO ──────────────────────────────
  const consultas = ref([]);
  const consultasFiltradas = ref([]); // ← NUEVO
  const totalRegistros = ref(0);
  const cargando = ref(false);
  const error = ref("");
  const mensaje = ref("");

  // ─── FILTROS ────────────────────────────────────────
  const idPaciente = ref("");
  const filtroEstado = ref("");
  const filtroRango = ref("");
  const busquedaTexto = ref(""); // ← NUEVO
  const pagina = ref(0);
  const tamanioPagina = ref(10);

  // ─── CATÁLOGOS (inyectados desde vista) ────────────
  let catalogos = null;

  function setCatalogos(cat) {
    catalogos = cat;
  }

  // ─── NORMALIZAR TEXTO ──────────────────────────────
  function normalizar(texto) {
    return (
      texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u0301]/g, "") || ""
    );
  }

  // ─── APLICAR FILTROS ────────────────────────────────
  function aplicarFiltros() {
    let resultado = [...consultas.value];

    // Filtrar por estado
    if (filtroEstado.value && catalogos?.estadosConsulta.value.length > 0) {
      const estadoSeleccionado = catalogos.estadosConsulta.value.find(
        (e) => String(e.id) === filtroEstado.value,
      );
      if (estadoSeleccionado) {
        resultado = resultado.filter(
          (c) =>
            c.estado?.toLowerCase() ===
            estadoSeleccionado.codigo?.toLowerCase(),
        );
      }
    }

    // Filtrar por rango de fechas
    if (filtroRango.value) {
      const ahora = new Date();
      let desde;
      if (filtroRango.value === "hoy") {
        desde = new Date(
          ahora.getFullYear(),
          ahora.getMonth(),
          ahora.getDate(),
        );
      } else if (filtroRango.value === "semana") {
        desde = new Date(ahora);
        desde.setDate(ahora.getDate() - 7);
      } else if (filtroRango.value === "mes") {
        desde = new Date(ahora);
        desde.setMonth(ahora.getMonth() - 1);
      }
      if (desde) {
        resultado = resultado.filter((c) => new Date(c.fechaConsulta) >= desde);
      }
    }

    // Filtrar por búsqueda (nombre del paciente)
    if (busquedaTexto.value.trim()) {
      const busqueda = normalizar(busquedaTexto.value);
      resultado = resultado.filter((c) =>
        normalizar(c.paciente).includes(busqueda),
      );
    }

    consultasFiltradas.value = resultado;
  }

  // ─── CARGAR CONSULTAS ──────────────────────────────
  async function cargarConsultas(mostrarSpinner = true) {
    if (mostrarSpinner) cargando.value = true;
    error.value = "";
    try {
      const params = {
        page: pagina.value,
        size: tamanioPagina.value,
        sort: "fechaConsulta,desc",
      };
      if (idPaciente.value) params.idPaciente = idPaciente.value;
      if (filtroEstado.value) params.idEstado = filtroEstado.value;

      const rango = calcularRangoFechas();
      if (rango.desde) params.desde = rango.desde;
      if (rango.hasta) params.hasta = rango.hasta;

      const { data } = await listarConsultasApi(params);

      consultas.value = data?.content ?? [];
      totalRegistros.value = data?.totalElements ?? 0;
      aplicarFiltros(); // ← NUEVO: aplicar filtros después de cargar
    } catch (err) {
      if (err.response?.status === 204) {
        consultas.value = [];
        consultasFiltradas.value = [];
        totalRegistros.value = 0;
      } else {
        error.value = "Error al cargar consultas.";
      }
    } finally {
      if (mostrarSpinner) cargando.value = false;
    }
  }

  // ─── CALCULAR RANGO ──────────────────────────────────
  function calcularRangoFechas() {
    if (!filtroRango.value) return {};
    const ahora = new Date();
    let desdeFecha;
    if (filtroRango.value === "hoy") {
      desdeFecha = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate(),
      );
    } else if (filtroRango.value === "semana") {
      desdeFecha = new Date(ahora);
      desdeFecha.setDate(ahora.getDate() - 7);
    } else if (filtroRango.value === "mes") {
      desdeFecha = new Date(ahora);
      desdeFecha.setMonth(ahora.getMonth() - 1);
    }
    return { desde: desdeFecha?.toISOString(), hasta: ahora.toISOString() };
  }

  // ─── LIMPIAR FILTROS ──────────────────────────────────
  function limpiarFiltros() {
    idPaciente.value = "";
    filtroEstado.value = "";
    filtroRango.value = "";
    busquedaTexto.value = "";
    pagina.value = 0;
    cargarConsultas();
  }

  // ─── CRUD ─────────────────────────────────────────────
  async function obtenerConsulta(id) {
    try {
      const { data } = await obtenerConsultaApi(id);
      return data;
    } catch {
      error.value = "Error al obtener la consulta.";
      return null;
    }
  }

  async function crearConsulta(payload) {
    try {
      const { data } = await crearConsultaApi(payload);
      return data;
    } catch {
      error.value = "Error al crear la consulta.";
      return null;
    }
  }

  async function actualizarConsulta(id, payload) {
    try {
      await actualizarConsultaApi(id, payload);
      mensaje.value = "Consulta actualizada correctamente.";
      await cargarConsultas(false);
      return true;
    } catch {
      return "Error al actualizar la consulta.";
    }
  }

  async function cambiarEstado(id, idEstadoNuevo) {
    try {
      await cambiarEstadoConsultaApi(id, { idEstado: idEstadoNuevo });
      mensaje.value = "Estado de la consulta actualizado.";
      await cargarConsultas(false);
    } catch {
      error.value = "Error al cambiar el estado de la consulta.";
    }
  }

  // ─── RETORNO ──────────────────────────────────────────
  return {
    // Estado
    consultas,
    consultasFiltradas, // ← NUEVO
    totalRegistros,
    cargando,
    error,
    mensaje,
    // Filtros
    idPaciente,
    filtroEstado,
    filtroRango,
    busquedaTexto, // ← NUEVO
    pagina,
    tamanioPagina,
    // Métodos
    setCatalogos,
    cargarConsultas,
    aplicarFiltros, // ← NUEVO
    obtenerConsulta,
    crearConsulta,
    actualizarConsulta,
    cambiarEstado,
    limpiarFiltros,
  };
}
