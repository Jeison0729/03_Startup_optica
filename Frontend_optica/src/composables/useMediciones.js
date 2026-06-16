// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import {
  crearMedicionApi,
  buscarMedicionPorConsultaApi,
  obtenerMedicionApi,
  actualizarMedicionApi,
} from "../api/mediciones.api";

// COMPOSABLE DE MEDICIONES
export function useMediciones() {
  // ESTADO REACTIVO
  const medicion = ref(null);
  const cargando = ref(false);
  const error = ref("");
  const mensaje = ref("");

  // FUNCIONES

  // Crea una nueva medición
  async function crearMedicion(payload) {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await crearMedicionApi(payload);
      medicion.value = data;
      mensaje.value = "Medición registrada correctamente.";
      return data;
    } catch (err) {
      if (err.response?.status === 409) {
        error.value = "Esta consulta ya tiene una medición registrada.";
      } else {
        error.value = "Error al crear la medición.";
      }
      return null;
    } finally {
      cargando.value = false;
    }
  }

  // Busca medición por ID de consulta
  async function buscarPorConsulta(idConsulta) {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await buscarMedicionPorConsultaApi(idConsulta);
      medicion.value = data;
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        medicion.value = null;
        return null;
      }
      error.value = "Error al buscar la medición.";
      return null;
    } finally {
      cargando.value = false;
    }
  }

  // Actualiza una medición existente
  async function actualizarMedicion(id, payload) {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await actualizarMedicionApi(id, payload);
      medicion.value = data;
      mensaje.value = "Medición actualizada correctamente.";
      return true;
    } catch {
      error.value = "Error al actualizar la medición.";
      return false;
    } finally {
      cargando.value = false;
    }
  }

  // Limpia los datos de medición
  function limpiar() {
    medicion.value = null;
    error.value = "";
    mensaje.value = "";
  }

  // RETORNO
  return {
    medicion,
    cargando,
    error,
    mensaje,
    crearMedicion,
    buscarPorConsulta,
    actualizarMedicion,
    limpiar,
  };
}
