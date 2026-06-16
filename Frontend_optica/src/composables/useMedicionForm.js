// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// COMPOSABLE DE FORMULARIO DE MEDICIÓN
export function useMedicionForm(catalogos, guardarMedicion) {
  // ESTADO REACTIVO
  const mostrarFormulario = ref(true);
  const medicionEditando = ref(null);
  const errorFormulario = ref("");
  const camposFormulario = ref([]);
  const cargandoGuardado = ref(false);

  // FORMULARIO
  const form = ref({
    idConsulta: null,
    rxUsoOdEsfera: null,
    rxUsoOdCilindro: null,
    rxUsoOdEje: null,
    rxUsoOdAvVl: "",
    rxUsoOiEsfera: null,
    rxUsoOiCilindro: null,
    rxUsoOiEje: null,
    rxUsoOiAvVl: "",
    vpOd: "",
    vpOi: "",
    lenteUso: "",
    kmOd: "",
    kmOdObservaciones: "",
    kmOi: "",
    kmOiObservaciones: "",
    rxOd: "",
    rxOdObservaciones: "",
    rxOi: "",
    rxOiObservaciones: "",
    modalidadPpc: "",
    modalidadLejos: "",
    modalidadCerca: "",
    testTitmus: "",
    odEsfera: null,
    odCilindro: null,
    odEje: null,
    odAvVl: "",
    oiEsfera: null,
    oiCilindro: null,
    oiEje: null,
    oiAvVl: "",
    adicion: null,
    distanciaPupilar: "",
    idMaterial: null,
    idTipoLente: null,
    observacionesRx: "",
  });

  // FUNCIONES

  // Construye los campos del formulario
  function construirCampos() {
    return [
      { tipo: "section", label: "Rx en Uso" },
      {
        label: "OD Esfera",
        nombre: "rxUsoOdEsfera",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: -2.00",
      },
      {
        label: "OD Cilindro",
        nombre: "rxUsoOdCilindro",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: -2.00",
      },
      {
        label: "OD Eje",
        nombre: "rxUsoOdEje",
        tipo: "number",
        min: 0,
        max: 180,
        placeholder: "Ej: 180",
      },
      {
        label: "OD AV VL",
        nombre: "rxUsoOdAvVl",
        tipo: "text",
        placeholder: "Ej: 20/20",
      },
      {
        label: "OI Esfera",
        nombre: "rxUsoOiEsfera",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: -1.50",
      },
      {
        label: "OI Cilindro",
        nombre: "rxUsoOiCilindro",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: -0.50",
      },
      {
        label: "OI Eje",
        nombre: "rxUsoOiEje",
        tipo: "number",
        min: 0,
        max: 180,
        placeholder: "Ej: 175",
      },
      {
        label: "OI AV VL",
        nombre: "rxUsoOiAvVl",
        tipo: "text",
        placeholder: "Ej: 20/25",
      },
      { tipo: "section", label: "Visión Próxima" },
      {
        label: "VP OD",
        nombre: "vpOd",
        tipo: "text",
        placeholder: "Ej: 20/40",
      },
      {
        label: "VP OI",
        nombre: "vpOi",
        tipo: "text",
        placeholder: "Ej: 20/40",
      },
      {
        label: "Lente en uso",
        nombre: "lenteUso",
        tipo: "text",
        placeholder: "Ej: Monofocal, Bifocal",
      },
      { tipo: "section", label: "Queratometría" },
      {
        label: "KM OD",
        nombre: "kmOd",
        tipo: "text",
        placeholder: "Ej: 42.00 @ 180",
      },
      {
        label: "Observaciones KM OD",
        nombre: "kmOdObservaciones",
        tipo: "textarea",
      },
      {
        label: "KM OI",
        nombre: "kmOi",
        tipo: "text",
        placeholder: "Ej: 42.50 @ 5",
      },
      {
        label: "Observaciones KM OI",
        nombre: "kmOiObservaciones",
        tipo: "textarea",
      },
      {
        tipo: "section",
        label: "Refracción Intermedia",
      },
      {
        label: "Rx OD",
        nombre: "rxOd",
        tipo: "text",
        placeholder: "Ej: -1.75 -0.50 x 180",
      },
      {
        label: "Observaciones Rx OD",
        nombre: "rxOdObservaciones",
        tipo: "textarea",
      },
      {
        label: "Rx OI",
        nombre: "rxOi",
        tipo: "text",
        placeholder: "Ej: -1.25 -0.25 x 175",
      },
      {
        label: "Observaciones Rx OI",
        nombre: "rxOiObservaciones",
        tipo: "textarea",
      },
      { tipo: "section", label: "Modalidad" },
      {
        label: "PPC",
        nombre: "modalidadPpc",
        tipo: "text",
        placeholder: "Ej: Orto",
      },
      {
        label: "Lejos",
        nombre: "modalidadLejos",
        tipo: "text",
        placeholder: "Ej: Orto",
      },
      {
        label: "Cerca",
        nombre: "modalidadCerca",
        tipo: "text",
        placeholder: "Ej: Endoforia",
      },
      {
        label: "Test Titmus",
        nombre: "testTitmus",
        tipo: "text",
        placeholder: "Ej: 40 segundos de arco",
      },
      { tipo: "section", label: "Rx Final" },
      {
        label: "OD Esfera",
        nombre: "odEsfera",
        tipo: "number",
        step: "0.25",
        obligatorio: true,
        placeholder: "Ej: -2.00",
      },
      {
        label: "OD Cilindro",
        nombre: "odCilindro",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: -0.75",
      },
      {
        label: "OD Eje",
        nombre: "odEje",
        tipo: "number",
        min: 0,
        max: 180,
        placeholder: "Ej: 180",
      },
      {
        label: "OD AV VL",
        nombre: "odAvVl",
        tipo: "text",
        placeholder: "Ej: 20/20",
      },
      {
        label: "OI Esfera",
        nombre: "oiEsfera",
        tipo: "number",
        step: "0.25",
        obligatorio: true,
        placeholder: "	Ej: -1.50",
      },
      {
        label: "OI Cilindro",
        nombre: "oiCilindro",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: -0.50",
      },
      {
        label: "OI Eje",
        nombre: "oiEje",
        tipo: "number",
        min: 0,
        max: 180,
        placeholder: "Ej: 175",
      },
      {
        label: "OI AV VL",
        nombre: "oiAvVl",
        tipo: "text",
        placeholder: "Ej: 20/25",
      },
      { tipo: "section", label: "Complementarios" },
      {
        label: "Adición",
        nombre: "adicion",
        tipo: "number",
        step: "0.25",
        placeholder: "Ej: +2.00",
      },
      {
        label: "Distancia Pupilar",
        nombre: "distanciaPupilar",
        tipo: "text",
        placeholder: "Ej: 64/62",
      },
      {
        label: "Material",
        nombre: "idMaterial",
        tipo: "select",
        placeholder: "Seleccione...",
        opciones: catalogos.materiales.value.map((m) => ({
          valor: m.id,
          texto: m.nombre,
        })),
      },
      {
        label: "Tipo de lente",
        nombre: "idTipoLente",
        tipo: "select",
        placeholder: "Seleccione...",
        opciones: catalogos.tiposLente.value.map((t) => ({
          valor: t.id,
          texto: t.nombre,
        })),
      },
      {
        label: "Observaciones",
        nombre: "observacionesRx",
        tipo: "textarea",
      },
    ];
  }

  // Abre el formulario para crear/editar medición
  function abrirFormulario(idConsulta, medicionExistente = null) {
    medicionEditando.value = medicionExistente;
    if (medicionExistente) {
      form.value = { ...medicionExistente, idConsulta };
    } else {
      form.value = {
        idConsulta,
        rxUsoOdEsfera: null,
        rxUsoOdCilindro: null,
        rxUsoOdEje: null,
        rxUsoOdAvVl: "",
        rxUsoOiEsfera: null,
        rxUsoOiCilindro: null,
        rxUsoOiEje: null,
        rxUsoOiAvVl: "",
        vpOd: "",
        vpOi: "",
        lenteUso: "",
        kmOd: "",
        kmOdObservaciones: "",
        kmOi: "",
        kmOiObservaciones: "",
        rxOd: "",
        rxOdObservaciones: "",
        rxOi: "",
        rxOiObservaciones: "",
        modalidadPpc: "",
        modalidadLejos: "",
        modalidadCerca: "",
        testTitmus: "",
        odEsfera: null,
        odCilindro: null,
        odEje: null,
        odAvVl: "",
        oiEsfera: null,
        oiCilindro: null,
        oiEje: null,
        oiAvVl: "",
        adicion: null,
        distanciaPupilar: "",
        idMaterial: null,
        idTipoLente: null,
        observacionesRx: "",
      };
    }
    camposFormulario.value = construirCampos();
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Cierra el formulario
  function cerrarFormulario() {
    mostrarFormulario.value = false;
    medicionEditando.value = null;
    errorFormulario.value = "";
  }

  // Guarda la medición
  async function guardar() {
    errorFormulario.value = "";
    cargandoGuardado.value = true;
    const payload = { ...form.value };
    const resultado = await guardarMedicion(payload, !!medicionEditando.value);
    cargandoGuardado.value = false;
    if (resultado) {
      cerrarFormulario();
    }
  }

  // RETORNO
  return {
    mostrarFormulario,
    form,
    camposFormulario,
    errorFormulario,
    cargandoGuardado,
    abrirFormulario,
    cerrarFormulario,
    guardar,
  };
}
