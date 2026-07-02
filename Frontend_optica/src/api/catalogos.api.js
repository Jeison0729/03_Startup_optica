import api from "./axios";

// Listar EPS
export const listarEpsApi = () => api.get("/api/catalogos/eps");

// Listar estados de consulta
export const listarEstadosConsultaApi = () =>
  api.get("/api/catalogos/estados-consulta");

// Listar estados de paciente
export const listarEstadosPacienteApi = () =>
  api.get("/api/catalogos/estados-paciente");

// Listar materiales
export const listarMaterialesApi = () => api.get("/api/catalogos/materiales");

// Listar parentescos
export const listarParentescosApi = () => api.get("/api/catalogos/parentescos");

// Listar tipos de documento
export const listarTiposDocumentoApi = () =>
  api.get("/api/catalogos/tipos-documentos");

// Listar tipos de lente
export const listarTiposLenteApi = () => api.get("/api/catalogos/tipos-lentes");
