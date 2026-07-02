<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";

// PROPS
const props = defineProps({
  titulo: { type: String, default: "Formulario" },
  campos: { type: Array, default: () => [] },
  datos: { type: Object, default: () => ({}) },
  textoGuardar: { type: String, default: "Guardar" },
  iconoGuardar: { type: String, default: "" },
  textoCancelar: { type: String, default: "Cancelar" },
  error: { type: String, default: "" },
  mensaje: { type: String, default: "" },
});

// EMITS
const emit = defineEmits(["guardar", "cancelar"]);

// ESTADO REACTIVO
const verContrasena = ref(false);

const camposReales = computed(
  () => props.campos.filter((c) => c.tipo !== "section").length,
);
const esCompacto = computed(() => camposReales.value <= 2);
</script>

<template>
  <!-- MODAL DE FORMULARIO GENÉRICO -->
  <div class="gestion-overlay">
    <div
      class="gestion-modal form-modal"
      :class="{
        'form-grid-compacto': esCompacto,
      }"
      @click.stop
    >
      <h3 class="form-modal-title">{{ titulo }}</h3>

      <div class="form-grid" :class="{ 'form-grid-compacto': esCompacto }">
        <template v-for="(campo, idx) in campos" :key="idx">
          <!-- SECCIÓN -->
          <h4 v-if="campo.tipo === 'section'" class="form-section-h4">
            {{ campo.label }}
          </h4>

          <!-- CAMPO NORMAL -->
          <div v-else class="form-field">
            <label class="form-label">
              {{ campo.label }}
              <span v-if="campo.obligatorio" style="color: var(--danger-color)">
                *
              </span>
            </label>

            <!-- INPUT TEXT / NUMBER / EMAIL etc -->
            <input
              v-if="!['select', 'password', 'date'].includes(campo.tipo)"
              class="form-input"
              :type="campo.tipo"
              :placeholder="campo.placeholder || ''"
              v-model="datos[campo.nombre]"
              :readonly="campo.soloLectura"
            />

            <!-- INPUT DATE -->
            <input
              v-if="campo.tipo === 'date'"
              class="form-input"
              type="date"
              v-model="datos[campo.nombre]"
            />

            <!-- INPUT PASSWORD CON TOGGLE -->
            <div v-if="campo.tipo === 'password'" class="form-input-group">
              <input
                class="form-input"
                :type="verContrasena ? 'text' : 'password'"
                :placeholder="campo.placeholder || ''"
                v-model="datos[campo.nombre]"
              />
              <button
                class="form-eye-btn"
                type="button"
                @click="verContrasena = !verContrasena"
              >
                <i :class="verContrasena ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>

            <!-- SELECT -->
            <select
              v-if="campo.tipo === 'select'"
              class="form-select"
              v-model="datos[campo.nombre]"
            >
              <option :value="null" disabled>
                {{ campo.placeholder || "Seleccione " + campo.label }}
              </option>
              <option
                v-for="op in campo.opciones"
                :key="op.valor"
                :value="op.valor"
              >
                {{ op.texto }}
              </option>
            </select>
          </div>
        </template>
      </div>

      <!-- SLOT EXTRA (para checkbox de acompañante) -->
      <slot name="extra" />

      <p v-if="mensaje" class="form-modal-sub">{{ mensaje }}</p>
      <!-- ERROR -->
      <p v-if="error" class="form-error">{{ error }}</p>

      <!-- SLOT FOOTER AGREGADO -->
      <slot name="footer" />

      <!-- ACCIONES -->
      <div class="form-modal-actions">
        <button class="btn-guardar-estetico" @click="emit('guardar', datos)">
          <i v-if="iconoGuardar" :class="['bi', iconoGuardar]"></i>
          {{ textoGuardar }}
        </button>
        <button class="btn-cancelar-estetico" @click="emit('cancelar')">
          {{ textoCancelar }}
        </button>
      </div>
    </div>
  </div>
</template>
