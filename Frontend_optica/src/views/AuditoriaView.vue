<script setup>
// ─── DEPENDENCIAS E IMPORTACIONES ──────────────────────
import { onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import UiTable from "../components/shared/UiTable.vue";
import UiModal from "../components/shared/UiModal.vue";
import UiFiltros from "../components/shared/UiFiltros.vue";
import { useAuditoria } from "../composables/useAuditoria";
import {
  columnas,
  acciones,
  filtrosSelects,
} from "../components/auditoria/auditoria.config";

// ─── COMPOSABLES ─────────────────────────────────────────
const {
  logs,
  logsFiltrados,
  cargando,
  error,
  filtroAccion,
  filtroResultado,
  busqueda,
  accionesDisponibles,
  getAccionClass,
  getResultadoLabel,
  getResultadoClass,
  cargarLogs,
  limpiarFiltros,
} = useAuditoria();

const route = useRoute();

// ─── CONFIGURACIÓN UI (PASANDO FUNCIONES) ──────────────
const columnasConfig = columnas(
  getAccionClass,
  getResultadoLabel,
  getResultadoClass,
);
const filtrosConfig = computed(() =>
  filtrosSelects(accionesDisponibles, filtroAccion, filtroResultado),
);

// ─── FUNCIONES ────────────────────────────────────────────
function onFiltrosChange({ texto, selects }) {
  busqueda.value = texto;
  if (selects && selects.length >= 2) {
    filtroAccion.value = selects[0]?.valorSeleccionado ?? "";
    filtroResultado.value = selects[1]?.valorSeleccionado ?? "";
  }
}

function onAccion() {}

// ─── CICLO DE VIDA ───────────────────────────────────────
onMounted(cargarLogs);

watch(
  () => route.path,
  () => cargarLogs(),
);
</script>

<template>
  <div class="gestion-wrapper">
    <!-- CABECERA -->
    <div class="gestion-header">
      <div>
        <h2 class="gestion-title">Logs de Auditoría</h2>
        <p class="gestion-subtitle">
          Registro completo de acciones del sistema.
        </p>
      </div>
      <button class="gestion-btn-actualizar" @click="cargarLogs">
        <i class="bi bi-arrow-clockwise"></i>
        Actualizar
      </button>
    </div>

    <!-- MODAL DE ERROR -->
    <UiModal
      v-if="error"
      tipo="error"
      :mensaje="error"
      texto-confirmar="Entendido"
      @confirmar="error = ''"
      @cerrar="error = ''"
    />

    <!-- SPINNER -->
    <div v-if="cargando" class="gestion-spinner-wrapper">
      <div class="gestion-spinner"></div>
      <p class="gestion-spinner-text">Cargando logs...</p>
    </div>

    <!-- CONTENIDO -->
    <div v-if="!cargando" class="gestion-contenido-scroll">
      <UiFiltros
        placeholder-busqueda="Buscar..."
        :selects="filtrosConfig"
        :contador="`${logsFiltrados.length} de ${logs.length} registros`"
        @filtros-change="onFiltrosChange"
        @limpiar-filtros="limpiarFiltros"
      />

      <UiTable
        :columnas="columnasConfig"
        :datos="logsFiltrados"
        :acciones="acciones"
        :items-por-pagina="5"
        texto-vacio="No hay logs que coincidan con los filtros."
        @accion-click="onAccion"
      />
    </div>
  </div>
</template>
