<script setup>
// ─── DEPENDENCIAS E IMPORTACIONES ──────────────────────
import { onMounted, watch, computed } from "vue"; // ← AGREGAR computed
import { useRoute } from "vue-router";
import UiTable from "../components/shared/UiTable.vue";
import UiFiltros from "../components/shared/UiFiltros.vue";
import ConsultasHeader from "../components/consultas/ConsultasHeader.vue";
import ConsultasModales from "../components/consultas/ConsultasModales.vue";
import {
  columnas,
  acciones,
  obtenerFiltrosSelects,
} from "../components/consultas/consultas.config";
import { useConsultas } from "../composables/useConsultas";
import { useConsultaForm } from "../composables/useConsultaForm";
import { usePacienteSelector } from "../composables/usePacienteSelector";
import { useCatalogos } from "../composables/useCatalogos";
import { useConfirmacion } from "../composables/useConfirmacion";
import { useAcompanantes } from "../composables/useAcompanantes";
import { useConsultasUI } from "../composables/useConsultasUI";

// ─── INICIALIZACIÓN ──────────────────────────────────────
const route = useRoute();
const catalogos = useCatalogos();
const pacienteSelector = usePacienteSelector();
const { crearAcompanante } = useAcompanantes();

// ─── COMPOSABLES ─────────────────────────────────────────
const {
  consultas,
  consultasFiltradas,
  cargando,
  error,
  mensaje,
  cargarConsultas,
  cambiarEstado,
  aplicarFiltros,
  limpiarFiltros,
  setCatalogos,
  filtroEstado,
  filtroRango,
  busquedaTexto,
} = useConsultas();

setCatalogos(catalogos);

const {
  mostrarFormulario,
  consultaEditando,
  errorFormulario,
  camposFormulario,
  form,
  incluyeAcompanante,
  abrirFormulario,
  abrirEdicion,
  cerrarFormulario,
  guardar,
} = useConsultaForm(
  catalogos,
  pacienteSelector,
  useConsultas().crearConsulta,
  useConsultas().actualizarConsulta,
  crearAcompanante,
);

const {
  mostrarConfirmacion,
  mensajeConfirmacion,
  confirmarAccion,
  ejecutarAccion,
  cerrarConfirmacion,
} = useConfirmacion();

const {
  mostrarDetalle,
  idConsultaDetalle,
  abrirDetalle,
  cerrarDetalle,
  mostrarModalMediciones,
  idConsultaMediciones,
  modoEdicionMediciones,
  puedeEditarMediciones,
  abrirModalMediciones,
  cerrarModalMediciones,
  mostrarPreguntaMediciones,
  consultaIdParaMediciones,
  preguntarPorMediciones,
  cerrarPreguntaMediciones,
  mostrarModalArchivos,
  idConsultaArchivos,
  abrirModalArchivos,
  cerrarModalArchivos,
  idConsultaActual,
  actualizarIdConsulta,
  manejarAccion,
  manejarFiltros,
  manejarGuardarFormulario,
  manejarGuardadoMediciones,
} = useConsultasUI();

// ─── ✅ FILTROS UI (COMPUTADO PARA QUE SE ACTUALICE CUANDO CARGUEN LOS CATÁLOGOS) ──
const filtrosSelects = computed(() =>
  obtenerFiltrosSelects(catalogos, filtroEstado, filtroRango),
);

// ─── FUNCIONES DEL HEADER ───────────────────────────────
function onActualizar() {
  cargarConsultas();
}

function onNuevo() {
  actualizarIdConsulta(null);
  abrirFormulario();
}

// ─── CONTEXTOS PARA HANDLERS ─────────────────────────────
const context = {
  abrirDetalle,
  abrirModalArchivos,
  abrirModalMediciones,
  actualizarIdConsulta,
  abrirEdicion,
  confirmarAccion,
  cambiarEstado,
  catalogos,
  consultas: consultas.value,
  busquedaTexto,
  filtroEstado,
  filtroRango,
  aplicarFiltros,
  preguntarPorMediciones,
  cargarConsultas,
  cerrarModalMediciones,
};

