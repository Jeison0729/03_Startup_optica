// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// COMPOSABLE DE CONFIRMACIÓN
export function useConfirmacion() {
  // ESTADO REACTIVO
  const mostrarConfirmacion = ref(false);
  const mensajeConfirmacion = ref("");
  let accionPendiente = null;

  // FUNCIONES

  // Muestra modal de confirmación y guarda la acción pendiente
  function confirmarAccion(msg, accion) {
    mensajeConfirmacion.value = msg;
    accionPendiente = accion;
    mostrarConfirmacion.value = true;
  }

  // Ejecuta la acción pendiente y cierra el modal
  function ejecutarAccion() {
    if (accionPendiente) accionPendiente();
    cerrarConfirmacion();
  }

  // Cierra el modal sin ejecutar acción
  function cerrarConfirmacion() {
    mostrarConfirmacion.value = false;
    accionPendiente = null;
    mensajeConfirmacion.value = "";
  }

  // RETORNO
  return {
    mostrarConfirmacion,
    mensajeConfirmacion,
    confirmarAccion,
    ejecutarAccion,
    cerrarConfirmacion,
  };
}
