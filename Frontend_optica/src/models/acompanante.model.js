// CLASE PARA SOLICITUD DE ACOMPAÑANTE
export class AcompananteRequest {
  constructor(data = {}) {
    this.idConsulta = data.idConsulta || null;
    this.nombre = data.nombre || "";
    this.parentesco = data.parentesco || null;
    this.telefono = data.telefono || "";
  }
}
