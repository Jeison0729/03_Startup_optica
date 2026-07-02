// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import {
  listarPacientesApi,
  obtenerPacienteApi,
  crearPacienteApi,
  actualizarPacienteApi,
  cambiarEstadoPacienteApi,
} from "../api/pacientes.api";

// COMPOSABLE DE PACIENTES
export function usePacientes() {
  // ESTADO REACTIVO
  const pacientes = ref([]);
  const totalRegistros = ref(0);
  const cargando = ref(false);
  const error = ref("");
  const mensaje = ref("");

  // FILTROS
  const nombreCompleto = ref("");
  const numeroDocumento = ref("");
  const idEstado = ref("");
  const pagina = ref(0);
  const tamanioPagina = ref(10);

  // FILTROS LOCALES
  const busquedaTexto = ref("");
  const filtroEstadoId = ref("");

  // FUNCIONES
  // NORMALIZAR TEXTO
  function normalizar(texto) {
    return (
      texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || ""
    );
  }

  //  PACIENTES FILTRADOS EN FRONTEND
  const pacientesFiltrados = computed(() => {
    let resultado = [...pacientes.value];

    if (filtroEstadoId.value) {
      const estadoSeleccionado = null;
      resultado = resultado.filter((p) => p.estado?.toLowerCase() === "activo");
    }

    if (busquedaTexto.value.trim()) {
      const busqueda = normalizar(busquedaTexto.value);
      resultado = resultado.filter((p) => {
        const nombre = normalizar(p.nombreCompleto);
        const documento = normalizar(p.numeroDocumento);
        return nombre.includes(busqueda) || documento.includes(busqueda);
      });
    }

    return resultado;
  });

  // Carga lista de pacientes con filtros
  async function cargarPacientes() {
    cargando.value = true;
    error.value = "";
    try {
      const params = {
        page: pagina.value,
        size: tamanioPagina.value,
      };
      if (nombreCompleto.value.trim())
        params.nombreCompleto = nombreCompleto.value.trim();
      if (numeroDocumento.value.trim())
        params.numeroDocumento = numeroDocumento.value.trim();
      if (idEstado.value) params.idEstado = idEstado.value;

      const { data } = await listarPacientesApi(params);
      pacientes.value = data?.content ?? [];
      totalRegistros.value = data?.totalElements ?? 0;
    } catch (err) {
      if (err.response?.status === 204) {
        pacientes.value = [];
        totalRegistros.value = 0;
      } else {
        error.value = "Error al cargar pacientes.";
      }
    } finally {
      cargando.value = false;
    }
  }

  // Obtiene un paciente por ID
  async function obtenerPaciente(id) {
    try {
      const { data } = await obtenerPacienteApi(id);
      return data;
    } catch {
      error.value = "Error al obtener el paciente.";
      return null;
    }
  }

  // Crea un nuevo paciente
  async function crearPaciente(payload) {
    try {
      await crearPacienteApi(payload);
      mensaje.value = `Paciente ${payload.nombreCompleto} registrado correctamente.`;
      await cargarPacientes();
      return true;
    } catch (err) {
      return err.response?.status === 409
        ? "El número de documento ya está registrado."
        : "Error al registrar el paciente.";
    }
  }

  // Actualiza un paciente existente
  async function actualizarPaciente(id, payload) {
    try {
      await actualizarPacienteApi(id, payload);
      mensaje.value = `Paciente ${payload.nombreCompleto} actualizado correctamente.`;
      await cargarPacientes();
      return true;
    } catch (err) {
      return err.response?.status === 409
        ? "El número de documento ya está registrado en otro paciente."
        : "Error al actualizar el paciente.";
    }
  }

  // Cambia el estado de un paciente
  async function cambiarEstado(id, idEstadoNuevo, nombre) {
    try {
      await cambiarEstadoPacienteApi(id, idEstadoNuevo);
      mensaje.value = `Estado de ${nombre} actualizado correctamente.`;
      await cargarPacientes();
    } catch {
      error.value = "Error al cambiar el estado del paciente.";
    }
  }

  // Limpia todos los filtros
  function limpiarFiltros() {
    nombreCompleto.value = "";
    numeroDocumento.value = "";
    idEstado.value = "";
    pagina.value = 0;
    busquedaTexto.value = "";
    filtroEstadoId.value = "";
    cargarPacientes();
  }

  // RETORNO
  return {
    pacientes,
    pacientesFiltrados,
    totalRegistros,
    cargando,
    error,
    mensaje,
    nombreCompleto,
    numeroDocumento,
    idEstado,
    pagina,
    tamanioPagina,
    busquedaTexto,
    filtroEstadoId,
    cargarPacientes,
    obtenerPaciente,
    crearPaciente,
    actualizarPaciente,
    cambiarEstado,
    limpiarFiltros,
  };
}
