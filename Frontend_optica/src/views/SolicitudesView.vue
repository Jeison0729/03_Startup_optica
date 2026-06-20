<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { useRoute } from "vue-router";
import { onMounted, ref, computed, watch } from "vue";
import UiTable from "../components/shared/UiTable.vue";
import UiModal from "../components/shared/UiModal.vue";
import UiFiltros from "../components/shared/UiFiltros.vue";
import { useSolicitudes } from "../composables/useSolicitudes";

// INICIALIZACIÓN
const route = useRoute();

const {
  cargando,
  error,
  mensaje,
  solicitudes,
  vistaActual,
  columnas,
  acciones,
  codigoGenerado,
  usuarioAprobado,
  cargar,
  cambiarVista,
  aprobarSolicitud,
  reenviarSolicitud,
  cerrarExito,
} = useSolicitudes();

// FILTROS
const filtroTexto = ref("");
const filtroEstado = ref("");

// Asegurar que solicitudes sea un array
const solicitudesArray = computed(() => {
  if (!solicitudes || !Array.isArray(solicitudes)) {
    return [];
  }
  return solicitudes;
});

// FILTRADO
const solicitudesFiltradas = computed(() => {
  let resultado = [...solicitudesArray.value];

  if (filtroTexto.value) {
    const busqueda = filtroTexto.value.toLowerCase();
    resultado = resultado.filter(
      (s) =>
        s?.nombreUsuario?.toLowerCase().includes(busqueda) ||
        s?.correoUsuario?.toLowerCase().includes(busqueda),
    );
  }

  if (filtroEstado.value) {
    resultado = resultado.filter(
      (s) => s?.estado === parseInt(filtroEstado.value),
    );
  }

  return resultado;
});

// Opciones para filtros
const filtrosSelects = computed(() => [
  {
    nombre: "estado",
    placeholder: "Todos los estados",
    opciones: [
      { valor: "1", texto: "Pendiente" },
      { valor: "2", texto: "Aprobada" },
      { valor: "3", texto: "Usada" },
      { valor: "4", texto: "Expirada" },
      { valor: "5", texto: "Correo fallido" },
    ],
    valorSeleccionado: filtroEstado.value,
  },
]);

// FUNCIONES
function onFiltrosChange({ texto, selects }) {
  filtroTexto.value = texto || "";
  if (selects && selects.length >= 1) {
    filtroEstado.value = selects[0]?.valorSeleccionado ?? "";
  }
}

function onLimpiarFiltros() {
  filtroTexto.value = "";
  filtroEstado.value = "";
}

function onAccion({ accion, fila }) {
  if (accion === "aprobar") return aprobarSolicitud(fila.id);
  if (accion === "reenviar")
    return reenviarSolicitud(fila.id, fila.nombreUsuario);
}

// Recargar al volver
watch(
  () => route.path,
  () => {
    cargar();
  },
);

// CICLO DE VIDA - Carga inicial
onMounted(cargar);
</script>

<template>
  <!-- CONTENEDOR PRINCIPAL -->
  <div class="gestion-wrapper">
    <!-- CABECERA -->
    <div class="gestion-header">
      <div>
        <h2 class="gestion-title">
          {{
            vistaActual === "historial"
              ? "Historial de Solicitudes"
              : "Solicitudes Pendientes"
          }}
        </h2>
        <p class="gestion-subtitle">
          {{
            vistaActual === "historial"
              ? "Registro completo de todas las solicitudes."
              : "Aprueba o reenvía solicitudes de recuperación."
          }}
        </p>
      </div>
      <div class="gestion-header-actions">
        <button
          class="gestion-btn-actualizar"
          @click="
            cambiarVista(
              vistaActual === 'historial' ? 'pendientes' : 'historial',
            )
          "
        >
          <i class="bi bi-arrow-left-right"></i>
          {{ vistaActual === "historial" ? "Ver pendientes" : "Ver historial" }}
        </button>
        <button class="gestion-btn-actualizar" @click="cargar">
          <i class="bi bi-arrow-clockwise"></i>
          Actualizar
        </button>
      </div>
    </div>

    <!-- MODAL ERROR -->
    <UiModal
      v-if="error"
      tipo="error"
      :mensaje="error"
      texto-confirmar="Entendido"
      @confirmar="error = ''"
      @cerrar="error = ''"
    />

    <!-- MODAL ÉXITO CON CÓDIGO -->
    <div v-if="mensaje && !error" class="gestion-overlay">
      <div class="gestion-modal success">
        <div class="gestion-modal-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <p class="gestion-modal-msg">{{ mensaje }}</p>
        <div v-if="codigoGenerado" class="gestion-codigo-box">
          <p class="gestion-codigo-label">
            Código para
            <strong>{{ usuarioAprobado }}</strong>
            :
          </p>
          <h3 class="gestion-codigo">{{ codigoGenerado }}</h3>
          <p class="gestion-codigo-aviso">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>
            Anota este código — desaparecerá en 15 segundos.
          </p>
        </div>
        <button class="gestion-modal-btn success-btn" @click="cerrarExito">
          Aceptar
        </button>
      </div>
    </div>

    <!-- SPINNER DE CARGA -->
    <div v-if="cargando" class="gestion-spinner-wrapper">
      <div class="gestion-spinner"></div>
      <p class="gestion-spinner-text">Cargando...</p>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <div v-if="!cargando">
      <!-- BARRA DE FILTROS -->
      <UiFiltros
        placeholder-busqueda="Buscar..."
        :selects="filtrosSelects"
        :contador="`${solicitudesFiltradas.length} de ${solicitudesArray.length} solicitudes`"
        @filtros-change="onFiltrosChange"
        @limpiar-filtros="onLimpiarFiltros"
      />

      <!-- TABLA DE SOLICITUDES -->
      <UiTable
        :columnas="columnas"
        :datos="solicitudesFiltradas"
        :acciones="acciones"
        :items-por-pagina="6"
        texto-vacio="No hay solicitudes registradas."
        @accion-click="onAccion"
      />
    </div>
  </div>
</template>
