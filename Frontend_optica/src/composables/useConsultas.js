// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import {
  listarConsultasApi,
  obtenerConsultaApi,
  crearConsultaApi,
  actualizarConsultaApi,
  cambiarEstadoConsultaApi,
} from "../api/consultas.api";

// COMPOSABLE DE CONSULTAS
export function useConsultas() {
  // ESTADO REACTIVO
  const consultas = ref([]);
  const totalRegistros = ref(0);
  const cargando = ref(false);
  const error = ref("");
  const mensaje = ref("");

  // FILTROS
  const idPaciente = ref("");
  const filtroEstado = ref("");
  const filtroRango = ref("");
  const pagina = ref(0);
  const tamanioPagina = ref(10);

  // FUNCIONES

  // Calcula rango de fechas según el filtro seleccionado
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

  // Carga lista de consultas con filtros
  async function cargarConsultas() {
    cargando.value = true;
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
    } catch (err) {
      if (err.response?.status === 204) {
        consultas.value = [];
        totalRegistros.value = 0;
      } else {
        error.value = "Error al cargar consultas.";
      }
    } finally {
      cargando.value = false;
    }
  }

  // Obtiene una consulta por ID
  async function obtenerConsulta(id) {
    try {
      const { data } = await obtenerConsultaApi(id);
      return data;
    } catch {
      error.value = "Error al obtener la consulta.";
      return null;
    }
  }

  // Crea una nueva consulta
  async function crearConsulta(payload) {
    try {
      const { data } = await crearConsultaApi(payload);
      return data;
    } catch {
      error.value = "Error al crear la consulta.";
      return null;
    }
  }

  // Actualiza una consulta existente
  async function actualizarConsulta(id, payload) {
    try {
      await actualizarConsultaApi(id, payload);
      mensaje.value = "Consulta actualizada correctamente.";
      await cargarConsultas();
      return true;
    } catch {
      return "Error al actualizar la consulta.";
    }
  }

  // Cambia el estado de una consulta
  async function cambiarEstado(id, idEstadoNuevo) {
    try {
      await cambiarEstadoConsultaApi(id, { idEstado: idEstadoNuevo });
      mensaje.value = "Estado de la consulta actualizado.";
      await cargarConsultas();
    } catch {
      error.value = "Error al cambiar el estado de la consulta.";
    }
  }

  // Limpia todos los filtros y recarga
  function limpiarFiltros() {
    idPaciente.value = "";
    filtroEstado.value = "";
    filtroRango.value = "";
    pagina.value = 0;
    cargarConsultas();
  }

  // RETORNO
  return {
    consultas,
    totalRegistros,
    cargando,
    error,
    mensaje,
    idPaciente,
    filtroEstado,
    filtroRango,
    pagina,
    tamanioPagina,
    cargarConsultas,
    obtenerConsulta,
    crearConsulta,
    actualizarConsulta,
    cambiarEstado,
    limpiarFiltros,
  };
}
