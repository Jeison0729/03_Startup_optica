<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHistoriaClinica } from "../composables/useHistoriaClinica";
import HistoriaPacienteCard from "../components/historia/HistoriaPacienteCard.vue";
import HistoriaResumen from "../components/historia/HistoriaResumen.vue";
import HistoriaConsultaItem from "../components/historia/HistoriaConsultaItem.vue";

// INICIALIZACIÓN
const route = useRoute();
const router = useRouter();
const idPaciente = ref(route.params.id);

const { historia, cargando, error, cargarHistoriaClinica } =
  useHistoriaClinica();

// COMPUTADOS PARA EL RESUMEN
const finalizadas = computed(
  () =>
    historia.value?.consultas?.filter((c) => c.consulta.estado === "FINALIZADA")
      .length || 0,
);

const enProceso = computed(
  () =>
    historia.value?.consultas?.filter((c) => c.consulta.estado === "EN_PROCESO")
      .length || 0,
);

const totalArchivos = computed(
  () =>
    historia.value?.consultas?.reduce(
      (total, c) => total + (c.archivos?.length || 0),
      0,
    ) || 0,
);

// FUNCIONES
function volver() {
  router.push("/pacientes");
}

// CICLO DE VIDA
onMounted(() => {
  if (idPaciente.value) {
    cargarHistoriaClinica(idPaciente.value);
  }
});
</script>

<template>
  <div class="gestion-wrapper">
    <!-- CABECERA -->
    <div class="gestion-header gestion-header-fijo">
      <div>
        <h2 class="gestion-title">
          <i class="bi bi-file-text me-2"></i>
          Historia Clínica
        </h2>
        <p v-if="historia" class="gestion-subtitle">
          {{ historia.nombreCompleto }} · {{ historia.tipoDocumento }}
          {{ historia.numeroDocumento }}
        </p>
      </div>
      <div class="gestion-header-actions">
        <button class="gestion-btn-actualizar" @click="volver">
          <i class="bi bi-arrow-left"></i>
          Volver
        </button>
        <button
          class="gestion-btn-actualizar"
          @click="cargarHistoriaClinica(idPaciente)"
          :disabled="cargando"
        >
          <i class="bi bi-arrow-clockwise" :class="{ spin: cargando }"></i>
          Actualizar
        </button>
      </div>
    </div>

    <!-- CONTENIDO SCROLLEABLE -->
    <div class="gestion-contenido-scroll">
      <!-- SPINNER -->
      <div v-if="cargando" class="gestion-spinner-wrapper">
        <div class="gestion-spinner"></div>
        <p class="gestion-spinner-text">Cargando historia clínica...</p>
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
      </div>

      <!-- CONTENIDO -->
      <div v-else-if="historia">
        <!-- DATOS DEL PACIENTE -->
        <HistoriaPacienteCard :paciente="historia" />

        <!-- RESUMEN -->
        <HistoriaResumen
          :total-consultas="historia.totalConsultas"
          :finalizadas="finalizadas"
          :en-proceso="enProceso"
          :total-archivos="totalArchivos"
        />

        <!-- LISTADO DE CONSULTAS -->
        <div class="historia-consultas">
          <h4 class="mb-3">Historial de Consultas</h4>

          <div
            v-if="historia.consultas.length === 0"
            class="text-center py-5 text-muted"
          >
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            <p>Este paciente no tiene consultas registradas.</p>
          </div>

          <HistoriaConsultaItem
            v-for="item in historia.consultas"
            :key="item.consulta.id"
            :consulta-item="item"
          />
        </div>
      </div>

      <!-- SINO HAY DATOS -->
      <div v-else class="text-center py-5 text-muted">
        <i class="bi bi-file-text fs-1 d-block mb-2"></i>
        <p>Seleccione un paciente para ver su historia clínica.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── SOLO LO QUE NO ESTÁ EN GLOBALES ─── */
.historia-consultas h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
