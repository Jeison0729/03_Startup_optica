<script setup>
import { ref } from "vue";
import HistoriaArchivos from "./HistoriaArchivos.vue";

const props = defineProps({
  consultaItem: { type: Object, required: true },
});

const expandido = ref(false);

function toggleExpandir() {
  expandido.value = !expandido.value;
}

function formatearFecha(fecha) {
  if (!fecha) return "—";
  const d = new Date(fecha);
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function obtenerEstadoColor(estado) {
  const map = {
    BORRADOR: "secondary",
    EN_PROCESO: "warning",
    FINALIZADA: "success",
    ANULADA: "danger",
  };
  return map[estado?.toUpperCase()] || "secondary";
}

const consulta = props.consultaItem.consulta;
const medicion = props.consultaItem.medicion;
const archivos = props.consultaItem.archivos || [];
</script>

<template>
  <div class="historia-consulta-item mb-3">
    <!-- CABECERA -->
    <div class="consulta-header" @click="toggleExpandir">
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-3 mb-2 flex-wrap">
            <span
              class="badge"
              :class="`bg-${obtenerEstadoColor(consulta.estado)}`"
            >
              {{ consulta.estado || "BORRADOR" }}
            </span>
            <small class="text-muted">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatearFecha(consulta.fechaConsulta) }}
            </small>
            <small class="text-muted">
              <i class="bi bi-person me-1"></i>
              {{ consulta.optometra }}
            </small>
            <span v-if="archivos.length > 0" class="badge bg-info">
              <i class="bi bi-paperclip me-1"></i>
              {{ archivos.length }} archivo(s)
            </span>
          </div>
          <p class="mb-1">
            <strong>Motivo:</strong>
            {{ consulta.motivoConsulta || "—" }}
          </p>
          <p v-if="consulta.diagnostico" class="mb-0 text-muted small">
            <strong>Diagnóstico:</strong>
            {{ consulta.diagnostico }}
          </p>
        </div>
        <div class="text-end ms-3">
          <span v-if="medicion" class="badge bg-success">
            <i class="bi bi-clipboard-data me-1"></i>
            Con medición
          </span>
          <span v-else class="badge bg-secondary">
            <i class="bi bi-clipboard me-1"></i>
            Sin medición
          </span>
          <span class="ms-2 text-muted">
            <i
              class="bi"
              :class="expandido ? 'bi-chevron-up' : 'bi-chevron-down'"
            ></i>
          </span>
        </div>
      </div>
    </div>

    <!-- DETALLE EXPANDIDO -->
    <div v-if="expandido" class="consulta-detalle mt-3 pt-3 border-top">
      <div class="row g-4">
        <!-- DATOS CONSULTA -->
        <div
          :class="
            medicion
              ? 'col-md-6'
              : archivos.length > 0
                ? 'col-md-6'
                : 'col-md-12'
          "
        >
          <h6 class="text-info">
            <i class="bi bi-clipboard2-pulse me-1"></i>
            Datos de la Consulta
          </h6>
          <div class="detalle-grid">
            <div class="detalle-item">
              <label>Motivo</label>
              <span>{{ consulta.motivoConsulta || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Último Control</label>
              <span>{{ consulta.ultimoControl || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Antecedentes</label>
              <span>{{ consulta.antecedentes || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Antecedentes Familiares</label>
              <span>{{ consulta.antecedentesFamiliares || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Examen Externo</label>
              <span>{{ consulta.examenExterno || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Tonometría OD</label>
              <span>{{ consulta.tonometriaOd || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Tonometría OI</label>
              <span>{{ consulta.tonometriaOi || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Test Color</label>
              <span>{{ consulta.testColor || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Fondo de Ojo</label>
              <span>{{ consulta.fondoOjo || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Diagnóstico</label>
              <span>{{ consulta.diagnostico || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Conducta</label>
              <span>{{ consulta.conducta || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Control Sugerido</label>
              <span>{{ consulta.controlSugerido || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Remisión</label>
              <span>{{ consulta.remision || "—" }}</span>
            </div>
          </div>
        </div>

        <!-- MEDICIÓN -->
        <div
          v-if="medicion"
          :class="archivos.length > 0 ? 'col-md-6' : 'col-md-12'"
        >
          <h6 class="text-info">
            <i class="bi bi-clipboard-data me-1"></i>
            Medición Optométrica
          </h6>
          <div class="detalle-grid">
            <div class="detalle-item">
              <label>Fecha Medición</label>
              <span>{{ formatearFecha(medicion.fechaMedicion) }}</span>
            </div>
            <div class="detalle-item">
              <label>AV OD</label>
              <span>{{ medicion.avOd || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>AV OI</label>
              <span>{{ medicion.avOi || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>AV AO</label>
              <span>{{ medicion.avAo || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Esfera OD</label>
              <span>{{ medicion.esferaOd || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Esfera OI</label>
              <span>{{ medicion.esferaOi || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Cilindro OD</label>
              <span>{{ medicion.cilindroOd || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Cilindro OI</label>
              <span>{{ medicion.cilindroOi || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Eje OD</label>
              <span>{{ medicion.ejeOd || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Eje OI</label>
              <span>{{ medicion.ejeOi || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>DIP</label>
              <span>{{ medicion.dip || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Altura</label>
              <span>{{ medicion.altura || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Material</label>
              <span>{{ medicion.material || "—" }}</span>
            </div>
            <div class="detalle-item">
              <label>Tipo Lente</label>
              <span>{{ medicion.tipoLente || "—" }}</span>
            </div>
          </div>
        </div>

        <!-- ARCHIVOS -->
        <HistoriaArchivos v-if="archivos.length > 0" :archivos="archivos" />
      </div>
    </div>
  </div>
</template>
