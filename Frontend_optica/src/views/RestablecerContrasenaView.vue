<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSolicitudes } from "../composables/useSolicitudes";

// INICIALIZACIÓN DE SERVICIOS Y HOOKS
const router = useRouter();
const { cargando, error, mensaje, limpiar, restablecerContrasena } =
  useSolicitudes();

// ESTADO REACTIVO DEL FORMULARIO
const correoOUsuario = ref("");
const codigo = ref("");
const nuevaContrasena = ref("");
const exitoso = ref(false);
const verContrasena = ref(false);

// CONSTANTES Y CONFIGURACIÓN
const nombreSistema = "Óptica";

// FUNCIONES DE UI
function toggleContrasena() {
  verContrasena.value = !verContrasena.value;
}

function limpiarError() {
  limpiar();
  codigo.value = "";
  nuevaContrasena.value = "";
}

// Función principal: restablece la contraseña
async function restablecer() {
  if (
    !correoOUsuario.value.trim() ||
    !codigo.value.trim() ||
    !nuevaContrasena.value.trim()
  ) {
    error.value = "Por favor completa todos los campos.";
    return;
  }
  if (nuevaContrasena.value.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  const ok = await restablecerContrasena(
    correoOUsuario.value,
    codigo.value,
    nuevaContrasena.value,
  );
  if (ok) exitoso.value = true;
}

// Navegación
function volverLogin() {
  router.push("/login");
}
</script>

<template>
  <!-- ESTRUCTURA PRINCIPAL: Fondo y contenedor central -->
  <div class="recuperar-wrapper">
    <div class="recuperar-box">
      <!-- ENCABEZADO DEL FORMULARIO -->
      <div class="recuperar-header">
        <h2 class="recuperar-title">Nueva contraseña</h2>
        <p class="recuperar-subtitle">
          Ingresa el código recibido y tu nueva contraseña.
        </p>
      </div>

      <!-- MODAL DE ERROR -->
      <div v-if="error" class="form-overlay">
        <div class="form-modal error">
          <div class="form-modal-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <p class="form-modal-msg">{{ error }}</p>
          <button class="form-modal-btn error-btn" @click="limpiarError">
            Entendido
          </button>
        </div>
      </div>

      <!-- MODAL DE ÉXITO -->
      <div v-if="exitoso" class="form-overlay">
        <div class="form-modal success">
          <div class="form-modal-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <p class="form-modal-msg">{{ mensaje }}</p>
          <p class="form-modal-sub">
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <button class="form-modal-btn success-btn" @click="volverLogin">
            Ir al login
          </button>
        </div>
      </div>

      <!-- CAMPO: Correo o Usuario -->
      <div class="recuperar-field">
        <label class="recuperar-label">Correo o Usuario</label>
        <input
          v-model="correoOUsuario"
          type="text"
          class="recuperar-input"
          placeholder="Ingresa tu correo o usuario"
        />
      </div>

      <!-- CAMPO: Código de recuperación -->
      <div class="recuperar-field">
        <label class="recuperar-label">Código de recuperación</label>
        <input
          v-model="codigo"
          type="text"
          class="recuperar-input"
          placeholder="Ingresa el código de 6 dígitos"
          maxlength="6"
        />
      </div>

      <!-- CAMPO: Nueva contraseña (con visibilidad alternable) -->
      <div class="recuperar-field">
        <label class="recuperar-label">Nueva contraseña</label>
        <div class="recuperar-input-group">
          <input
            v-model="nuevaContrasena"
            :type="verContrasena ? 'text' : 'password'"
            class="recuperar-input"
            placeholder="Mínimo 6 caracteres"
            @keyup.enter="restablecer"
          />
          <button
            type="button"
            class="recuperar-eye-btn"
            @click="toggleContrasena"
          >
            <i
              :class="verContrasena ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
            ></i>
          </button>
        </div>
      </div>

      <!-- BOTÓN RESTABLECER -->
      <button class="recuperar-btn" :disabled="cargando" @click="restablecer">
        <span v-if="cargando" class="recuperar-spinner"></span>
        {{ cargando ? "Procesando..." : "Restablecer contraseña" }}
      </button>

      <!-- ENLACE: Volver al login -->
      <div class="recuperar-back">
        <a @click="volverLogin">← Volver al login</a>
      </div>

      <!-- FOOTER -->
      <div class="recuperar-footer">
        <span>
          © 2026
          <strong>{{ nombreSistema }}</strong>
          · Todos los derechos reservados
        </span>
        <span>v1.0.0</span>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/recuperar.css" />
