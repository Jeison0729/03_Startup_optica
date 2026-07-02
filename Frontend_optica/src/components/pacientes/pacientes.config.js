// ─── CONFIGURACIÓN DE PACIENTES ─────────────────────────

export const columnas = [
  {
    titulo: "Documento",
    valor: (p) => `${p.tipoDocumento} ${p.numeroDocumento}`,
  },
  { titulo: "Nombres", valor: (p) => p.nombreCompleto },
  { titulo: "Fec Nacimiento", valor: (p) => p.fechaNacimiento },
  { titulo: "Teléfono", valor: (p) => p.telefono || "—" },
  { titulo: "EPS / Sisben", valor: (p) => p.eps || "—" },
  {
    titulo: "Estado",
    valor: (p) => p.estado,
    tipo: "badge",
    badgeClass: (p) => {
      const estado = p.estado?.toLowerCase() || "";
      if (estado === "activo") return "success";
      if (estado === "suspendido") return "warning";
      return "secondary";
    },
  },
  {
    titulo: "Historia Clínica",
    valor: () => "",
    tipo: "icon",
    icono: "bi-file-text-fill",
    clase: () => "text-primary fs-5 text-center d-block",
    tooltip: "Ver Historia",
    clickable: true,
    accion: "historia",
  },
];

export const acciones = [
  {
    id: "editar",
    icono: "bi-pencil-fill",
    tooltip: "Editar paciente",
    clase: "primary",
  },
  {
    id: "inactivar",
    icono: "bi-pause-circle-fill",
    tooltip: "Inactivar",
    clase: "warning",
    visible: (p) => p.estado?.toLowerCase() === "activo",
  },
  {
    id: "activar",
    icono: "bi-arrow-repeat",
    tooltip: "Activar",
    clase: "success",
    visible: (p) => p.estado?.toLowerCase() !== "activo",
  },
];

export function obtenerFiltrosSelects(catalogos, filtroEstadoId) {
  const opcionesEstados = catalogos.estadosPaciente.value.map((e) => ({
    valor: String(e.id),
    texto: e.nombre,
  }));

  return [
    {
      nombre: "estado",
      placeholder: "Todos los estados",
      opciones: opcionesEstados,
      valorSeleccionado: filtroEstadoId.value,
    },
  ];
}
