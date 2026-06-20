<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { computed } from "vue";
import { useRouter } from "vue-router";

// PROPS
const props = defineProps({
  tituloApp: { type: String, default: "OPTIMAR" },
  links: { type: Array, default: () => [] },
  colapsado: { type: Boolean, default: false },
  rolUsuario: { type: String, default: "" },
});

// EMITS
const emit = defineEmits(["toggle"]);

// ROUTER
const router = useRouter();

// COMPUTADOS
const linksFiltrados = computed(() =>
  props.links.filter(
    (l) => l.roles.length === 0 || l.roles.includes(props.rolUsuario),
  ),
);

// FUNCIONES
function onToggle() {
  emit("toggle");
}

function toggleSubmenu(link) {
  linksFiltrados.value.forEach((l) => {
    if (l !== link) l.expandido = false;
  });
  link.expandido = !link.expandido;
}

function navegar(ruta) {
  if (ruta) router.push(ruta);
}
</script>

<template>
  <!-- SIDEBAR GLOBAL -->
  <aside class="sidebar" :class="{ collapsed: colapsado }">
    <!-- HEADER DEL SIDEBAR -->
    <div class="sidebar-header">
      <button class="btn-toggle-white" @click="onToggle">
        <i class="bi bi-list"></i>
      </button>
      <span class="sidebar-logo-text">{{ tituloApp }}</span>
    </div>

    <!-- NAVEGACIÓN -->
    <nav class="nav-links-container">
      <template v-for="link in linksFiltrados" :key="link.texto">
        <!-- LINK SIMPLE -->
        <router-link
          v-if="!link.hijos"
          :to="link.ruta"
          class="sidebar-link"
          active-class="active"
        >
          <i class="bi icon-min" :class="link.icono"></i>
          <span class="link-text">{{ link.texto }}</span>
        </router-link>

        <!-- LINK CON SUBMENÚ -->
        <template v-else>
          <a class="sidebar-link" @click="toggleSubmenu(link)">
            <i class="bi icon-min" :class="link.icono"></i>
            <span class="link-text">{{ link.texto }}</span>
            <i
              class="bi bi-chevron-down submenu-arrow"
              :class="{ rotated: link.expandido }"
            ></i>
          </a>
          <template v-if="link.expandido">
            <router-link
              v-for="hijo in link.hijos"
              :key="hijo.texto"
              :to="hijo.ruta"
              class="sidebar-link sub-link"
              active-class="active"
            >
              <i class="bi icon-min" :class="hijo.icono"></i>
              <span class="link-text">{{ hijo.texto }}</span>
            </router-link>
          </template>
        </template>
      </template>
    </nav>
  </aside>
</template>
