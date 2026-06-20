<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSolicitudes } from "../composables/useSolicitudes";

// INICIALIZACIÓN DE SERVICIOS Y HOOKS
const router = useRouter();
const { cargando, error, mensaje, limpiar, solicitarRecuperacion } =
  useSolicitudes();

// ESTADO REACTIVO DEL FORMULARIO
const correoOUsuario = ref("");

// CONSTANTES Y CONFIGURACIÓN
const nombreSistema = "Óptica";

// FUNCIONES PRINCIPALES
function limpiarError() {
  limpiar();
  correoOUsuario.value = "";
}

// Valida y solicita recuperación
async function solicitar() {
  if (!correoOUsuario.value.trim()) {
    error.value = "Por favor ingresa tu correo o usuario.";
    return;
  }
  await solicitarRecuperacion(correoOUsuario.value);
}

// Navegación
function irRestablecer() {
  router.push("/restablecer-contrasena");
}

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
        <h2 class="recuperar-title">¿Olvidaste tu contraseña?</h2>
        <p class="recuperar-subtitle">
          Ingresa tu correo o usuario y notificaremos al administrador.
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
      <div v-if="mensaje" class="form-overlay">
        <div class="form-modal success">
          <div class="form-modal-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <p class="form-modal-msg">{{ mensaje }}</p>
          <div class="form-modal-actions">
            <button class="form-modal-btn success-btn" @click="irRestablecer">
              Ingresar código
            </button>
            <button class="form-modal-btn secondary-btn" @click="volverLogin">
              Volver al login
            </button>
          </div>
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
          @keyup.enter="solicitar"
        />
      </div>

      <!-- BOTÓN SOLICITAR RECUPERACIÓN -->
      <button class="recuperar-btn" :disabled="cargando" @click="solicitar">
        <span v-if="cargando" class="recuperar-spinner"></span>
        {{ cargando ? "Enviando..." : "Solicitar recuperación" }}
      </button>

      <!-- ENLACE: Ir a restablecer (si ya tiene código) -->
      <div class="recuperar-link">
        <a @click="irRestablecer">
          ¿Ya tienes el código? Restablecer contraseña →
        </a>
      </div>

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
