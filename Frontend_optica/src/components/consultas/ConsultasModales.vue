<script setup>
import UiModal from "../shared/UiModal.vue";
import UiFormModal from "../shared/UiFormModal.vue";
import UiMedicion from "./UiMedicion.vue";
import UiDetConsulta from "./UiDetConsulta.vue";
import UiFileUpload from "../shared/UiFileUpload.vue";

defineProps({
  // Formulario
  mostrarFormulario: { type: Boolean, default: false },
  consultaEditando: { type: Boolean, default: false },
  errorFormulario: { type: String, default: "" },
  camposFormulario: { type: Array, required: true },
  form: { type: Object, required: true },
  incluyeAcompanante: { type: Boolean, default: false },
  idConsultaActual: { type: [Number, String], default: null },

  // Modales
  mensaje: { type: String, default: "" },
  error: { type: String, default: "" },
  mostrarConfirmacion: { type: Boolean, default: false },
  mensajeConfirmacion: { type: String, default: "" },
  mostrarPreguntaMediciones: { type: Boolean, default: false },
  consultaIdParaMediciones: { type: [Number, String], default: null },
  mostrarDetalle: { type: Boolean, default: false },
  idConsultaDetalle: { type: [Number, String], default: null },
  mostrarModalMediciones: { type: Boolean, default: false },
  idConsultaMediciones: { type: [Number, String], default: null },
  modoEdicionMediciones: { type: Boolean, default: false },
  puedeEditarMediciones: { type: Boolean, default: true },
  mostrarModalArchivos: { type: Boolean, default: false },
  idConsultaArchivos: { type: [Number, String], default: null },
});

defineEmits([
  "guardarFormulario",
  "cancelarFormulario",
  "confirmarMensaje",
  "confirmarError",
  "ejecutarConfirmacion",
  "cancelarConfirmacion",
  "cerrarConfirmacion",
  "abrirMediciones",
  "cerrarPreguntaMediciones",
  "cerrarDetalle",
  "cerrarModalMediciones",
  "guardadoMediciones",
  "update:incluyeAcompanante",
  "archivoSubido",
  "archivoEliminado",
  "cerrarModalArchivos",
]);
</script>

<template>
  <!-- MODAL DE FORMULARIO -->
  <UiFormModal
    v-if="mostrarFormulario"
    :titulo="consultaEditando ? 'Editar Consulta' : 'Nueva Consulta'"
    :campos="camposFormulario"
    :datos="form"
    :texto-guardar="consultaEditando ? 'Guardar cambios' : 'Crear consulta'"
    :icono-guardar="consultaEditando ? 'bi-pencil-fill' : 'bi-plus-lg'"
    :error="errorFormulario"
    @guardar="$emit('guardarFormulario')"
    @cancelar="$emit('cancelarFormulario')"
  >
    <template v-if="!consultaEditando" #extra>
      <label class="form-check">
        <input
          type="checkbox"
          :checked="incluyeAcompanante"
          @change="$emit('update:incluyeAcompanante', $event.target.checked)"
        />
        Registrar acompañante
      </label>
    </template>

    <!-- ARCHIVOS DENTRO DEL FORMULARIO -->
    <template #footer>
      <div class="archivos-adjuntos">
        <label class="form-label">Archivos Adjuntos</label>
        <UiFileUpload
          v-if="idConsultaActual"
          :id-consulta="idConsultaActual"
          @archivo-subido="$emit('archivoSubido')"
          @archivo-eliminado="$emit('archivoEliminado')"
        />
        <p v-else class="text-muted" style="font-size: 0.85rem; margin: 0">
          <i class="bi bi-info-circle me-1"></i>
          Guarde la consulta primero para adjuntar archivos.
        </p>
      </div>
    </template>
  </UiFormModal>

  <!--MODAL DE ARCHIVOS (INDEPENDIENTE) -->
  <div v-if="mostrarModalArchivos" class="gestion-overlay">
    <div class="gestion-modal form-modal" style="max-width: 600px">
      <h3 class="form-modal-title">
        <i class="bi bi-paperclip me-2"></i>
        Archivos Adjuntos
      </h3>
      <p class="form-modal-sub">
        Gestiona los archivos de la consulta #{{ idConsultaArchivos }}
      </p>

      <UiFileUpload
        :id-consulta="idConsultaArchivos"
        @archivo-subido="$emit('archivoSubido')"
        @archivo-eliminado="$emit('archivoEliminado')"
      />

      <div class="form-modal-actions">
        <button
          class="btn-cancelar-estetico"
          @click="$emit('cerrarModalArchivos')"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL DE ÉXITO -->
  <UiModal
    v-if="mensaje"
    tipo="success"
    :mensaje="mensaje"
    texto-confirmar="Aceptar"
    @confirmar="$emit('confirmarMensaje')"
    @cerrar="$emit('confirmarMensaje')"
  />

  <!-- MODAL DE ERROR -->
  <UiModal
    v-if="error"
    tipo="error"
    :mensaje="error"
    texto-confirmar="Entendido"
    @confirmar="$emit('confirmarError')"
    @cerrar="$emit('confirmarError')"
  />

  <!-- MODAL DE CONFIRMACIÓN -->
  <UiFormModal
    v-if="mostrarConfirmacion"
    titulo="Confirmar Acción"
    :campos="[]"
    :datos="{}"
    :mensaje="mensajeConfirmacion"
    texto-guardar="Sí, confirmar"
    icono-guardar="bi-x-circle-fill"
    texto-cancelar="Cancelar"
    @guardar="$emit('ejecutarConfirmacion')"
    @cancelar="$emit('cancelarConfirmacion')"
  />

  <!-- MODAL DE PREGUNTA PARA MEDICIONES -->
  <UiModal
    v-if="mostrarPreguntaMediciones"
    tipo="confirm"
    titulo="Mediciones Optométricas"
    :mensaje="`¿Desea agregar mediciones a la consulta #${consultaIdParaMediciones}?`"
    texto-confirmar="Sí, agregar mediciones"
    texto-cancelar="No, solo guardar"
    :mostrar-cancelar="true"
    @confirmar="$emit('abrirMediciones', consultaIdParaMediciones, false)"
    @cancelar="$emit('cerrarPreguntaMediciones')"
  />

  <!-- MODAL DE DETALLE DE CONSULTA -->
  <UiDetConsulta
    :visible="mostrarDetalle"
    :id-consulta="idConsultaDetalle"
    @close="$emit('cerrarDetalle')"
  />

  <!-- MODAL DE MEDICIONES -->
  <UiMedicion
    :visible="mostrarModalMediciones"
    :id-consulta="idConsultaMediciones"
    :modo-edicion="modoEdicionMediciones"
    :puede-editar="puedeEditarMediciones"
    @close="$emit('cerrarModalMediciones')"
    @guardado="$emit('guardadoMediciones')"
  />
</template>

<style scoped>
.archivos-adjuntos {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}
</style>
