// CLASE PARA DATOS DE USUARIO (RESPUESTA)
export class Usuario {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuarioNombre = data.usuarioNombre || "";
    this.correoElectronico = data.correoElectronico || "";
    this.idEstadoUsuario = data.idEstadoUsuario || 1;
    this.estadoNombre = data.estadoNombre || "Activo";
    this.intentosFallidos = data.intentosFallidos || 0;
    this.fechaAlta = data.fechaAlta || null;
    this.roles = data.roles || [];
  }
}

// CLASE PARA SOLICITUD DE USUARIO (ENVÍO)
export class UsuarioRequest {
  constructor(data = {}) {
    this.usuarioNombre = data.usuarioNombre || "";
    this.correoElectronico = data.correoElectronico || "";
    this.contrasena = data.contrasena || "";
  }
}
