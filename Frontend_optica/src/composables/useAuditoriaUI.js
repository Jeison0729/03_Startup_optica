// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// COMPOSABLE DE UI PARA AUDITORÍA
export function useAuditoriaUI() {
  // ─── MODAL DE ERROR ──────────────────────────────
  const mostrarError = ref(false);
  const mensajeError = ref("");

  function abrirError(mensaje) {
    mensajeError.value = mensaje;
    mostrarError.value = true;
  }

  function cerrarError() {
    mostrarError.value = false;
    mensajeError.value = "";
  }

  // ─── HANDLERS ──────────────────────────────────────
  function manejarFiltros({ texto, selects, context }) {
    const { busqueda, filtroAccion, filtroResultado } = context;

    busqueda.value = texto;
    if (selects && selects.length >= 2) {
      filtroAccion.value = selects[0]?.valorSeleccionado ?? "";
      filtroResultado.value = selects[1]?.valorSeleccionado ?? "";
    }
  }

  // ─── RETORNO ──────────────────────────────────────
  return {
    mostrarError,
    mensajeError,
    abrirError,
    cerrarError,
    manejarFiltros,
  };
}
