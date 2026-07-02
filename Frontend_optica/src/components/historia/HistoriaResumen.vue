<script setup>
defineProps({
  totalConsultas: { type: Number, required: true },
  finalizadas: { type: Number, required: true },
  enProceso: { type: Number, required: true },
  totalArchivos: { type: Number, required: true },
});
</script>

<template>
  <div class="historia-resumen mb-4">
    <div class="row g-3">
      <div class="col-md-3">
        <div class="resumen-card bg-primary bg-opacity-10">
          <span class="resumen-numero">{{ totalConsultas }}</span>
          <span class="resumen-label">Total Consultas</span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="resumen-card bg-success bg-opacity-10">
          <span class="resumen-numero">{{ finalizadas }}</span>
          <span class="resumen-label">Finalizadas</span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="resumen-card bg-warning bg-opacity-10">
          <span class="resumen-numero">{{ enProceso }}</span>
          <span class="resumen-label">En Proceso</span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="resumen-card bg-info bg-opacity-10">
          <span class="resumen-numero">{{ totalArchivos }}</span>
          <span class="resumen-label">Total Archivos</span>
        </div>
      </div>
    </div>
  </div>
</template>
