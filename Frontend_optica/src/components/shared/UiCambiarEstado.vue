<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// PROPS
const props = defineProps({
  titulo: { type: String, default: "Cambiar Estado" },
  nombreItem: { type: String, default: "" },
  estadoActual: { type: String, default: "" },
  estados: {
    type: Array,
    default: () => [
      { valor: 1, texto: "Activo" },
      { valor: 2, texto: "Inactivo" },
    ],
  },
});

// EMITS
const emit = defineEmits(["confirmar", "cancelar"]);

// ESTADO REACTIVO
const nuevoEstadoId = ref(null);
</script>

<template>
  <!-- MODAL CAMBIAR ESTADO -->
  <div class="gestion-overlay" @click="emit('cancelar')">
    <div class="gestion-modal form-modal" style="max-width: 400px" @click.stop>
      <h3 class="form-modal-title">{{ titulo }}</h3>
      <p class="form-modal-sub">
        <strong>{{ nombreItem }}</strong>
      </p>

      <!-- SELECTOR DE NUEVO ESTADO -->
      <div class="form-field">
        <label class="form-label">Nuevo Estado</label>
        <select class="form-select" v-model="nuevoEstadoId">
          <option :value="null" disabled selected>Seleccione estado</option>
          <option v-for="e in estados" :key="e.valor" :value="e.valor">
            {{ e.texto }}
          </option>
        </select>
      </div>

      <!-- ACCIONES -->
      <div class="form-modal-actions">
        <button
          class="gestion-modal-btn success-btn"
          @click="emit('confirmar', nuevoEstadoId)"
        >
          Confirmar
        </button>
        <button
          class="gestion-modal-btn secondary-btn"
          @click="emit('cancelar')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
