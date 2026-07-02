<script setup>
defineProps({
  archivos: { type: Array, required: true },
});

function obtenerIconoArchivo(tipo) {
  if (!tipo) return "bi-file-earmark";
  const ext = tipo.toLowerCase();
  if (ext.includes("pdf")) return "bi-file-earmark-pdf";
  if (
    ext.includes("image") ||
    ext.includes("jpg") ||
    ext.includes("png") ||
    ext.includes("jpeg")
  )
    return "bi-file-earmark-image";
  if (ext.includes("doc")) return "bi-file-earmark-word";
  if (ext.includes("xls") || ext.includes("csv"))
    return "bi-file-earmark-excel";
  if (ext.includes("txt")) return "bi-file-earmark-text";
  return "bi-file-earmark";
}

function descargarArchivo(archivo) {
  if (archivo.url) {
    window.open(archivo.url, "_blank");
  } else if (archivo.id) {
    window.open(`/api/archivos/${archivo.id}/descargar`, "_blank");
  }
}
</script>

<template>
  <div class="col-12">
    <h6 class="text-info">
      <i class="bi bi-paperclip me-1"></i>
      Archivos Adjuntos ({{ archivos.length }})
    </h6>
    <div class="archivos-grid">
      <div
        v-for="archivo in archivos"
        :key="archivo.id"
        class="archivo-item"
        @click="descargarArchivo(archivo)"
      >
        <i :class="['bi', obtenerIconoArchivo(archivo.tipo)]"></i>
        <span class="archivo-nombre">{{ archivo.nombre || "Archivo" }}</span>
        <small class="archivo-tamanio">
          {{
            archivo.tamanio ? (archivo.tamanio / 1024).toFixed(1) + " KB" : ""
          }}
        </small>
        <i class="bi bi-download archivo-download"></i>
      </div>
    </div>
  </div>
</template>
