<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { computed } from "vue";

// PROPS
const props = defineProps({
  usuario: { type: String, default: "" },
  rol: { type: String, default: "" },
  titulo: { type: String, default: "" },
  botones: { type: Array, default: () => [] },
});

// EMITS
const emit = defineEmits(["toggleSidebar", "accionBoton"]);

// COMPUTADOS
const rolTexto = computed(() => {
  const roles = {
    ROLE_DEV: "Desarrollador",
    ROLE_ADMIN: "Administrador",
    ROLE_EMPLEADO: "Empleado",
  };
  return roles[props.rol] || "Usuario";
});
</script>

<template>
  <!-- BARRA DE NAVEGACIÓN GLOBAL -->
  <nav class="main-navbar">
    <div
      class="container-fluid d-flex align-items-center justify-content-between"
    >
      <!-- LOGO / TÍTULO -->
      <div class="d-flex align-items-center">
        <span class="brand-text">
          <span class="fw-light">{{ titulo }}</span>
        </span>
      </div>

      <!-- SECCIÓN DERECHA: USUARIO + BOTONES -->
      <div class="d-flex align-items-center gap-3">
        <!-- INFO USUARIO -->
        <div class="text-end">
          <div class="welcome-text">{{ rolTexto }}</div>
          <div class="user-name">{{ usuario }}</div>
        </div>
        <div class="divider-vertical"></div>

        <!-- BOTONES DINÁMICOS -->
        <button
          v-for="b in botones"
          :key="b.accion"
          :class="b.clase"
          @click="emit('accionBoton', b.accion)"
        >
          <i class="bi" :class="b.icono"></i>
          {{ b.texto }}
        </button>
      </div>
    </div>
  </nav>
</template>
