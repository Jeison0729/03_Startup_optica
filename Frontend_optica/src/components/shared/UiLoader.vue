<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref, onMounted, onUnmounted } from "vue";
import { useLoader } from "../../composables/useLoader";

// ESTADO REACTIVO
const { cargando } = useLoader();
</script>

<template>
  <!-- LOADER GLOBAL -->
  <div v-if="cargando" class="ui-loader-overlay">
    <div class="gestion-spinner-wrapper" style="padding: 0">
      <div class="gestion-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.ui-loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(var(--primary-rgb), 0.1);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.gestion-spinner {
  width: 50px;
  height: 50px;
  border-width: 4px;
}
</style>
