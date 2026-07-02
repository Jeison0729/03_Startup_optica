<script setup>
defineProps({
  paciente: { type: Object, required: true },
});

function formatearFechaNacimiento(fecha) {
  if (!fecha) return "—";
  const d = new Date(fecha);
  return d.toLocaleDateString();
}

function obtenerGenero(genero) {
  const map = { M: "Masculino", F: "Femenino", Otro: "Otro" };
  return map[genero] || genero || "—";
}
</script>

<template>
  <div class="historia-paciente-card mb-4">
    <div class="row g-3">
      <div class="col-md-3">
        <label class="text-muted small">Documento</label>
        <p class="fw-bold">
          {{ paciente.tipoDocumento }} {{ paciente.numeroDocumento }}
        </p>
      </div>
      <div class="col-md-3">
        <label class="text-muted small">Nombre Completo</label>
        <p class="fw-bold">{{ paciente.nombreCompleto }}</p>
      </div>
      <div class="col-md-2">
        <label class="text-muted small">Fecha Nacimiento</label>
        <p class="fw-bold">
          {{ formatearFechaNacimiento(paciente.fechaNacimiento) }}
        </p>
      </div>
      <div class="col-md-2">
        <label class="text-muted small">Género</label>
        <p class="fw-bold">{{ obtenerGenero(paciente.genero) }}</p>
      </div>
      <div class="col-md-2">
        <label class="text-muted small">EPS</label>
        <p class="fw-bold">{{ paciente.eps || "—" }}</p>
      </div>
    </div>
  </div>
</template>
