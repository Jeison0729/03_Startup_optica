<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { computed } from "vue";

// PROPS
const props = defineProps({
  tipo: { type: String, default: "success" },
  titulo: { type: String, default: "" },
  mensaje: { type: String, default: "" },
  subMensaje: { type: String, default: "" },
  textoConfirmar: { type: String, default: "Aceptar" },
  textoCancelar: { type: String, default: "Cancelar" },
  mostrarCancelar: { type: Boolean, default: false },
  icono: { type: String, default: "" },
});

// EMITS
const emit = defineEmits(["confirmar", "cancelar", "cerrar"]);

// COMPUTADOS
const iconoDefault = computed(() => {
  if (props.icono) return props.icono;
  const iconos = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill",
    confirm: "bi-question-circle-fill",
  };
  return iconos[props.tipo] || "bi-check-circle-fill";
});

const claseTipo = computed(() =>
  props.tipo === "confirm" ? "warning" : props.tipo,
);
</script>

<template>
  <!-- MODAL DE CONFIRMACIÓN -->
  <div class="gestion-overlay" @click="emit('cerrar')">
    <div class="gestion-modal form-modal" :class="claseTipo" @click.stop>
      <!-- ICONO -->
      <div class="gestion-modal-icon">
        <i :class="['bi', iconoDefault]"></i>
      </div>

      <!-- TÍTULO -->
      <h3 v-if="titulo" class="form-modal-title" style="text-align: center">
        {{ titulo }}
      </h3>

      <!-- MENSAJE PRINCIPAL -->
      <p class="gestion-modal-msg">{{ mensaje }}</p>

      <!-- SUBMENSAJE -->
      <p v-if="subMensaje" class="form-modal-sub" style="margin-bottom: 16px">
        {{ subMensaje }}
      </p>

      <!-- ACCIONES -->
      <div class="form-modal-actions" style="justify-content: center">
        <button
          v-if="mostrarCancelar"
          class="btn-cancelar-estetico"
          @click="emit('cancelar')"
        >
          {{ textoCancelar }}
        </button>
        <button class="btn-guardar-estetico" @click="emit('confirmar')">
          {{ textoConfirmar }}
        </button>
      </div>
    </div>
  </div>
</template>