// ─── WRAPPERS PARA TEMPLATE ─────────────────────────────
function onAccionWrapper({ accion, fila }) {
  manejarAccion({ accion, fila, context });
}

function onFiltrosChangeWrapper({ texto, selects }) {
  manejarFiltros({ texto, selects, context });
}

function onGuardarWrapper() {
  manejarGuardarFormulario({
    guardar,
    preguntarMediciones: preguntarPorMediciones,
    cargarConsultas,
    actualizarId: actualizarIdConsulta,
  });
}

function onGuardadoMedicionesWrapper() {
  manejarGuardadoMediciones({
    cerrarMediciones: cerrarModalMediciones,
    cargarConsultas,
  });
}

// ─── CICLO DE VIDA ──────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    catalogos.cargarEstadosConsulta(),
    catalogos.cargarParentescos(),
    catalogos.cargarMateriales(),
    catalogos.cargarTiposLente(),
    pacienteSelector.cargarPacientesActivos(),
  ]);
  await cargarConsultas();
});

watch(
  () => route.path,
  async () => {
    await cargarConsultas();
  },
);
</script>

<template>
  <div class="gestion-wrapper">
    <ConsultasHeader :onActualizar="onActualizar" :onNuevo="onNuevo" />

    <!-- MODALES -->
    <ConsultasModales
      v-model:incluye-acompanante="incluyeAcompanante"
      :mostrar-formulario="mostrarFormulario"
      :consulta-editando="consultaEditando"
      :error-formulario="errorFormulario"
      :campos-formulario="camposFormulario"
      :form="form"
      :id-consulta-actual="idConsultaActual"
      :mensaje="mensaje"
      :error="error"
      :mostrar-confirmacion="mostrarConfirmacion"
      :mensaje-confirmacion="mensajeConfirmacion"
      :mostrar-pregunta-mediciones="mostrarPreguntaMediciones"
      :consulta-id-para-mediciones="consultaIdParaMediciones"
      :mostrar-detalle="mostrarDetalle"
      :id-consulta-detalle="idConsultaDetalle"
      :mostrar-modal-mediciones="mostrarModalMediciones"
      :id-consulta-mediciones="idConsultaMediciones"
      :modo-edicion-mediciones="modoEdicionMediciones"
      :puede-editar-mediciones="puedeEditarMediciones"
      :mostrar-modal-archivos="mostrarModalArchivos"
      :id-consulta-archivos="idConsultaArchivos"
      @guardar-formulario="onGuardarWrapper"
      @cancelar-formulario="cerrarFormulario"
      @confirmar-mensaje="mensaje = ''"
      @confirmar-error="error = ''"
      @ejecutar-confirmacion="ejecutarAccion"
      @cancelar-confirmacion="cerrarConfirmacion"
      @cerrar-confirmacion="cerrarConfirmacion"
      @cerrar-pregunta-mediciones="cerrarPreguntaMediciones"
      @cerrar-detalle="cerrarDetalle"
      @cerrar-modal-mediciones="cerrarModalMediciones"
      @guardado-mediciones="onGuardadoMedicionesWrapper"
      @cerrar-modal-archivos="cerrarModalArchivos"
      @archivo-subido="cargarConsultas(false)"
      @archivo-eliminado="cargarConsultas(false)"
    />

    <!-- SPINNER -->
    <div v-if="cargando" class="gestion-spinner-wrapper">
      <div class="gestion-spinner"></div>
      <p class="gestion-spinner-text">Cargando consultas...</p>
    </div>

    <!-- CONTENIDO -->
    <div v-if="!cargando" class="gestion-contenido-scroll">
      <UiFiltros
        placeholder-busqueda="Buscar..."
        :selects="filtrosSelects"
        :contador="`${consultasFiltradas.length} registros`"
        @filtros-change="onFiltrosChangeWrapper"
        @limpiar-filtros="limpiarFiltros"
      />

      <UiTable
        :columnas="columnas"
        :datos="consultasFiltradas"
        :acciones="acciones"
        :items-por-pagina="5"
        texto-vacio="No hay consultas registradas."
        @accion-click="onAccionWrapper"
      />
    </div>
  </div>
</template>
