// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// COMPOSABLE DE UI PARA CONSULTAS
export function useConsultasUI() {
  // ─── MODAL DE DETALLE ──────────────────────────────
  const mostrarDetalle = ref(false);
  const idConsultaDetalle = ref(null);

  function abrirDetalle(idConsulta) {
    idConsultaDetalle.value = idConsulta;
    mostrarDetalle.value = true;
  }

  function cerrarDetalle() {
    mostrarDetalle.value = false;
    idConsultaDetalle.value = null;
  }

  // ─── MODAL DE MEDICIONES ────────────────────────────
  const mostrarModalMediciones = ref(false);
  const idConsultaMediciones = ref(null);
  const modoEdicionMediciones = ref(false);
  const puedeEditarMediciones = ref(true);

  function abrirModalMediciones(
    idConsulta,
    tieneMedicion,
    consultasOriginales,
  ) {
    const consulta = consultasOriginales?.find((c) => c.id === idConsulta);
    const estado = consulta?.estado?.toLowerCase() || "";
    const estadoEditable = estado === "borrador" || estado === "en_proceso";

    idConsultaMediciones.value = idConsulta;
    modoEdicionMediciones.value = tieneMedicion;
    puedeEditarMediciones.value = estadoEditable;
    mostrarModalMediciones.value = true;
  }

  function cerrarModalMediciones() {
    mostrarModalMediciones.value = false;
    idConsultaMediciones.value = null;
    modoEdicionMediciones.value = false;
  }

  // ─── MODAL DE PREGUNTA MEDICIONES ────────────────────
  const mostrarPreguntaMediciones = ref(false);
  const consultaIdParaMediciones = ref(null);

  function preguntarPorMediciones(idConsulta, esEdicion = false) {
    if (esEdicion) {
      return true;
    }
    consultaIdParaMediciones.value = idConsulta;
    mostrarPreguntaMediciones.value = true;
    return false;
  }

  function cerrarPreguntaMediciones() {
    mostrarPreguntaMediciones.value = false;
    consultaIdParaMediciones.value = null;
  }

  // ─── MODAL DE ARCHIVOS ──────────────────────────────
  const mostrarModalArchivos = ref(false);
  const idConsultaArchivos = ref(null);

  function abrirModalArchivos(idConsulta) {
    idConsultaArchivos.value = idConsulta;
    mostrarModalArchivos.value = true;
  }

  function cerrarModalArchivos() {
    mostrarModalArchivos.value = false;
    idConsultaArchivos.value = null;
  }

  // ─── ID DE CONSULTA ACTUAL (para archivos en formulario) ──
  const idConsultaActual = ref(null);

  function actualizarIdConsulta(id) {
    idConsultaActual.value = id;
  }

  function limpiarIdConsulta() {
    idConsultaActual.value = null;
  }

  // ─── HANDLERS DE ACCIONES DE TABLA ────────────────────
  function manejarAccion({ accion, fila, context }) {
    const {
      abrirDetalle: openDetalle,
      abrirModalArchivos: openArchivos,
      abrirModalMediciones: openMediciones,
      actualizarIdConsulta: updateId,
      abrirEdicion: openEdicion,
      confirmarAccion: confirmar,
      cambiarEstado: changeEstado,
      catalogos: catalogs,
    } = context;

    if (accion === "ver") return openDetalle(fila.id);

    if (accion === "archivos") {
      openArchivos(fila.id);
      return;
    }

    if (accion === "mediciones") {
      openMediciones(fila.id, !!fila.idMedicion, context.consultas);
      return;
    }

    if (accion === "editar") {
      updateId(fila.id);
      return openEdicion(
        fila,
        fila.idPaciente,
        fila.numeroDocumento,
        fila.paciente,
      );
    }

    if (accion === "finalizar") {
      const idFinalizada = catalogs.idPorCodigo(
        catalogs.estadosConsulta.value,
        "FINALIZADA",
      );
      return confirmar(
        `¿Desea finalizar la consulta de ${fila.paciente}?`,
        async () => {
          await changeEstado(fila.id, idFinalizada);
        },
      );
    }

    if (accion === "anular") {
      const idAnulada = catalogs.idPorCodigo(
        catalogs.estadosConsulta.value,
        "ANULADA",
      );
      return confirmar(
        `¿Desea anular la consulta de ${fila.paciente}?`,
        async () => {
          await changeEstado(fila.id, idAnulada);
        },
      );
    }
  }

  // ─── HANDLER DE FILTROS ────────────────────────────────
  function manejarFiltros({ texto, selects, context }) {
    const { busquedaTexto, filtroEstado, filtroRango, aplicarFiltros } =
      context;

    busquedaTexto.value = texto || "";
    filtroEstado.value = selects?.[0]?.valorSeleccionado || "";
    filtroRango.value = selects?.[1]?.valorSeleccionado || "";
    aplicarFiltros();
  }

  // ─── HANDLER DE GUARDADO DE FORMULARIO ────────────────
  function manejarGuardarFormulario({
    guardar,
    preguntarMediciones,
    cargarConsultas,
    actualizarId,
  }) {
    guardar((idConsulta, esEdicion) => {
      actualizarId(idConsulta);
      const debePreguntar = preguntarMediciones(idConsulta, esEdicion);
      if (!debePreguntar) {
        cargarConsultas(false);
      }
    });
  }

  // ─── HANDLER DE GUARDADO DE MEDICIONES ────────────────
  function manejarGuardadoMediciones({ cerrarMediciones, cargarConsultas }) {
    cerrarMediciones();
    cargarConsultas(false);
  }

  // ─── CONFIGURACIÓN DE FILTROS UI ──────────────────────
  function obtenerFiltrosSelects(catalogos, filtroEstado, filtroRango) {
    const opcionesEstados = catalogos.estadosConsulta.value.map((e) => ({
      valor: String(e.id),
      texto: e.nombre,
    }));

    return [
      {
        nombre: "estado",
        placeholder: "Todos los estados",
        opciones: opcionesEstados,
        valorSeleccionado: filtroEstado.value,
      },
      {
        nombre: "rango",
        placeholder: "Todas las fechas",
        opciones: [
          { valor: "hoy", texto: "Hoy" },
          { valor: "semana", texto: "Última semana" },
          { valor: "mes", texto: "Último mes" },
        ],
        valorSeleccionado: filtroRango.value,
      },
    ];
  }

  // ─── RETORNO ──────────────────────────────────────────
  return {
    // Detalle
    mostrarDetalle,
    idConsultaDetalle,
    abrirDetalle,
    cerrarDetalle,

    // Mediciones
    mostrarModalMediciones,
    idConsultaMediciones,
    modoEdicionMediciones,
    puedeEditarMediciones,
    abrirModalMediciones,
    cerrarModalMediciones,

    // Pregunta
    mostrarPreguntaMediciones,
    consultaIdParaMediciones,
    preguntarPorMediciones,
    cerrarPreguntaMediciones,

    // Archivos
    mostrarModalArchivos,
    idConsultaArchivos,
    abrirModalArchivos,
    cerrarModalArchivos,

    // ID de consulta actual
    idConsultaActual,
    actualizarIdConsulta,
    limpiarIdConsulta,

    // Handlers
    manejarAccion,
    manejarFiltros,
    manejarGuardarFormulario,
    manejarGuardadoMediciones,

    // Configuración
    obtenerFiltrosSelects,
  };
}
