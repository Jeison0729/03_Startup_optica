// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

export function usePacientesUI() {
  // ─── HANDLERS ──────────────────────────────────────────
  function manejarAccion({ accion, fila, context }) {
    const { router, abrirEdicion, confirmarAccion, cambiarEstado, catalogos } =
      context;

    if (accion === "historia") {
      router.push(`/pacientes/${fila.id}/historia-clinica`);
      return;
    }

    if (accion === "editar") {
      abrirEdicion(fila);
      return;
    }

    if (accion === "inactivar") {
      const idInactivo = catalogos.idPorNombre(
        catalogos.estadosPaciente.value,
        "Inactivo",
      );
      return confirmarAccion(
        `¿Desea cambiar a ${fila.nombreCompleto} a estado Inactivo?`,
        () => cambiarEstado(fila.id, idInactivo, fila.nombreCompleto),
      );
    }

    if (accion === "activar") {
      const idActivo = catalogos.idPorNombre(
        catalogos.estadosPaciente.value,
        "Activo",
      );
      return confirmarAccion(
        `¿Desea cambiar a ${fila.nombreCompleto} a estado Activo?`,
        () => cambiarEstado(fila.id, idActivo, fila.nombreCompleto),
      );
    }
  }

  function manejarFiltros({ texto, selects, context }) {
    const { busquedaTexto, filtroEstadoId } = context;

    busquedaTexto.value = texto || "";
    filtroEstadoId.value = selects?.[0]?.valorSeleccionado || "";
  }

  return {
    manejarAccion,
    manejarFiltros,
  };
}
