<script setup>
// ─── IMPORTS ───────────────────────────────────────────
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// ─── REGISTRO DE COMPONENTES DE CHART.JS ─────────────
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

// ─── PROPS ─────────────────────────────────────────────
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      datasets: [],
    }),
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    }),
  },
  height: {
    type: [String, Number],
    default: "250px",
  },
});
</script>

<template>
  <div :style="{ height: height, width: '100%' }">
    <Bar :data="data" :options="options" />
  </div>
</template>

<style scoped></style>
