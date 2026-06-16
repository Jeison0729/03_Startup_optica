// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import {
  crearAcompananteApi,
  obtenerAcompananteApi,
  actualizarAcompananteApi,
} from "../api/acompanantes.api";

// COMPOSABLE DE ACOMPAÑANTES
export function useAcompanantes() {
  // ESTADO REACTIVO
  const error = ref("");

  // FUNCIONES

  // Crea un nuevo acompañante
  async function crearAcompanante(payload) {
    try {
      const { data } = await crearAcompananteApi(payload);
      return data;
    } catch {
      error.value = "Error al registrar el acompañante.";
      return null;
    }
  }

  // Obtiene un acompañante por ID
  async function obtenerAcompanante(id) {
    try {
      const { data } = await obtenerAcompananteApi(id);
      return data;
    } catch {
      return null;
    }
  }

  // Actualiza un acompañante existente
  async function actualizarAcompanante(id, payload) {
    try {
      await actualizarAcompananteApi(id, payload);
      return true;
    } catch {
      error.value = "Error al actualizar el acompañante.";
      return false;
    }
  }

  // RETORNO
  return { error, crearAcompanante, obtenerAcompanante, actualizarAcompanante };
}
