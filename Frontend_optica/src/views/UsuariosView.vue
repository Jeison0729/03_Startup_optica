<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { onMounted } from "vue";
import UiTable from "../components/shared/UiTable.vue";
import UiModal from "../components/shared/UiModal.vue";
import UiFormModal from "../components/shared/UiFormModal.vue";
import { useUsuarios } from "../composables/useUsuarios";
import { useUsuarioForm } from "../composables/useUsuarioForm";
import { useConfirmacion } from "../composables/useConfirmacion";

// INICIALIZACIÓN DE COMPOSABLES
const {
  esDev,
  usuarios,
  roles,
  rolesSinDev,
  cargando,
  error,
  mensaje,
  columnas,
  acciones,
  cargarRoles,
  cargarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarRol,
  bloquear,
  desbloquear,
  reactivar,
  eliminar,
} = useUsuarios();

const {
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
} = useUsuarioForm(rolesSinDev, crearUsuario, actualizarUsuario, cambiarRol);

const {
  mostrarConfirmacion,
  mensajeConfirmacion,
  confirmarAccion,
  ejecutarAccion,
  cerrarConfirmacion,
} = useConfirmacion();

// FUNCIONES

// Maneja acciones de la tabla
function onAccion({ accion, fila }) {
  if (accion === "editar") return abrirEdicion(fila);
  if (accion === "cambiar-rol") return abrirCambioRol(fila, roles.value);
  if (accion === "bloquear") return bloquear(fila.id, fila.usuarioNombre);
  if (accion === "desbloquear") return desbloquear(fila.id, fila.usuarioNombre);
  if (accion === "reactivar") {
    return confirmarAccion(
      `¿Está seguro de reactivar a ${fila.usuarioNombre}?`,
      () => reactivar(fila.id, fila.usuarioNombre),
    );
  }
  if (accion === "eliminar") {
    return confirmarAccion(
      `¿Está seguro de eliminar a ${fila.usuarioNombre}?`,
      () => eliminar(fila.id, fila.usuarioNombre),
    );
  }
}

// CICLO DE VIDA - Carga inicial
onMounted(async () => {
  await cargarRoles();
  await cargarUsuarios();
});
</script>

<template>
  <!-- CONTENEDOR PRINCIPAL -->
  <div class="gestion-wrapper">
    <!-- CABECERA -->
    <div class="gestion-header">
      <div>
        <h2 class="gestion-title">Gestión de Usuarios</h2>
        <p class="gestion-subtitle">Administra usuarios y roles del sistema.</p>
      </div>
      <div class="gestion-header-actions">
        <button class="gestion-btn-actualizar" @click="cargarUsuarios">
          <i class="bi-arrow-clockwise"></i>
          Actualizar
        </button>
        <button v-if="esDev" class="gestion-btn-nuevo" @click="abrirFormulario">
          <i class="bi-person-plus-fill"></i>
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- MODAL DE FORMULARIO DE USUARIO -->
    <UiFormModal
      v-if="mostrarFormulario"
      :titulo="usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'"
      :campos="camposFormulario"
      :datos="form"
      :texto-guardar="usuarioEditando ? 'Guardar cambios' : 'Crear'"
      :icono-guardar="
        usuarioEditando ? 'bi-bookmark-fill' : 'bi-person-fill-check'
      "
      :error="errorFormulario"
      @guardar="guardar"
      @cancelar="cerrarFormulario"
    />

    <!-- MODAL DE CAMBIO DE ROL -->
    <UiFormModal
      v-if="mostrarCambioRol"
      :titulo="`Cambiar Rol a: ${usuarioCambioRol?.usuarioNombre}`"
      :campos="camposCambioRol"
      :datos="formCambioRol"
      texto-guardar="Confirmar cambio"
      icono-guardar="bi-key-fill"
      :error="errorFormulario"
      @guardar="confirmarCambioRol"
      @cancelar="cerrarCambioRol"
    />

    <!-- MODAL DE ÉXITO -->
    <UiModal
      v-if="mensaje"
      tipo="success"
      :mensaje="mensaje"
      texto-confirmar="Aceptar"
      @confirmar="mensaje = ''"
      @cerrar="mensaje = ''"
    />

    <!-- MODAL DE ERROR -->
    <UiModal
      v-if="error"
      tipo="error"
      :mensaje="error"
      texto-confirmar="Entendido"
      @confirmar="error = ''"
      @cerrar="error = ''"
    />

    <!-- MODAL DE CONFIRMACIÓN -->
    <UiFormModal
      v-if="mostrarConfirmacion"
      titulo="Confirmar Acción"
      :campos="[]"
      :datos="{}"
      :mensaje="mensajeConfirmacion"
      texto-guardar="Sí, confirmar"
      icono-guardar="bi-trash-fill"
      texto-cancelar="Cancelar"
      @guardar="ejecutarAccion"
      @cancelar="cerrarConfirmacion"
    />

    <!-- SPINNER DE CARGA -->
    <div v-if="cargando" class="gestion-spinner-wrapper">
      <div class="gestion-spinner"></div>
      <p class="gestion-spinner-text">Cargando usuarios...</p>
    </div>

    <!-- TABLA DE USUARIOS -->
    <div v-if="!cargando" class="gestion-contenido-scroll">
      <div>
        <UiTable
          :columnas="columnas"
          :datos="usuarios"
          :acciones="acciones"
          :items-por-pagina="6"
          texto-vacio="No hay usuarios registrados o permitidos para su rol."
          @accion-click="onAccion"
        />
      </div>
    </div>
  </div>
</template>
