// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// COMPOSABLE DE FORMULARIO DE PACIENTE
export function usePacienteForm(catalogos, crearPaciente, actualizarPaciente) {
  // ESTADO REACTIVO
  const mostrarFormulario = ref(false);
  const pacienteEditando = ref(null);
  const errorFormulario = ref("");
  const camposFormulario = ref([]);

  // FORMULARIO
  const form = ref({
    tipoDocumento: null,
    numeroDocumento: "",
    nombreCompleto: "",
    fechaNacimiento: "",
    genero: "M",
    estadoCivil: "",
    ocupacion: "",
    direccion: "",
    telefono: "",
    eps: null,
    tipoVinculacion: "",
    estado: 1,
  });

  // FUNCIONES

  // Obtiene los campos del formulario
  function obtenerCampos() {
    return [
      {
        label: "Tipo de documento",
        nombre: "tipoDocumento",
        tipo: "select",
        placeholder: "Seleccione...",
        opciones: catalogos.tiposDocumento.value.map((c) => ({
          valor: c.id,
          texto: c.nombre,
        })),
        obligatorio: true,
      },
      {
        label: "Número de documento",
        nombre: "numeroDocumento",
        tipo: "text",
        placeholder: "Ej: 1234567890",
        obligatorio: true,
      },
      {
        label: "Nombre completo",
        nombre: "nombreCompleto",
        tipo: "text",
        placeholder: "Arturo Calle",
        obligatorio: true,
      },
      {
        label: "Fecha de nacimiento",
        nombre: "fechaNacimiento",
        tipo: "date",
        obligatorio: true,
      },
      {
        label: "Género",
        nombre: "genero",
        tipo: "select",
        placeholder: "Seleccione...",
        opciones: [
          { valor: "M", texto: "Masculino" },
          { valor: "F", texto: "Femenino" },
          { valor: "O", texto: "Otro" },
        ],
        obligatorio: true,
      },
      {
        label: "Estado civil",
        nombre: "estadoCivil",
        tipo: "text",
        placeholder: "Ej: Soltero(a)",
      },
      {
        label: "Ocupación",
        nombre: "ocupacion",
        tipo: "text",
        placeholder: "Ej: Estudiante",
      },
      {
        label: "Dirección",
        nombre: "direccion",
        tipo: "text",
        placeholder: "Dirección de residencia",
      },
      {
        label: "Teléfono",
        nombre: "telefono",
        tipo: "text",
        placeholder: "Ej: 3001234567",
      },
      {
        label: "EPS",
        nombre: "eps",
        tipo: "select",
        placeholder: "Seleccione...",
        opciones: catalogos.eps.value.map((c) => ({
          valor: c.id,
          texto: c.nombre,
        })),
      },
      {
        label: "Tipo de vinculación",
        nombre: "tipoVinculacion",
        tipo: "text",
        placeholder: "Ej: Cotizante, Beneficiario",
      },
    ];
  }

  // Abre formulario para crear nuevo paciente
  function abrirFormulario() {
    pacienteEditando.value = null;
    form.value = {
      tipoDocumento: null,
      numeroDocumento: "",
      nombreCompleto: "",
      fechaNacimiento: "",
      genero: null,
      estadoCivil: "",
      ocupacion: "",
      direccion: "",
      telefono: "",
      eps: null,
      tipoVinculacion: "",
      estado: 1,
    };
    camposFormulario.value = obtenerCampos();
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Abre formulario para editar paciente existente
  function abrirEdicion(paciente) {
    pacienteEditando.value = paciente;
    form.value = {
      tipoDocumento: catalogos.idPorNombre(
        catalogos.tiposDocumento.value,
        paciente.tipoDocumento,
      ),
      numeroDocumento: paciente.numeroDocumento,
      nombreCompleto: paciente.nombreCompleto,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      estadoCivil: paciente.estadoCivil || "",
      ocupacion: paciente.ocupacion || "",
      direccion: paciente.direccion || "",
      telefono: paciente.telefono || "",
      eps: catalogos.idPorNombre(catalogos.eps.value, paciente.eps),
      tipoVinculacion: paciente.vinculacion || "",
      estado:
        catalogos.idPorNombre(
          catalogos.estadosPaciente.value,
          paciente.estado,
        ) || 1,
    };
    camposFormulario.value = obtenerCampos();
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Cierra el formulario
  function cerrarFormulario() {
    mostrarFormulario.value = false;
    pacienteEditando.value = null;
    errorFormulario.value = "";
  }

  // Valida los campos del formulario
  function validarFormulario() {
    if (!form.value.tipoDocumento) return "Selecciona el tipo de documento.";
    if (!form.value.numeroDocumento.trim())
      return "El número de documento es obligatorio.";
    if (!form.value.nombreCompleto.trim())
      return "El nombre completo es obligatorio.";
    if (!form.value.fechaNacimiento)
      return "La fecha de nacimiento es obligatoria.";
    if (!form.value.genero) return "Selecciona el género.";
    return null;
  }

  // Construye payload para enviar a la API
  function construirPayload() {
    return {
      tipoDocumento: form.value.tipoDocumento,
      numeroDocumento: form.value.numeroDocumento,
      nombreCompleto: form.value.nombreCompleto,
      fechaNacimiento: form.value.fechaNacimiento,
      genero: form.value.genero,
      estadoCivil: form.value.estadoCivil || null,
      ocupacion: form.value.ocupacion || null,
      direccion: form.value.direccion || null,
      telefono: form.value.telefono || null,
      eps: form.value.eps || null,
      tipoVinculacion: form.value.tipoVinculacion || null,
      estado: pacienteEditando.value ? form.value.estado : 1,
    };
  }

  // Guarda el paciente (crea o actualiza)
  async function guardar() {
    errorFormulario.value = "";
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      errorFormulario.value = errorValidacion;
      return;
    }

    const payload = construirPayload();
    const resultado = pacienteEditando.value
      ? await actualizarPaciente(pacienteEditando.value.id, payload)
      : await crearPaciente(payload);

    if (resultado === true) {
      cerrarFormulario();
    } else {
      errorFormulario.value = resultado;
    }
  }

  // RETORNO
  return {
    mostrarFormulario,
    pacienteEditando,
    errorFormulario,
    camposFormulario,
    form,
    abrirFormulario,
    abrirEdicion,
    cerrarFormulario,
    guardar,
  };
}
