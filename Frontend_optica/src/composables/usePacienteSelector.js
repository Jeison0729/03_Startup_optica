// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import { listarPacientesApi } from "../api/pacientes.api";

// COMPOSABLE DE SELECTOR DE PACIENTES
export function usePacienteSelector() {
  // ESTADO REACTIVO
  const pacientesDisponibles = ref([]);
  const cargandoPacientes = ref(false);

  // BÚSQUEDA EN FORMULARIO DE CONSULTA
  const busquedaDocumento = ref("");
  const busquedaNombre = ref("");
  const pacienteSeleccionado = ref(null);

  // FUNCIONES

  // Carga pacientes activos
  async function cargarPacientesActivos() {
    cargandoPacientes.value = true;
    try {
      const { data } = await listarPacientesApi({ size: 1000, idEstado: 1 });
      pacientesDisponibles.value = data?.content ?? [];
    } catch {
      pacientesDisponibles.value = [];
    } finally {
      cargandoPacientes.value = false;
    }
  }

  // Busca por documento y autocompleta nombre
  function buscarPorDocumento() {
    if (!busquedaDocumento.value.trim()) return null;
    const encontrado = pacientesDisponibles.value.find(
      (p) => p.numeroDocumento === busquedaDocumento.value.trim(),
    );
    if (encontrado) {
      pacienteSeleccionado.value = encontrado;
      busquedaNombre.value = encontrado.nombreCompleto;
      return encontrado.id;
    }
    return null;
  }

  // Busca por nombre y autocompleta documento
  function buscarPorNombre() {
    if (!busquedaNombre.value.trim()) return null;
    const encontrado = pacientesDisponibles.value.find(
      (p) =>
        p.nombreCompleto?.toLowerCase() === busquedaNombre.value.toLowerCase(),
    );
    if (encontrado) {
      pacienteSeleccionado.value = encontrado;
      busquedaDocumento.value = encontrado.numeroDocumento;
      return encontrado.id;
    }
    return null;
  }

  // Limpia la búsqueda
  function limpiarBusqueda() {
    busquedaDocumento.value = "";
    busquedaNombre.value = "";
    pacienteSeleccionado.value = null;
  }

  // COMPUTADOS

  // Pacientes filtrados para el select (por nombre)
  const pacientesFiltrados = computed(() => {
    const texto = busquedaNombre.value.trim().toLowerCase();
    if (!texto) return pacientesDisponibles.value;
    return pacientesDisponibles.value.filter(
      (p) =>
        p.nombreCompleto?.toLowerCase().includes(texto) ||
        p.numeroDocumento?.toLowerCase().includes(texto),
    );
  });

  // Opciones para select
  const opcionesPaciente = computed(() =>
    pacientesFiltrados.value.map((p) => ({
      valor: p.id,
      texto: `${p.numeroDocumento} - ${p.nombreCompleto}`,
    })),
  );

  // RETORNO
  return {
    pacientesDisponibles,
    cargandoPacientes,
    busquedaDocumento,
    busquedaNombre,
    pacienteSeleccionado,
    pacientesFiltrados,
    opcionesPaciente,
    cargarPacientesActivos,
    buscarPorDocumento,
    buscarPorNombre,
    limpiarBusqueda,
  };
}
