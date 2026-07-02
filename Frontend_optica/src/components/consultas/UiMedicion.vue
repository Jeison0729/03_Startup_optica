<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref, watch } from "vue";
import { useMediciones } from "../../composables/useMediciones";
import { useMedicionForm } from "../../composables/useMedicionForm";
import { useCatalogos } from "../../composables/useCatalogos";

// PROPS Y EMITS
const props = defineProps({
  visible: { type: Boolean, default: false },
  idConsulta: { type: [Number, String], required: false, default: null },
  modoEdicion: { type: Boolean, default: false },
  puedeEditar: { type: Boolean, default: true },
});

const emit = defineEmits(["close", "guardado"]);

// ESTADO REACTIVO
const catalogos = useCatalogos();
const {
  medicion,
  buscarPorConsulta,
  crearMedicion,
  actualizarMedicion,
  limpiar,
} = useMediciones();
const cargandoDatos = ref(false);

// FORMULARIO
const {
  form,
  camposFormulario,
  errorFormulario,
  cargandoGuardado,
  abrirFormulario,
  cerrarFormulario,
  guardar,
} = useMedicionForm(catalogos, async (payload, esEdicion = false) => {
  let resultado;
  if (esEdicion) {
    resultado = await actualizarMedicion(medicion.value?.id, payload);
  } else {
    resultado = await crearMedicion(payload);
  }
  if (resultado) {
    emit("guardado");
    emit("close");
  }
  return resultado;
});

// WATCH: Abrir modal y cargar datos
watch(
  () => props.visible,
  async (nuevo) => {
    if (nuevo && props.idConsulta) {
      await Promise.all([
        catalogos.cargarMateriales(),
        catalogos.cargarTiposLente(),
      ]);
      cargandoDatos.value = true;
      const existente = await buscarPorConsulta(props.idConsulta);
      if (existente) {
        abrirFormulario(props.idConsulta, existente);
      } else {
        abrirFormulario(props.idConsulta, null);
      }
      cargandoDatos.value = false;
    }
  },
);

// FUNCIONES
function cerrar() {
  cerrarFormulario();
  limpiar();
  emit("close");
}
</script>

<template>
  <!-- MODAL DE MEDICIÓN -->
  <div v-if="visible" class="gestion-overlay">
    <div
      class="gestion-modal form-modal"
      style="max-width: 900px; width: 90%; max-height: 90vh; overflow-y: auto"
    >
      <h3 class="form-modal-title">
        {{ !puedeEditar ? "Ver" : modoEdicion ? "Editar" : "Registrar" }}
      </h3>

      <!-- SPINNER DE CARGA -->
      <div v-if="cargandoDatos" class="gestion-spinner-wrapper">
        <div class="gestion-spinner"></div>
      </div>

      <!-- FORMULARIO -->
      <div v-else>
        <div class="form-grid">
          <template v-for="(campo, idx) in camposFormulario" :key="idx">
            <!-- SECCIÓN -->
            <h4 v-if="campo.tipo === 'section'" class="form-section-h4">
              {{ campo.label }}
            </h4>

            <!-- CAMPO TEXT / NUMBER -->
            <div v-else class="form-field">
              <label class="form-label">{{ campo.label }}</label>

              <input
                v-if="campo.tipo === 'text' || campo.tipo === 'number'"
                :type="campo.tipo"
                :step="campo.step"
                :min="campo.min"
                :max="campo.max"
                class="form-input"
                v-model="form[campo.nombre]"
                :placeholder="campo.placeholder"
                :readonly="!puedeEditar"
                :disabled="!puedeEditar"
                :class="{ 'campo-deshabilitado': !puedeEditar }"
              />

              <!-- CAMPO TEXTAREA -->
              <textarea
                v-if="campo.tipo === 'textarea'"
                class="form-input"
                rows="2"
                v-model="form[campo.nombre]"
                :placeholder="campo.placeholder"
                :readonly="!puedeEditar"
                :disabled="!puedeEditar"
              ></textarea>

              <!-- CAMPO SELECT -->
              <select
                v-if="campo.tipo === 'select'"
                class="form-select"
                v-model="form[campo.nombre]"
                :disabled="!puedeEditar"
              >
                <option :value="null" disabled>{{ campo.placeholder }}</option>
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

        <!-- ERROR DEL FORMULARIO -->
        <p v-if="errorFormulario" class="form-error">{{ errorFormulario }}</p>

        <!-- ACCIONES -->
        <div class="form-modal-actions">
          <button
            v-if="puedeEditar"
            class="btn-guardar-estetico"
            @click="guardar"
            :disabled="cargandoGuardado"
          >
            <i class="bi bi-save-fill"></i>
            {{ modoEdicion ? "Actualizar" : "Guardar" }}
          </button>
          <button class="btn-cancelar-estetico" @click="cerrar">
            {{ puedeEditar ? "Cancelar" : "Salir" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.campo-deshabilitado {
  background-color: #b29f9f;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
