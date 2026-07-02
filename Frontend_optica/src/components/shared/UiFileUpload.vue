<script setup>
import { ref } from "vue";
import { useArchivos } from "../../composables/useArchivos";

const props = defineProps({
  idConsulta: { type: [Number, String], required: true },
  soloLectura: { type: Boolean, default: false },
});

const emit = defineEmits(["archivoSubido", "archivoEliminado"]);

const {
  archivos,
  cargando,
  progreso,
  subirArchivo,
  cargarArchivos,
  eliminarArchivo,
  descargarArchivo,
} = useArchivos();

const archivoSeleccionado = ref(null);

// Cargar archivos al montar
async function cargar() {
  if (props.idConsulta) {
    await cargarArchivos(props.idConsulta);
  }
}

cargar();

// Subir archivo
async function onSubir() {
  if (!archivoSeleccionado.value) return;
  const resultado = await subirArchivo(
    props.idConsulta,
    archivoSeleccionado.value,
  );
  if (resultado) {
    emit("archivoSubido", resultado);
    archivoSeleccionado.value = null;
  }
}

// Eliminar archivo
async function onEliminar(idArchivo) {
  if (!confirm("¿Desea eliminar este archivo?")) return;
  const eliminado = await eliminarArchivo(idArchivo);
  if (eliminado) {
    emit("archivoEliminado", idArchivo);
  }
}

// Formatear tamaño
function formatearTamanio(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

// Obtener icono
function obtenerIcono(tipo) {
  if (!tipo) return "bi-file-earmark";
  const ext = tipo.toLowerCase();
  if (ext.includes("pdf")) return "bi-file-earmark-pdf";
  if (ext.includes("image") || ext.includes("jpg") || ext.includes("png"))
    return "bi-file-earmark-image";
  if (ext.includes("doc")) return "bi-file-earmark-word";
  if (ext.includes("xls") || ext.includes("csv"))
    return "bi-file-earmark-excel";
  if (ext.includes("zip") || ext.includes("rar")) return "bi-file-earmark-zip";
  return "bi-file-earmark";
}

// Trigger input file
function triggerFileInput() {
  document.getElementById("fileInput").click();
}
</script>

<template>
  <div class="file-upload-container">
    <!-- Lista de archivos -->
    <div v-if="archivos.length > 0" class="archivos-lista">
      <div v-for="archivo in archivos" :key="archivo.id" class="archivo-item">
        <i :class="['bi', obtenerIcono(archivo.tipo), 'archivo-icono']"></i>
        <span class="archivo-nombre">{{ archivo.nombre }}</span>
        <span class="archivo-tamanio">
          {{ formatearTamanio(archivo.tamanio) }}
        </span>
        <div class="archivo-acciones">
          <button
            class="btn-icon"
            @click="descargarArchivo(archivo.id, archivo.nombre)"
            title="Descargar"
          >
            <i class="bi bi-download"></i>
          </button>
          <button
            v-if="!soloLectura"
            class="btn-icon text-danger"
            @click="onEliminar(archivo.id)"
            title="Eliminar"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Subir archivo -->
    <div v-if="!soloLectura" class="upload-area">
      <input
        id="fileInput"
        type="file"
        class="d-none"
        @change="archivoSeleccionado = $event.target.files[0]"
      />

      <div
        v-if="!archivoSeleccionado"
        class="upload-placeholder"
        @click="triggerFileInput"
      >
        <i class="bi bi-cloud-upload fs-2"></i>
        <p class="mb-0">Haga clic para seleccionar un archivo</p>
        <small class="text-muted">PDF, imágenes, Word, Excel (máx. 10MB)</small>
      </div>

      <div v-else class="upload-seleccionado">
        <i class="bi bi-file-earmark me-2"></i>
        <span>{{ archivoSeleccionado.name }}</span>
        <span class="ms-2 text-muted small">
          ({{ formatearTamanio(archivoSeleccionado.size) }})
        </span>
        <button class="btn-upload" @click="onSubir" :disabled="cargando">
          <i class="bi bi-upload"></i>
          {{ cargando ? "Subiendo..." : "Subir" }}
        </button>
        <button class="btn-cancel" @click="archivoSeleccionado = null">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <!-- Barra de progreso -->
      <div v-if="cargando && progreso > 0" class="progress mt-2">
        <div class="progress-bar" :style="{ width: progreso + '%' }">
          {{ progreso }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload-container {
  width: 100%;
}

.archivos-lista {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.archivo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.archivo-icono {
  font-size: 1.2rem;
  color: #2b5e9f;
}

.archivo-nombre {
  flex: 1;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archivo-tamanio {
  font-size: 0.75rem;
  color: #94a3b8;
}

.archivo-acciones {
  display: flex;
  gap: 4px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #e2e8f0;
}

.upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: #2b5e9f;
}

.upload-placeholder {
  cursor: pointer;
}

.upload-placeholder i {
  color: #94a3b8;
}

.upload-seleccionado {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-upload {
  background: #2b5e9f;
  color: white;
  border: none;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-upload:hover {
  background: #1a3f6e;
}

.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-cancel:hover {
  color: #ef4444;
}

.progress {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #2b5e9f;
  transition: width 0.3s;
}
</style>
