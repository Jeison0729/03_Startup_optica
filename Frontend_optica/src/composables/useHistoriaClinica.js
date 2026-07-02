// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import { obtenerHistoriaClinicaApi } from "../api/historia.api";

// COMPOSABLE DE HISTORIA CLÍNICA
export function useHistoriaClinica() {
  // ESTADO REACTIVO
  const historia = ref(null);
  const cargando = ref(false);
  const error = ref("");

  // Obtiene la historia clínica de un paciente
  async function cargarHistoriaClinica(idPaciente) {
    if (!idPaciente) {
      error.value = "ID de paciente no proporcionado.";
      return null;
    }

    cargando.value = true;
    error.value = "";
    historia.value = null;

    try {
      const { data } = await obtenerHistoriaClinicaApi(idPaciente);
      historia.value = data;
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        error.value = "Paciente no encontrado.";
      } else {
        error.value = "Error al cargar la historia clínica.";
      }
      console.error("Error cargando historia clínica:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  // Limpiar los datos
  function limpiar() {
    historia.value = null;
    error.value = "";
  }

  // RETORNO
  return {
    historia,
    cargando,
    error,
    cargarHistoriaClinica,
    limpiar,
  };
}
