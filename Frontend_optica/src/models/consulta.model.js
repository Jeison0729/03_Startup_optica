// CLASE PARA DATOS DE CONSULTA (RESPUESTA)
export class Consulta {
  constructor(data = {}) {
    this.id = data.id || null;
    this.idPaciente = data.idPaciente || null;
    this.paciente = data.paciente || "";
    this.optometra = data.optometra || "";
    this.fechaConsulta = data.fechaConsulta || null;
    this.motivoConsulta = data.motivoConsulta || "";
    this.ultimoControl = data.ultimoControl || "";
    this.antecedentes = data.antecedentes || "";
    this.antecedentesFamiliares = data.antecedentesFamiliares || "";
    this.examenExterno = data.examenExterno || "";
    this.tonometriaOd = data.tonometriaOd || "";
    this.tonometriaOi = data.tonometriaOi || "";
    this.testColor = data.testColor || "";
    this.fondoOjo = data.fondoOjo || "";
    this.diagnostico = data.diagnostico || "";
    this.conducta = data.conducta || "";
    this.controlSugerido = data.controlSugerido || "";
    this.remision = data.remision || "";
    this.estado = data.estado || "";
    this.fechaCierre = data.fechaCierre || null;
    this.idMedicion = data.idMedicion || null;
    this.totalArchivos = data.totalArchivos || 0;
  }
}

// CLASE PARA SOLICITUD DE CONSULTA (ENVÍO)
export class ConsultaRequest {
  constructor(data = {}) {
    this.paciente = data.idPaciente || null;
    this.optometra = data.optometra || null;
    this.motivoConsulta = data.motivoConsulta || "";
    this.ultimoControl = data.ultimoControl || "";
    this.antecedentes = data.antecedentes || "";
    this.antecedentesFamiliares = data.antecedentesFamiliares || "";
    this.examenExterno = data.examenExterno || "";
    this.tonometriaOd = data.tonometriaOd || "";
    this.tonometriaOi = data.tonometriaOi || "";
    this.testColor = data.testColor || "";
    this.fondoOjo = data.fondoOjo || "";
    this.diagnostico = data.diagnostico || "";
    this.conducta = data.conducta || "";
    this.controlSugerido = data.controlSugerido || "";
    this.remision = data.remision || "";
    this.estado = data.estado || 1;
    this.fechaCierre = data.fechaCierre || null;
  }
}
