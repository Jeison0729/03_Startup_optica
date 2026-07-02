<script setup>
// PROPS
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  type: { type: String, default: "primary" },
});

// EMITS
defineEmits(["click"]);
</script>

<template>
  <!-- TARJETA KPI - CLICKEABLE -->
  <div class="kpi-card-wrapper" @click="$emit('click')">
    <div :class="['kpi-panel-card p-3 shadow-sm bg-white', `border-${type}`]">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="text-muted text-uppercase small fw-bold">
            {{ title }}
          </span>
          <h3 :class="['fw-bold my-1', `text-kpi-${type}`]">
            {{ value }}
          </h3>
        </div>
        <div
          :class="[
            'kpi-icon-box fs-3 rounded',
            `bg-soft-${type}`,
            `text-kpi-${type}`,
          ]"
        >
          <i :class="['bi', icon]"></i>
        </div>
      </div>
    </div>
  </div>
</template>
