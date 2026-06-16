// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import {
  listarEpsApi,
  listarEstadosConsultaApi,
  listarEstadosPacienteApi,
  listarMaterialesApi,
  listarParentescosApi,
  listarTiposDocumentoApi,
  listarTiposLenteApi,
} from "../api/catalogos.api";

// COMPOSABLE DE CATÁLOGOS
export function useCatalogos() {
  // ESTADO REACTIVO
  const eps = ref([]);
  const estadosConsulta = ref([]);
  const estadosPaciente = ref([]);
  const materiales = ref([]);
  const parentescos = ref([]);
  const tiposDocumento = ref([]);
  const tiposLente = ref([]);
  const error = ref("");

  // FUNCIONES DE CARGA

  // Carga lista de EPS
  async function cargarEps() {
    try {
      const { data } = await listarEpsApi();
      eps.value = data || [];
    } catch {
      error.value = "Error al cargar EPS.";
    }
  }

  // Carga estados de consulta
  async function cargarEstadosConsulta() {
    try {
      const { data } = await listarEstadosConsultaApi();
      estadosConsulta.value = data || [];
    } catch {
      error.value = "Error al cargar estados de consulta.";
    }
  }

  // Carga estados de paciente
  async function cargarEstadosPaciente() {
    try {
      const { data } = await listarEstadosPacienteApi();
      estadosPaciente.value = data || [];
    } catch {
      error.value = "Error al cargar estados de paciente.";
    }
  }

  // Carga materiales
  async function cargarMateriales() {
    try {
      const { data } = await listarMaterialesApi();
      materiales.value = data || [];
    } catch {
      error.value = "Error al cargar materiales.";
    }
  }

  // Carga parentescos
  async function cargarParentescos() {
    try {
      const { data } = await listarParentescosApi();
      parentescos.value = data || [];
    } catch {
      error.value = "Error al cargar parentescos.";
    }
  }

  // Carga tipos de documento
  async function cargarTiposDocumento() {
    try {
      const { data } = await listarTiposDocumentoApi();
      tiposDocumento.value = data || [];
    } catch {
      error.value = "Error al cargar tipos de documento.";
    }
  }

  // Carga tipos de lente
  async function cargarTiposLente() {
    try {
      const { data } = await listarTiposLenteApi();
      tiposLente.value = data || [];
    } catch {
      error.value = "Error al cargar tipos de lente.";
    }
  }

  // Carga catálogos necesarios para paciente
  async function cargarCatalogosPaciente() {
    await Promise.all([
      cargarTiposDocumento(),
      cargarEps(),
      cargarEstadosPaciente(),
    ]);
  }

  // FUNCIONES DE UTILERÍA

  // Obtiene ID por nombre del catálogo
  function idPorNombre(lista, nombre) {
    return lista.find((c) => c.nombre === nombre)?.id ?? null;
  }

  // Obtiene ID por código del catálogo
  function idPorCodigo(lista, codigo) {
    return lista.find((c) => c.codigo === codigo)?.id ?? null;
  }

  // RETORNO
  return {
    eps,
    estadosConsulta,
    estadosPaciente,
    materiales,
    parentescos,
    tiposDocumento,
    tiposLente,
    error,
    cargarEps,
    cargarEstadosConsulta,
    cargarEstadosPaciente,
    cargarMateriales,
    cargarParentescos,
    cargarTiposDocumento,
    cargarTiposLente,
    cargarCatalogosPaciente,
    idPorNombre,
    idPorCodigo,
  };
}
