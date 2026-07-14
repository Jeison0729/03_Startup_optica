<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ labels: [], datasets: [] }),
  },
  height: {
    type: [String, Number],
    default: "250px",
  },
});
</script>

<template>
  <div :style="{ height: height, width: '100%' }">
    <Doughnut
      :data="data"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
            },
          },
        },
      }"
    />
  </div>
</template>
