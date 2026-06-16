// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// COMPOSABLE DE FORMULARIO DE USUARIO
export function useUsuarioForm(
  rolesSinDev,
  crearUsuario,
  actualizarUsuario,
  cambiarRol,
) {
  // ESTADO REACTIVO
  const mostrarFormulario = ref(false);
  const usuarioEditando = ref(null);
  const errorFormulario = ref("");
  const camposFormulario = ref([]);

  // FORMULARIO PRINCIPAL
  const form = ref({
    usuarioNombre: "",
    correoElectronico: "",
    contrasena: "",
    idRol: null,
  });

  // ESTADO PARA CAMBIO DE ROL
  const mostrarCambioRol = ref(false);
  const usuarioCambioRol = ref(null);
  const camposCambioRol = ref([]);
  const formCambioRol = ref({ idRol: null });

  // FUNCIONES

  // Obtiene campos base del formulario
  function obtenerCamposBase() {
    return [
      {
        label: "Nombre",
        nombre: "usuarioNombre",
        tipo: "text",
        placeholder: "Ej: empleado_04",
        obligatorio: true,
      },
      {
        label: "Correo electrónico",
        nombre: "correoElectronico",
        tipo: "email",
        placeholder: "correo@ejemplo.com",
        obligatorio: true,
      },
      {
        label: "Contraseña",
        nombre: "contrasena",
        tipo: "password",
        placeholder: "Mínimo 6 caracteres",
        obligatorio: true,
      },
    ];
  }

  // Abre formulario para crear nuevo usuario
  function abrirFormulario() {
    usuarioEditando.value = null;
    form.value = {
      usuarioNombre: "",
      correoElectronico: "",
      contrasena: "",
      idRol: null,
    };
    camposFormulario.value = obtenerCamposBase();
    camposFormulario.value.push({
      label: "Rol",
      nombre: "idRol",
      tipo: "select",
      placeholder: "Seleccione...",
      opciones: rolesSinDev.value.map((r) => ({
        valor: r.id,
        texto: r.nombre,
      })),
      obligatorio: true,
    });
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Abre formulario para editar usuario existente
  function abrirEdicion(usuario) {
    usuarioEditando.value = usuario;
    form.value = {
      usuarioNombre: usuario.usuarioNombre,
      correoElectronico: usuario.correoElectronico,
      contrasena: "",
      idRol: null,
    };
    camposFormulario.value = obtenerCamposBase();
    errorFormulario.value = "";
    mostrarFormulario.value = true;
  }

  // Cierra formulario
  function cerrarFormulario() {
    mostrarFormulario.value = false;
    usuarioEditando.value = null;
    errorFormulario.value = "";
  }

  // Valida campos del formulario
  function validarFormulario() {
    if (
      !form.value.usuarioNombre.trim() ||
      !form.value.correoElectronico.trim()
    ) {
      return "Nombre y correo son obligatorios.";
    }
    if (!usuarioEditando.value) {
      if (!form.value.contrasena.trim() || form.value.contrasena.length < 6) {
        return "La contraseña es obligatoria y debe tener mínimo 6 caracteres.";
      }
      if (!form.value.idRol) {
        return "Selecciona un rol.";
      }
    } else if (
      form.value.contrasena.trim() &&
      form.value.contrasena.length < 6
    ) {
      return "La nueva contraseña debe tener mínimo 6 caracteres.";
    }
    return null;
  }

  // Construye payload para API
  function construirPayload() {
    const payload = {
      usuarioNombre: form.value.usuarioNombre,
      correoElectronico: form.value.correoElectronico,
    };
    if (form.value.contrasena.trim()) {
      payload.contrasena = form.value.contrasena;
    }
    return payload;
  }

  // Guarda usuario (crea o actualiza)
  async function guardar() {
    errorFormulario.value = "";
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      errorFormulario.value = errorValidacion;
      return;
    }

    const payload = construirPayload();
    const resultado = usuarioEditando.value
      ? await actualizarUsuario(usuarioEditando.value.id, payload)
      : await crearUsuario(payload, form.value.idRol);

    if (resultado === true) {
      cerrarFormulario();
    } else {
      errorFormulario.value = resultado;
    }
  }

  // Abre modal para cambiar rol
  function abrirCambioRol(usuario, roles) {
    usuarioCambioRol.value = usuario;
    const rolActual = roles.find((r) => r.nombre === usuario.roles?.[0]);
    formCambioRol.value = { idRol: rolActual?.id || null };
    camposCambioRol.value = [
      {
        label: "Nuevo Rol",
        nombre: "idRol",
        tipo: "select",
        placeholder: "Seleccione...",
        opciones: rolesSinDev.value.map((r) => ({
          valor: r.id,
          texto: r.nombre,
        })),
        obligatorio: true,
      },
    ];
    errorFormulario.value = "";
    mostrarCambioRol.value = true;
  }

  // Cierra modal de cambio de rol
  function cerrarCambioRol() {
    mostrarCambioRol.value = false;
    usuarioCambioRol.value = null;
    errorFormulario.value = "";
  }

  // Confirma cambio de rol
  async function confirmarCambioRol() {
    if (!usuarioCambioRol.value) return;
    if (!formCambioRol.value.idRol) {
      errorFormulario.value = "Selecciona un rol.";
      return;
    }
    const resultado = await cambiarRol(
      usuarioCambioRol.value.id,
      formCambioRol.value.idRol,
      usuarioCambioRol.value.usuarioNombre,
    );
    if (resultado === true) {
      cerrarCambioRol();
    } else {
      errorFormulario.value = resultado;
    }
  }

  // RETORNO
  return {
    mostrarFormulario,
    usuarioEditando,
    errorFormulario,
    camposFormulario,
    form,
    mostrarCambioRol,
    usuarioCambioRol,
    camposCambioRol,
    formCambioRol,
    abrirFormulario,
    abrirEdicion,
    cerrarFormulario,
    guardar,
    abrirCambioRol,
    cerrarCambioRol,
    confirmarCambioRol,
  };
}
