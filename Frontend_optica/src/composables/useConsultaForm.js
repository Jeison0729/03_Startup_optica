// DEPENDENCIAS E IMPORTACIONES
import { ref, watch } from "vue";
import { useAuthStore } from "../stores/auth.store";

// COMPOSABLE DE FORMULARIO DE CONSULTA
export function useConsultaForm(
  catalogos,
  pacienteSelector,
  crearConsulta,
  actualizarConsulta,
  crearAcompanante,
) {
  // INICIALIZACIÓN
  const auth = useAuthStore();

  // ESTADO REACTIVO
  const mostrarFormulario = ref(false);
  const consultaEditando = ref(null);
  const errorFormulario = ref("");
  const camposFormulario = ref([]);
  const incluyeAcompanante = ref(false);

  // FORMULARIO
  const form = ref({
    numDocumento: "",
    pacienteNombre: "",
    paciente: null,
    motivoConsulta: "",
    ultimoControl: "",
    antecedentes: "",
    antecedentesFamiliares: "",
    examenExterno: "",
    tonometriaOd: "",
    tonometriaOi: "",
    testColor: "",
    fondoOjo: "",
    diagnostico: "",
    conducta: "",
    controlSugerido: "",
    remision: "",
    estado: 1,
    acompananteNombre: "",
    acompananteParentesco: null,
    acompananteTelefono: "",
  });

  // FUNCIONES

  // Construye los campos del formulario según el estado
  function construirCampos() {
    const campos = [
      { tipo: "section", label: "Datos de la Consulta" },
      {
        label: "Número de documento",
        nombre: "numDocumento",
        tipo: "text",
        placeholder: "Ej: 1234567890",
        obligatorio: true,
      },
      {
        label: "Nombre completo",
        nombre: "pacienteNombre",
        tipo: "text",
        placeholder: "Nombre se autocompleta",
        soloLectura: true,
      },
      {
        label: "Motivo de consulta",
        nombre: "motivoConsulta",
        tipo: "text",
        placeholder: "Ej: Control anual, Dolor de cabeza, Visión borrosa",
        obligatorio: true,
      },
      {
        label: "Último control",
        nombre: "ultimoControl",
        tipo: "text",
        placeholder: "Ej: hace 1 año",
      },
      { tipo: "section", label: "Antecedentes" },
      {
        label: "Antecedentes personales",
        nombre: "antecedentes",
        tipo: "text",
        placeholder: "Ej: Diabetes, Hipertensión, Cirugías",
      },
      {
        label: "Antecedentes familiares",
        nombre: "antecedentesFamiliares",
        tipo: "text",
        placeholder: "Ej: Glaucoma en padres, Cataratas",
      },
      { tipo: "section", label: "Examen Óptico" },
      {
        label: "Examen externo",
        nombre: "examenExterno",
        tipo: "text",
        placeholder: "Ej: Párpados normales, Conjuntiva rosada",
      },
      {
        label: "Tonometría OD",
        nombre: "tonometriaOd",
        tipo: "text",
        placeholder: "Ej: 14 mmHg",
      },
      {
        label: "Tonometría OI",
        nombre: "tonometriaOi",
        tipo: "text",
        placeholder: "Ej: 15 mmHg",
      },
      {
        label: "Test de color",
        nombre: "testColor",
        tipo: "text",
        placeholder: "Ej: Normal, Anomalía rojo-verde",
      },
      {
        label: "Fondo de ojo",
        nombre: "fondoOjo",
        tipo: "text",
        placeholder: "Ej: Retina normal, Papila rosada",
      },
      { tipo: "section", label: "Diagnóstico y Conducta" },
      {
        label: "Diagnóstico",
        nombre: "diagnostico",
        tipo: "text",
        placeholder: "Ej: Miopía progresiva",
      },
      {
        label: "Conducta",
        nombre: "conducta",
        tipo: "text",
        placeholder: "Ej: Remisión a especialista",
      },
      {
        label: "Control sugerido",
        nombre: "controlSugerido",
        tipo: "text",
        placeholder: "Ej: En 6 meses",
      },
      {
        label: "Remisión",
        nombre: "remision",
        tipo: "text",
        placeholder: "Ej: Dr. Pérez - Oftalmólogo",
      },
    ];

    // Agrega campos de acompañante si está activado
    if (incluyeAcompanante.value) {
      campos.push(
        { tipo: "section", label: "Datos del Acompañante" },
        {
          label: "Nombre del acompañante",
          nombre: "acompananteNombre",
          tipo: "text",
          placeholder: "Ej: María González",
          obligatorio: true,
        },
        {
          label: "Parentesco",
          nombre: "acompananteParentesco",
          tipo: "select",
          placeholder: "Seleccione...",
          opciones: catalogos.parentescos.value.map((p) => ({
            valor: p.id,
            texto: p.nombre,
          })),
        },
        {
          label: "Teléfono del acompañante",
          nombre: "acompananteTelefono",
          tipo: "text",
          placeholder: "Ej: 3001234567",
        },
      );
    }
    return campos;
  }

  // Resetea el formulario a valores iniciales
  function resetForm() {
    form.value = {
      numDocumento: "",
      pacienteNombre: "",
      paciente: null,
      motivoConsulta: "",
      ultimoControl: "",
      antecedentes: "",
      antecedentesFamiliares: "",
      examenExterno: "",
      tonometriaOd: "",
      tonometriaOi: "",
      testColor: "",
      fondoOjo: "",
      diagnostico: "",
      conducta: "",
      controlSugerido: "",
      remision: "",
      estado: 1,
      acompananteNombre: "",
      acompananteParentesco: null,
      acompananteTelefono: "",
    };
  }

  // Abre el formulario para crear nueva consulta
  function abrirFormulario() {
    consultaEditando.value = null;
    incluyeAcompanante.value = false;
    pacienteSelector.busquedaNombre.value = "";
    resetForm();
    camposFormulario.value = construirCampos();
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Abre el formulario para editar consulta existente
  function abrirEdicion(
    consulta,
    idPacienteReal,
    pacienteDocumento,
    pacienteNombreCompleto,
  ) {
    consultaEditando.value = consulta;
    incluyeAcompanante.value = false;
    pacienteSelector.busquedaNombre.value = "";
    form.value = {
      numDocumento: pacienteDocumento || "",
      pacienteNombre: pacienteNombreCompleto || "",
      paciente: idPacienteReal,
      motivoConsulta: consulta.motivoConsulta || "",
      ultimoControl: consulta.ultimoControl || "",
      antecedentes: consulta.antecedentes || "",
      antecedentesFamiliares: consulta.antecedentesFamiliares || "",
      examenExterno: consulta.examenExterno || "",
      tonometriaOd: consulta.tonometriaOd || "",
      tonometriaOi: consulta.tonometriaOi || "",
      testColor: consulta.testColor || "",
      fondoOjo: consulta.fondoOjo || "",
      diagnostico: consulta.diagnostico || "",
      conducta: consulta.conducta || "",
      controlSugerido: consulta.controlSugerido || "",
      remision: consulta.remision || "",
      estado: 1,
      acompananteNombre: "",
      acompananteParentesco: null,
      acompananteTelefono: "",
    };
    camposFormulario.value = construirCampos();
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Cierra el formulario
  function cerrarFormulario() {
    mostrarFormulario.value = false;
    consultaEditando.value = null;
    incluyeAcompanante.value = false;
    errorFormulario.value = "";
  }

  // Valida los campos del formulario
  function validarFormulario() {
    if (!form.value.numDocumento || !form.value.paciente)
      return "Documento no encontrado. Verifique el número de documento.";
    if (!form.value.motivoConsulta.trim())
      return "El motivo de consulta es obligatorio.";
    if (incluyeAcompanante.value && !form.value.acompananteNombre.trim()) {
      return "El nombre del acompañante es obligatorio.";
    }
    return null;
  }

  // Construye payload para la consulta
  function construirPayloadConsulta() {
    return {
      paciente: form.value.paciente,
      optometra: auth.idUsuario,
      motivoConsulta: form.value.motivoConsulta,
      ultimoControl: form.value.ultimoControl || null,
      antecedentes: form.value.antecedentes || null,
      antecedentesFamiliares: form.value.antecedentesFamiliares || null,
      examenExterno: form.value.examenExterno || null,
      tonometriaOd: form.value.tonometriaOd || null,
      tonometriaOi: form.value.tonometriaOi || null,
      testColor: form.value.testColor || null,
      fondoOjo: form.value.fondoOjo || null,
      diagnostico: form.value.diagnostico || null,
      conducta: form.value.conducta || null,
      controlSugerido: form.value.controlSugerido || null,
      remision: form.value.remision || null,
      estado: form.value.estado,
      fechaCierre: null,
    };
  }

  // Construye payload para el acompañante
  function construirPayloadAcompanante(idConsulta) {
    return {
      idConsulta,
      nombre: form.value.acompananteNombre,
      parentesco: form.value.acompananteParentesco,
      telefono: form.value.acompananteTelefono || null,
    };
  }

  // WATCH: Busca paciente automáticamente al escribir el documento
  watch(
    () => form.value.numDocumento,
    (nuevoDocumento) => {
      if (!nuevoDocumento || nuevoDocumento.trim() === "") {
        form.value.pacienteNombre = "";
        form.value.paciente = null;
        return;
      }

      const encontrado = pacienteSelector.pacientesDisponibles.value.find(
        (p) => p.numeroDocumento === nuevoDocumento.trim(),
      );

      if (encontrado) {
        form.value.pacienteNombre = encontrado.nombreCompleto;
        form.value.paciente = encontrado.id;
      } else {
        form.value.pacienteNombre = "";
        form.value.paciente = null;
      }
    },
  );

  // WATCH: Reconstruye campos cuando cambian dependencias
  watch(
    [
      () => pacienteSelector.busquedaNombre.value,
      incluyeAcompanante,
      () => catalogos.parentescos.value,
    ],
    () => {
      if (mostrarFormulario.value) {
        camposFormulario.value = construirCampos();
      }
    },
  );

  // Guarda la consulta (crea o actualiza)
  async function guardar(onMedicionesPendientes) {
    errorFormulario.value = "";
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      errorFormulario.value = errorValidacion;
      return;
    }

    // Edición
    if (consultaEditando.value) {
      const payload = construirPayloadConsulta();
      const resultado = await actualizarConsulta(
        consultaEditando.value.id,
        payload,
      );
      if (resultado === true) {
        cerrarFormulario();
        if (onMedicionesPendientes) onMedicionesPendientes(null, true);
      } else {
        errorFormulario.value = resultado;
      }
      return;
    }

    // Creación
    const payload = construirPayloadConsulta();
    const nuevaConsulta = await crearConsulta(payload);

    if (!nuevaConsulta) {
      errorFormulario.value = "Error al crear la consulta.";
      return;
    }

    // Crea acompañante si está marcado
    if (incluyeAcompanante.value) {
      const payloadAcomp = construirPayloadAcompanante(nuevaConsulta.id);
      await crearAcompanante(payloadAcomp);
    }

    cerrarFormulario();

    if (onMedicionesPendientes) {
      onMedicionesPendientes(nuevaConsulta.id, false);
    }
  }

  // RETORNO
  return {
    mostrarFormulario,
    consultaEditando,
    errorFormulario,
    camposFormulario,
    form,
    incluyeAcompanante,
    abrirFormulario,
    abrirEdicion,
    cerrarFormulario,
    guardar,
  };
}
