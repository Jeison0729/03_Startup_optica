// ─── CONFIGURACIÓN DE CONSULTAS ─────────────────────────
// Columnas, acciones y configuración de UI para la tabla de consultas

export const columnas = [
  { titulo: "Paciente", valor: (c) => c.paciente },
  { titulo: "Optómetra", valor: (c) => c.optometra },
  { titulo: "Fecha", valor: (c) => new Date(c.fechaConsulta).toLocaleString() },
  {
    titulo: "Motivo",
    valor: (c) => c.motivoConsulta,
    tipo: "truncado",
    width: "180px",
  },
  {
    titulo: "Archivos",
    valor: () => "",
    tipo: "icon",
    icono: (c) => {
      const tieneArchivos = c.totalArchivos > 0;
      return tieneArchivos ? "bi-paperclip-fill" : "bi-paperclip";
    },
    clase: (c) => {
      const tieneArchivos = c.totalArchivos > 0;
      return tieneArchivos ? "text-success" : "text-muted";
    },
    tooltip: (c) => {
      const tieneArchivos = c.totalArchivos > 0;
      return tieneArchivos
        ? `${c.totalArchivos} archivo(s) adjunto(s)`
        : "Sin archivos adjuntos";
    },
    accion: "archivos",
  },
  {
    titulo: "Medición",
    valor: () => "",
    tipo: "icon",
    icono: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      const noEditable = estado === "finalizada" || estado === "anulada";
      if (noEditable) return "bi-eye-fill";
      if (c.idMedicion) return "bi-pencil-square";
      return "bi-clipboard-plus-fill";
    },
    clase: () => "text-primary",
    tooltip: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      const noEditable = estado === "finalizada" || estado === "anulada";
      if (noEditable) return "Ver medición";
      if (c.idMedicion) return "Actualizar medición";
      return "Registrar medición";
    },
    accion: "mediciones",
  },
  {
    titulo: "Estado",
    valor: (c) => {
      const estado = c.estado || "";
      if (estado === "EN_PROCESO") return "En proceso";
      if (estado === "FINALIZADA") return "Finalizada";
      if (estado === "ANULADA") return "Anulada";
      return estado;
    },
    tipo: "badge",
    badgeClass: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      if (estado === "finalizada") return "success";
      if (estado === "en_proceso") return "warning";
      if (estado === "anulada") return "danger";
      return "secondary";
    },
  },
];

export const acciones = [
  {
    id: "ver",
    icono: "bi-eye-fill",
    tooltip: "Detalle Consulta",
    clase: "primary",
    visible: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      return estado === "finalizada" || estado === "anulada";
    },
  },
  {
    id: "archivos",
    icono: "bi-folder2-open",
    tooltip: "Ver archivos adjuntos",
    clase: "info",
    visible: (c) => c.totalArchivos > 0,
  },
  {
    id: "editar",
    icono: "bi-pencil-square",
    tooltip: "Editar Consulta",
    clase: "primary",
    visible: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      return estado === "borrador" || estado === "en_proceso";
    },
  },
  {
    id: "finalizar",
    icono: "bi-check2-circle",
    tooltip: "Finalizar Consulta",
    clase: "primary",
    visible: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      return estado === "en_proceso";
    },
  },
  {
    id: "anular",
    icono: "bi-x-circle-fill",
    tooltip: "Anular consulta",
    clase: "primary",
    visible: (c) => {
      const estado = c.estado?.toLowerCase() || "";
      return estado === "borrador" || estado === "en_proceso";
    },
  },
];

// Función para obtener los filtros según los valores actuales
export function obtenerFiltrosSelects(catalogos, filtroEstado, filtroRango) {
  const opcionesEstados = catalogos.estadosConsulta.value.map((e) => ({
    valor: String(e.id),
    texto: e.nombre,
  }));

  return [
    {
      nombre: "estado",
      placeholder: "Todos los estados",
      opciones: opcionesEstados,
      valorSeleccionado: filtroEstado.value,
    },
    {
      nombre: "rango",
      placeholder: "Todas las fechas",
      opciones: [
        { valor: "hoy", texto: "Hoy" },
        { valor: "semana", texto: "Última semana" },
        { valor: "mes", texto: "Último mes" },
      ],
      valorSeleccionado: filtroRango.value,
    },
  ];
}
