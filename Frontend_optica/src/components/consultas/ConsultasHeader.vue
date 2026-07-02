<script setup>
defineProps({
  onActualizar: { type: Function, required: true },
  onNuevo: { type: Function, required: true },
});
</script>

<template>
  <div class="gestion-header">
    <div>
      <h2 class="gestion-title">Gestión de Consultas</h2>
      <p class="gestion-subtitle">Administra las consultas optométricas.</p>
    </div>
    <div class="gestion-header-actions">
      <button class="gestion-btn-actualizar" @click="onActualizar">
        <i class="bi bi-arrow-clockwise"></i>
        Actualizar
      </button>
      <button class="gestion-btn-nuevo" @click="onNuevo">
        <i class="bi bi-plus-lg"></i>
        Nueva Consulta
      </button>
    </div>
  </div>
</template>
