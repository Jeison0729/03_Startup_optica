import { ref } from "vue";
import {
  subirArchivoConsultaApi,
  listarArchivosConsultaApi,
  eliminarArchivoApi,
  descargarArchivoApi,
} from "../api/archivos.api";

export function useArchivos() {
  const archivos = ref([]);
  const cargando = ref(false);
  const error = ref("");
  const progreso = ref(0);

  // Subir archivo
  async function subirArchivo(idConsulta, archivo) {
    cargando.value = true;
    error.value = "";
    progreso.value = 0;

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      const { data } = await subirArchivoConsultaApi(idConsulta, archivo);
      archivos.value.push(data);
      progreso.value = 100;
      return data;
    } catch (err) {
      error.value = "Error al subir el archivo.";
      console.error(err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  // Cargar archivos de una consulta
  async function cargarArchivos(idConsulta) {
    cargando.value = true;
    try {
      const { data } = await listarArchivosConsultaApi(idConsulta);
      archivos.value = data || [];
    } catch {
      archivos.value = [];
    } finally {
      cargando.value = false;
    }
  }

  // Eliminar archivo
  async function eliminarArchivo(idArchivo) {
    try {
      await eliminarArchivoApi(idArchivo);
      archivos.value = archivos.value.filter((a) => a.id !== idArchivo);
      return true;
    } catch {
      error.value = "Error al eliminar el archivo.";
      return false;
    }
  }

  // Descargar archivo
  async function descargarArchivo(idArchivo, nombre) {
    try {
      const response = await descargarArchivoApi(idArchivo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = nombre || "archivo";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      error.value = "Error al descargar el archivo.";
    }
  }

  // Limpiar
  function limpiarArchivos() {
    archivos.value = [];
    error.value = "";
    progreso.value = 0;
  }

  return {
    archivos,
    cargando,
    error,
    progreso,
    subirArchivo,
    cargarArchivos,
    eliminarArchivo,
    descargarArchivo,
    limpiarArchivos,
  };
}
