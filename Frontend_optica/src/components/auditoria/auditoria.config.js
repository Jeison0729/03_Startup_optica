// ─── CONFIGURACIÓN DE AUDITORÍA ─────────────────────────
// NOTA: Las funciones badgeClass reciben la función desde la vista

export const columnas = (
  getAccionClass,
  getResultadoLabel,
  getResultadoClass,
) => [
  { titulo: "Fecha", valor: (l) => new Date(l.fechaEvento).toLocaleString() },
  { titulo: "Usuario", valor: (l) => l.usuarioNombre ?? "—" },
  {
    titulo: "Acción",
    valor: (l) => l.accion,
    tipo: "badge",
    badgeClass: (l) => getAccionClass(l.accion),
  },
  { titulo: "Descripción", valor: (l) => l.detalle, tipo: "truncado" },
  { titulo: "IP", valor: (l) => l.ip ?? "—", tipo: "ip" },
  {
    titulo: "Resultado",
    valor: (l) => getResultadoLabel(l.resultado),
    tipo: "badge",
    badgeClass: (l) => getResultadoClass(l.resultado),
  },
];

export const acciones = [];

export const filtrosSelects = (
  accionesDisponibles,
  filtroAccion,
  filtroResultado,
) => [
  {
    nombre: "accion",
    placeholder: "Todas las acciones",
    opciones: accionesDisponibles.map((a) => ({ valor: a, texto: a })),
    valorSeleccionado: filtroAccion.value,
  },
  {
    nombre: "resultado",
    placeholder: "Todos los resultados",
    opciones: [
      { valor: "1", texto: "Éxito" },
      { valor: "0", texto: "Fallo" },
    ],
    valorSeleccionado: filtroResultado.value,
  },
];
