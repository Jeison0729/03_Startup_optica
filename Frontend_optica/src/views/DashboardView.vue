<script setup>
// ─── IMPORTS ──────────────────────────────────────────────────
import { onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDashboard } from "../composables/useDashboard";
import KpiCard from "../components/dashboard/KpiCard.vue";
import ChartBar from "../components/dashboard/ChartBar.vue";

// ─── INICIALIZACIÓN ──────────────────────────────────────────
const route = useRoute();
const router = useRouter();

const {
  auth,
  cargando,
  error,
  esDev,
  kpisVisibles,
  consultasPorDia,
  ultimasActividades,
  cargarDashboard,
} = useDashboard();

const filtroTiempo = ref("semana");

function irA(ruta) {
  router.push(ruta);
}

function refrescar() {
  cargarDashboard(filtroTiempo.value);
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

// ─── WATCHERS ──────────────────────────────────────────────────
watch(filtroTiempo, (nuevo) => {
  cargarDashboard(nuevo);
});

watch(
  () => route.path,
  () => {
    cargarDashboard(filtroTiempo.value);
  },
);

// ─── CICLO DE VIDA ────────────────────────────────────────────
onMounted(() => {
  cargarDashboard(filtroTiempo.value);
});
</script>

<template>
  <div class="gestion-wrapper">
    <div class="gestion-header gestion-header-fijo">
      <div>
        <h2 class="gestion-title">
          <i class="bi bi-speedometer2 me-2"></i>
          Asi va tu Día
        </h2>
        <p class="gestion-subtitle">
          Bienvenido,
          <strong>{{ auth?.usuario || "Usuario" }}</strong>
          <span class="badge bg-info ms-2"></span>
        </p>
      </div>
      <div class="gestion-header-actions">
        <div class="filtros-botones">
          <button
            class="btn-filtro"
            :class="{ activo: filtroTiempo === 'hoy' }"
            @click="filtroTiempo = 'hoy'"
          >
            Hoy
          </button>
          <button
            class="btn-filtro"
            :class="{ activo: filtroTiempo === 'semana' }"
            @click="filtroTiempo = 'semana'"
          >
            Semana
          </button>
          <button
            class="btn-filtro"
            :class="{ activo: filtroTiempo === 'mes' }"
            @click="filtroTiempo = 'mes'"
          >
            Mes
          </button>
          <button
            class="btn-filtro"
            :class="{ activo: filtroTiempo === 'trimestre' }"
            @click="filtroTiempo = 'trimestre'"
          >
            Trimestre
          </button>
        </div>
        <button class="gestion-btn-actualizar" @click="refrescar">
          <i class="bi bi-arrow-clockwise"></i>
          Actualizar
        </button>
      </div>
    </div>

    <div class="gestion-contenido-scroll">
      <div v-if="cargando" class="gestion-spinner-wrapper">
        <div class="gestion-spinner"></div>
        <p class="gestion-spinner-text">Cargando dashboard...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
      </div>

      <div v-else>
        <!-- KPIS DINÁMICOS SEGÚN ROL -->
        <div class="dashboard-kpi-grid mb-4">
          <KpiCard
            v-for="kpi in kpisVisibles"
            :key="kpi.id"
            :title="kpi.title"
            :value="kpi.value"
            :icon="kpi.icon"
            :type="kpi.type"
            @click="irA(kpi.ruta)"
          />
        </div>

        <div class="row mt-4">
          <div class="col-lg-7 mb-3">
            <div class="grafica-card shadow-sm">
              <div
                class="grafica-header d-flex justify-content-between align-items-center"
              >
                <strong>
                  <i class="bi bi-bar-chart me-1"></i>
                  Consultas Ok
                </strong>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-info-circle"></i>
                  {{
                    consultasPorDia?.datasets?.[0]?.data?.reduce(
                      (a, b) => a + b,
                      0,
                    ) || 0
                  }}
                  total
                </span>
              </div>
              <div class="grafica-body">
                <ChartBar
                  v-if="consultasPorDia?.labels?.length > 0"
                  :data="consultasPorDia"
                  height="250px"
                />
                <div v-else class="text-center py-4 text-muted">
                  <i class="bi bi-bar-chart-line fs-1 d-block"></i>
                  <p>Sin datos disponibles para este período</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5 mb-3">
            <div class="grafica-card shadow-sm">
              <div
                class="grafica-header d-flex justify-content-between align-items-center"
              >
                <strong>
                  <i class="bi bi-clock-history me-1"></i>
                  Últimas Actividades
                </strong>
                <span class="badge bg-light text-dark">
                  {{ ultimasActividades?.length || 0 }}
                </span>
              </div>
              <div class="actividades-scroll p-0">
                <div
                  v-if="ultimasActividades?.length > 0"
                  class="list-group list-group-flush"
                >
                  <div
                    v-for="act in ultimasActividades"
                    :key="act.id"
                    class="actividad-item d-flex align-items-center"
                  >
                    <i
                      :class="[
                        'bi',
                        act.icono || 'bi-circle-fill',
                        'me-2',
                        `text-${act.color || 'primary'}`,
                      ]"
                    ></i>
                    <div class="flex-grow-1">
                      <small class="d-block text-truncate">
                        {{ act.descripcion }}
                      </small>
                      <small class="text-muted">
                        {{ formatFecha(act.fecha) }}
                      </small>
                    </div>
                  </div>
                </div>
                <div v-else class="actividad-vacia">
                  <i class="bi bi-inbox fs-1 d-block"></i>
                  <small>No hay actividades recientes</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
