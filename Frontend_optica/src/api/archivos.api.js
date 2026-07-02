import api from "./axios";

// Subir archivo adjunto a una consulta
export const subirArchivoConsultaApi = (idConsulta, archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  return api.post(`/api/consultas/${idConsulta}/archivos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Obtener archivos de una consulta
export const listarArchivosConsultaApi = (idConsulta) =>
  api.get(`/api/consultas/${idConsulta}/archivos`);

// Eliminar archivo
export const eliminarArchivoApi = (idArchivo) =>
  api.delete(`/api/archivos/${idArchivo}`);

// Descargar archivo
export const descargarArchivoApi = (idArchivo) =>
  api.get(`/api/archivos/${idArchivo}/descargar`, { responseType: "blob" });
