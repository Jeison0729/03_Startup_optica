<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// PROPS
const props = defineProps({
  placeholderBusqueda: { type: String, default: "Buscar..." },
  selects: { type: Array, default: () => [] },
  contador: { type: String, default: "" },
});

// EMITS
const emit = defineEmits(["filtrosChange", "limpiarFiltros"]);

// ESTADO REACTIVO
const textoBusqueda = ref("");

// FUNCIONES
const onChange = () =>
  emit("filtrosChange", { texto: textoBusqueda.value, selects: props.selects });

const limpiar = () => {
  textoBusqueda.value = "";
  props.selects.forEach((s) => (s.valorSeleccionado = ""));
  emit("limpiarFiltros");
};
</script>

<template>
  <!-- BARRA DE FILTROS -->
  <div class="filtros-bar">
    <div class="filtros-izquierda">
      <!-- INPUT DE BÚSQUEDA -->
      <div class="filtros-input-wrapper">
        <i class="bi bi-search filtros-input-icon"></i>
        <input
          class="filtros-input"
          type="text"
          :placeholder="placeholderBusqueda"
          v-model="textoBusqueda"
          @input="onChange"
        />
      </div>

      <!-- SELECTS DINÁMICOS -->
      <select
        v-for="(s, idx) in selects"
        :key="idx"
        class="filtros-select"
        v-model="s.valorSeleccionado"
        @change="onChange"
      >
        <option value="">{{ s.placeholder }}</option>
        <option v-for="op in s.opciones" :key="op.valor" :value="op.valor">
          {{ op.texto }}
        </option>
      </select>

      <!-- BOTÓN LIMPIAR -->
      <button class="filtros-btn-limpiar" @click="limpiar">
        <i class="bi bi-x-lg"></i>
        Limpiar
      </button>
    </div>

    <!-- CONTADOR -->
    <span class="filtros-contador">{{ contador }}</span>
  </div>
</template>
