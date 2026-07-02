// CLASE PARA DATOS DE PACIENTE (RESPUESTA)
export class Paciente {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tipoDocumento = data.tipoDocumento || "";
    this.numeroDocumento = data.numeroDocumento || "";
    this.nombreCompleto = data.nombreCompleto || "";
    this.fechaNacimiento = data.fechaNacimiento || "";
    this.genero = data.genero || "";
    this.estadoCivil = data.estadoCivil || "";
    this.ocupacion = data.ocupacion || "";
    this.direccion = data.direccion || "";
    this.telefono = data.telefono || "";
    this.eps = data.eps || "";
    this.vinculacion = data.vinculacion || "";
    this.estado = data.estado || "";
    this.fechaRegistro = data.fechaRegistro || null;
  }
}

// CLASE PARA SOLICITUD DE PACIENTE (ENVÍO)
export class PacienteRequest {
  constructor(data = {}) {
    this.tipoDocumento = data.tipoDocumento || null;
    this.numeroDocumento = data.numeroDocumento || "";
    this.nombreCompleto = data.nombreCompleto || "";
    this.fechaNacimiento = data.fechaNacimiento || "";
    this.genero = data.genero || "M";
    this.estadoCivil = data.estadoCivil || "";
    this.ocupacion = data.ocupacion || "";
    this.direccion = data.direccion || "";
    this.telefono = data.telefono || "";
    this.eps = data.eps || null;
    this.tipoVinculacion = data.tipoVinculacion || "";
    this.estado = data.estado || 1;
  }
}
