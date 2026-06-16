// DEPENDENCIAS E IMPORTACIONES
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth.store";
import {
  listarUsuariosApi,
  crearUsuarioApi,
  actualizarUsuarioApi,
  eliminarUsuarioApi,
  bloquearUsuarioApi,
  desbloquearUsuarioApi,
  reactivarUsuarioApi,
} from "../api/usuarios.api";
import { listarRolesApi } from "../api/roles.api";
import { cambiarRolApi } from "../api/usuariosRoles.api";

// COMPOSABLE DE USUARIOS
export function useUsuarios() {
  // INICIALIZACIÓN
  const auth = useAuthStore();
  const esDev = computed(() => auth.rol === "ROLE_DEV");

  // ESTADO REACTIVO
  const usuarios = ref([]);
  const roles = ref([]);
  const cargando = ref(false);
  const error = ref("");
  const mensaje = ref("");

  // COMPUTADOS
  const rolesSinDev = computed(() =>
    roles.value.filter((r) => r.nombre !== "ROLE_DEV"),
  );

  // FUNCIONES

  // Verifica si puede modificar una fila
  function puedeModificarFila(u) {
    if (!esDev.value) return false;
    return u.usuarioNombre !== auth.usuario;
  }

  // Carga lista de roles
  async function cargarRoles() {
    if (!esDev.value) return;
    try {
      const { data } = await listarRolesApi();
      roles.value = data || [];
    } catch {
      error.value = "Error al cargar roles.";
    }
  }

  // Carga lista de usuarios según rol
  async function cargarUsuarios() {
    cargando.value = true;
    error.value = "";
    try {
      const { data } = await listarUsuariosApi();
      const lista = data || [];

      if (esDev.value) {
        usuarios.value = lista;
      } else if (auth.rol === "ROLE_ADMIN") {
        usuarios.value = lista.filter((u) => {
          const noEsInactivo = u.estadoUsuario?.toUpperCase() !== "INACTIVO";
          const rolFila = u.roles?.[0];
          const esInferior = rolFila !== "ROLE_DEV" && rolFila !== "ROLE_ADMIN";
          return noEsInactivo && esInferior;
        });
      }
    } catch {
      error.value = "Error al cargar usuarios.";
    } finally {
      cargando.value = false;
    }
  }

  // Crea un nuevo usuario
  async function crearUsuario(payload, idRol) {
    try {
      const { data: nuevoUsuario } = await crearUsuarioApi(payload);
      if (idRol) {
        await cambiarRolApi(nuevoUsuario.id, idRol);
      }
      mensaje.value = `Usuario ${payload.usuarioNombre} creado correctamente.`;
      await cargarUsuarios();
      return true;
    } catch (err) {
      return err.response?.status === 409
        ? "El correo o usuario ya está en uso."
        : "Error al guardar el usuario.";
    }
  }

  // Actualiza un usuario existente
  async function actualizarUsuario(id, payload) {
    try {
      await actualizarUsuarioApi(id, payload);
      mensaje.value = `Usuario ${payload.usuarioNombre} actualizado correctamente.`;
      await cargarUsuarios();
      return true;
    } catch (err) {
      return err.response?.status === 409
        ? "El correo o usuario ya está en uso."
        : "Error al guardar el usuario.";
    }
  }

  // Cambia el rol de un usuario
  async function cambiarRol(idUsuario, idRolNuevo, nombre) {
    try {
      await cambiarRolApi(idUsuario, idRolNuevo);
      mensaje.value = `Rol de ${nombre} actualizado correctamente.`;
      await cargarUsuarios();
      return true;
    } catch {
      return "Error al cambiar el rol.";
    }
  }

  // Bloquea un usuario
  async function bloquear(id, nombre) {
    try {
      await bloquearUsuarioApi(id);
      mensaje.value = `Usuario ${nombre} bloqueado.`;
      await cargarUsuarios();
    } catch {
      error.value = "Error al bloquear usuario.";
    }
  }

  // Desbloquea un usuario
  async function desbloquear(id, nombre) {
    try {
      await desbloquearUsuarioApi(id);
      mensaje.value = `Usuario ${nombre} desbloqueado.`;
      await cargarUsuarios();
    } catch {
      error.value = "Error al desbloquear usuario.";
    }
  }

  // Reactiva un usuario eliminado
  async function reactivar(id, nombre) {
    try {
      await reactivarUsuarioApi(id);
      mensaje.value = `Usuario ${nombre} reactivado.`;
      await cargarUsuarios();
    } catch {
      error.value = "Error al reactivar usuario.";
    }
  }

  // Elimina un usuario
  async function eliminar(id, nombre) {
    try {
      await eliminarUsuarioApi(id);
      mensaje.value = `Usuario ${nombre} eliminado.`;
      await cargarUsuarios();
    } catch {
      error.value = "Error al eliminar usuario.";
    }
  }

  // COLUMNAS DE LA TABLA
  const columnas = [
    { titulo: "Usuario", valor: (u) => u.usuarioNombre },
    { titulo: "Correo", valor: (u) => u.correoElectronico },
    {
      titulo: "Rol",
      valor: (u) => u.roles?.[0] || "—",
      tipo: "badge",
      badgeClass: () => "rol",
    },
    {
      titulo: "Estado",
      valor: (u) => u.estadoUsuario,
      tipo: "badge",
      badgeClass: (u) => {
        const estado = u.estadoUsuario?.toLowerCase() || "";
        if (estado === "activo") return "success";
        if (estado === "bloqueado") return "danger";
        if (estado === "inactivo") return "secondary";
        return "rol";
      },
    },
    { titulo: "Intentos", valor: (u) => String(u.intentosFallidos ?? 0) },
  ];

  // ACCIONES DE LA TABLA
  const acciones = [
    {
      id: "editar",
      icono: "bi bi-person-fill-gear",
      tooltip: "Editar",
      clase: "primary",
      deshabilitado: (u) => !puedeModificarFila(u),
    },
    {
      id: "cambiar-rol",
      icono: "bi-key-fill",
      tooltip: "Cambiar Rol",
      clase: "warning",
      visible: () => esDev.value,
      deshabilitado: (u) => !puedeModificarFila(u),
    },
    {
      id: "bloquear",
      icono: "bi-lock-fill",
      tooltip: "Bloquear",
      clase: "danger",
      visible: (u) => u.estadoUsuario === "Activo",
      deshabilitado: (u) => !puedeModificarFila(u),
    },
    {
      id: "desbloquear",
      icono: "bi-unlock-fill",
      tooltip: "Desbloquear",
      clase: "success",
      visible: (u) => u.estadoUsuario === "Bloqueado",
      deshabilitado: (u) => !puedeModificarFila(u),
    },
    {
      id: "reactivar",
      icono: "bi-arrow-repeat",
      tooltip: "Reactivar",
      clase: "success",
      visible: (u) => u.estadoUsuario === "Inactivo",
      deshabilitado: (u) => !puedeModificarFila(u),
    },
    {
      id: "eliminar",
      icono: "bi bi-person-x-fill",
      tooltip: "Eliminar",
      clase: "danger",
      visible: (u) => u.estadoUsuario !== "Inactivo",
      deshabilitado: (u) => !puedeModificarFila(u),
    },
  ];

  // RETORNO
  return {
    esDev,
    usuarios,
    roles,
    rolesSinDev,
    cargando,
    error,
    mensaje,
    columnas,
    acciones,
    puedeModificarFila,
    cargarRoles,
    cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarRol,
    bloquear,
    desbloquear,
    reactivar,
    eliminar,
  };
}
