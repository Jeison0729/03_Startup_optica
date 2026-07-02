<script setup>
// ─── DEPENDENCIAS E IMPORTACIONES ──────────────────────
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import UiTable from "../components/shared/UiTable.vue";
import UiModal from "../components/shared/UiModal.vue";
import UiFormModal from "../components/shared/UiFormModal.vue";
import UiFiltros from "../components/shared/UiFiltros.vue";
import { usePacientes } from "../composables/usePacientes";
import { usePacienteForm } from "../composables/usePacienteForm";
import { usePacientesUI } from "../composables/usePacientesUI";
import { useCatalogos } from "../composables/useCatalogos";
import { useConfirmacion } from "../composables/useConfirmacion";
import {
  columnas,
  acciones,
  obtenerFiltrosSelects,
} from "../components/pacientes/pacientes.config";

// ─── INICIALIZACIÓN ──────────────────────────────────────
const router = useRouter();
const catalogos = useCatalogos();

// ─── COMPOSABLES ─────────────────────────────────────────
const {
  pacientesFiltrados,
  cargando,
  error,
  mensaje,
  cargarPacientes,
  cambiarEstado,
  limpiarFiltros,
  busquedaTexto,
  filtroEstadoId,
} = usePacientes();

const {
  mostrarFormulario,
  pacienteEditando,
  errorFormulario,
  camposFormulario,
  form,
  abrirFormulario,
  abrirEdicion,
  cerrarFormulario,
  guardar,
} = usePacienteForm(
  catalogos,
  usePacientes().crearPaciente,
  usePacientes().actualizarPaciente,
);

const {
  mostrarConfirmacion,
  mensajeConfirmacion,
  confirmarAccion,
  ejecutarAccion,
  cerrarConfirmacion,
} = useConfirmacion();

const { manejarAccion, manejarFiltros } = usePacientesUI();

// ─── CONFIGURACIÓN UI ────────────────────────────────────
const filtrosSelects = computed(() =>
  obtenerFiltrosSelects(catalogos, filtroEstadoId),
);

// ─── CONTEXTOS PARA HANDLERS ─────────────────────────────
const context = {
  router,
  abrirEdicion,
  confirmarAccion,
  cambiarEstado,
  catalogos,
  busquedaTexto,
  filtroEstadoId,
};

// ─── WRAPPERS ─────────────────────────────────────────────
function onAccionWrapper({ accion, fila }) {
  manejarAccion({ accion, fila, context });
}

function onFiltrosChangeWrapper({ texto, selects }) {
  manejarFiltros({ texto, selects, context });
}

function onActualizar() {
  cargarPacientes();
}

function onNuevo() {
  abrirFormulario();
}

// ─── CICLO DE VIDA ───────────────────────────────────────
onMounted(async () => {
  await catalogos.cargarCatalogosPaciente();
  await cargarPacientes();
});
</script>

<template>
  <div class="gestion-wrapper">
    <!-- CABECERA -->
    <div class="gestion-header">
      <div>
        <h2 class="gestion-title">Gestión de Pacientes</h2>
        <p class="gestion-subtitle">Administra el registro de pacientes.</p>
      </div>
      <div class="gestion-header-actions">
        <button class="gestion-btn-actualizar" @click="onActualizar">
          <i class="bi bi-arrow-clockwise"></i>
          Actualizar
        </button>
        <button class="gestion-btn-nuevo" @click="onNuevo">
          <i class="bi bi-plus-lg"></i>
          Nuevo Paciente
        </button>
      </div>
    </div>

    <!-- MODALES -->
    <UiFormModal
      v-if="mostrarFormulario"
      :titulo="pacienteEditando ? 'Editar Paciente' : 'Nuevo Paciente'"
      :campos="camposFormulario"
      :datos="form"
      :texto-guardar="
        pacienteEditando ? 'Guardar cambios' : 'Registrar paciente'
      "
      :icono-guardar="pacienteEditando ? 'bi-pencil-fill' : 'bi-plus-lg'"
      :error="errorFormulario"
      @guardar="guardar"
      @cancelar="cerrarFormulario"
    />

    <UiModal
      v-if="mensaje"
      tipo="success"
      :mensaje="mensaje"
      texto-confirmar="Aceptar"
      @confirmar="mensaje = ''"
      @cerrar="mensaje = ''"
    />

    <UiModal
      v-if="error"
      tipo="error"
      :mensaje="error"
      texto-confirmar="Entendido"
      @confirmar="error = ''"
      @cerrar="error = ''"
    />

    <UiFormModal
      v-if="mostrarConfirmacion"
      titulo="Confirmar Acción"
      :campos="[]"
      :datos="{}"
      :mensaje="mensajeConfirmacion"
      texto-guardar="Sí, confirmar"
      icono-guardar="bi-check-lg"
      texto-cancelar="Cancelar"
      @guardar="ejecutarAccion"
      @cancelar="cerrarConfirmacion"
    />

    <!-- SPINNER -->
    <div v-if="cargando" class="gestion-spinner-wrapper">
      <div class="gestion-spinner"></div>
      <p class="gestion-spinner-text">Cargando pacientes...</p>
    </div>

    <!-- CONTENIDO -->
    <div v-if="!cargando" class="gestion-contenido-scroll">
      <UiFiltros
        placeholder-busqueda="Buscar..."
        :selects="filtrosSelects"
        :contador="`${pacientesFiltrados.length} registros`"
        @filtros-change="onFiltrosChangeWrapper"
        @limpiar-filtros="limpiarFiltros"
      />

      <UiTable
        :columnas="columnas"
        :datos="pacientesFiltrados"
        :acciones="acciones"
        :items-por-pagina="6"
        texto-vacio="No hay pacientes registrados."
        @accion-click="onAccionWrapper"
      />
    </div>
  </div>
</template>
