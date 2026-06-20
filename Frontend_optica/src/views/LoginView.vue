<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import loginBg from "../assets/images/login-bg.jpg";

// INICIALIZACIÓN DE SERVICIOS Y HOOKS
const router = useRouter();
const { cargando, error, login, limpiarError } = useAuth();

// ESTADO REACTIVO DEL FORMULARIO
const correoElectronico = ref(localStorage.getItem("recordar_usuario") || "");
const contrasena = ref("");
const verContrasena = ref(false);
const recordarme = ref(!!localStorage.getItem("recordar_usuario"));
const mayusActivo = ref(false);

// CONSTANTES Y CONFIGURACIÓN
const nombreSistema = "Óptica";

// FUNCIONES DE UTILERÍA Y EVENTOS DE UI
function verificarMayus(e) {
  mayusActivo.value = e.getModifierState("CapsLock");
}

function toggleContrasena() {
  verContrasena.value = !verContrasena.value;
}

// FUNCIONES PRINCIPALES
async function handleLogin() {
  if (!correoElectronico.value.trim()) {
    error.value = "Falta rellenar el campo de correo.";
    return;
  }
  if (!contrasena.value.trim()) {
    error.value = "Falta rellenar el campo de contraseña.";
    return;
  }
  await login(correoElectronico.value, contrasena.value, recordarme.value);
}

function irRecuperar() {
  router.push("/recuperar-contrasena");
}
</script>

<template>
  <!-- ESTRUCTURA PRINCIPAL: Layout de dos columnas -->
  <div class="login-wrapper">
    <!-- COLUMNA IZQUIERDA: Imagen de fondo con branding -->
    <div class="login-image-side">
      <img :src="loginBg" class="login-bg-img" alt="Logo" />
      <div class="login-image-overlay">
        <div class="login-brand-box">
          <h1 class="login-brand-title">{{ nombreSistema }}</h1>
          <span class="login-brand-sub">OFT</span>
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: Formulario de inicio de sesión -->
    <div class="login-form-side">
      <div class="login-form-box">
        <!-- Encabezado del formulario -->
        <div class="login-form-header">
          <h2 class="login-title">Iniciar Sesión</h2>
          <p class="login-subtitle">{{ nombreSistema }}</p>
        </div>

        <!-- Campo: Correo electrónico -->
        <div class="login-field">
          <label class="login-label">Correo</label>
          <input
            v-model="correoElectronico"
            type="text"
            class="login-input"
            placeholder="Ingresa tu correo"
            @keyup.enter.prevent="handleLogin"
          />
        </div>

        <!-- Campo: Contraseña (con visibilidad alternable) -->
        <div class="login-field">
          <label class="login-label">Contraseña</label>
          <div class="password-container">
            <!-- Tooltip de CapsLock -->
            <div v-if="mayusActivo" class="login-mayus-tooltip">
              <i class="bi bi-exclamation-triangle-fill me-1"></i>
              Bloq Mayús activado
            </div>

            <!-- Input de contraseña con botón de toggle -->
            <div class="login-input-group">
              <input
                v-model="contrasena"
                :type="verContrasena ? 'text' : 'password'"
                class="login-input"
                placeholder="Ingresa tu contraseña"
                @keyup="verificarMayus"
                @keyup.enter.prevent="handleLogin"
              />
              <button
                type="button"
                class="login-eye-btn"
                @click="toggleContrasena"
              >
                <i
                  :class="
                    verContrasena ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                  "
                ></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Checkbox: Recordar usuario -->
        <div class="login-check">
          <input id="recordar" v-model="recordarme" type="checkbox" />
          <label for="recordar">Recordarme</label>
        </div>

        <!-- Botón de envío (con estado de carga) -->
        <button
          type="button"
          class="login-btn"
          :disabled="cargando"
          @click="handleLogin"
        >
          <span v-if="cargando" class="login-spinner"></span>
          {{ cargando ? "Ingresando..." : "Ingresar" }}
        </button>

        <!-- Enlace de recuperación de contraseña -->
        <div class="login-forgot">
          <a @click="irRecuperar">¿Olvidaste tu contraseña?</a>
        </div>

        <!-- Modal de error (overlay) -->
        <div v-if="error" class="login-error-overlay">
          <div class="login-error-modal">
            <div class="login-error-icon">
              <i class="bi bi-x-circle-fill"></i>
            </div>
            <p class="login-error-msg">{{ error }}</p>
            <button type="button" class="login-error-btn" @click="limpiarError">
              Entendido
            </button>
          </div>
        </div>

        <!-- Footer informativo -->
        <div class="login-footer">
          <span>
            © 2026
            <strong>{{ nombreSistema }}</strong>
            · Todos los derechos reservados
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/login.css" />
