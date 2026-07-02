<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref, watch } from "vue";
import { useConsultas } from "../../composables/useConsultas";

// PROPS Y EMITS
const props = defineProps({
  visible: { type: Boolean, default: false },
  idConsulta: { type: [Number, String], required: false, default: null },
});

const emit = defineEmits(["close"]);

// ESTADO REACTIVO
const { obtenerConsulta } = useConsultas();
const consulta = ref(null);
const cargando = ref(false);

// WATCH: Cargar consulta cuando se abre el modal
watch(
  () => props.visible,
  async (nuevo) => {
    if (nuevo && props.idConsulta) {
      cargando.value = true;
      consulta.value = await obtenerConsulta(props.idConsulta);
      cargando.value = false;
    } else {
      consulta.value = null;
    }
  },
);

// FUNCIONES
function cerrar() {
  emit("close");
}

// CONFIGURACIÓN DE CAMPOS A MOSTRAR
const campos = [
  { label: "Paciente", clave: "paciente" },
  { label: "Optómetra", clave: "optometra" },
  { label: "Motivo de consulta", clave: "motivoConsulta" },
  { label: "Último control", clave: "ultimoControl" },
  { label: "Antecedentes personales", clave: "antecedentes" },
  { label: "Antecedentes familiares", clave: "antecedentesFamiliares" },
  { label: "Examen externo", clave: "examenExterno" },
  { label: "Tonometría OD", clave: "tonometriaOd" },
  { label: "Tonometría OI", clave: "tonometriaOi" },
  { label: "Test de color", clave: "testColor" },
  { label: "Fondo de ojo", clave: "fondoOjo" },
  { label: "Diagnóstico", clave: "diagnostico" },
  { label: "Conducta", clave: "conducta" },
  { label: "Control sugerido", clave: "controlSugerido" },
  { label: "Remisión", clave: "remision" },
];
</script>

<template>
  <!-- MODAL DE DETALLE DE CONSULTA -->
  <div v-if="visible" class="gestion-overlay">
    <div
      class="gestion-modal form-modal"
      style="max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto"
    >
      <h3 class="form-modal-title">Detalle de la Consulta</h3>

      <!-- SPINNER DE CARGA -->
      <div v-if="cargando" class="gestion-spinner-wrapper">
        <div class="gestion-spinner"></div>
      </div>

      <!-- CUERPO DEL MODAL -->
      <div v-else-if="consulta" class="form-grid">
        <!-- CAMPOS DINÁMICOS -->
        <div v-for="(campo, idx) in campos" :key="idx" class="form-field">
          <label class="form-label">{{ campo.label }}</label>
          <p class="form-detalle-valor">
            {{ consulta[campo.clave] || "—" }}
          </p>
        </div>

        <!-- FECHA DE CONSULTA -->
        <div class="form-field">
          <label class="form-label">Fecha de consulta</label>
          <p class="form-detalle-valor">
            {{ new Date(consulta.fechaConsulta).toLocaleString() }}
          </p>
        </div>

        <!-- ESTADO -->
        <div class="form-field">
          <label class="form-label">Estado</label>
          <p class="form-detalle-valor">{{ consulta.estado }}</p>
        </div>

        <!-- FECHA DE CIERRE (si existe) -->
        <div v-if="consulta.fechaCierre" class="form-field">
          <label class="form-label">Fecha de cierre</label>
          <p class="form-detalle-valor">
            {{ new Date(consulta.fechaCierre).toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- ACCIONES -->
      <div class="form-modal-actions">
        <button class="btn-cancelar-estetico" @click="cerrar">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-detalle-valor {
  margin: 0;
  padding: 8px 0;
  color: var(--text-main);
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-light);
  min-height: 1.4em;
}
</style>
