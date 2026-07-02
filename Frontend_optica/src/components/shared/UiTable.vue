<script setup>
// DEPENDENCIAS E IMPORTACIONES
import { ref, computed, watch } from "vue";

// PROPS
const props = defineProps({
  columnas: { type: Array, default: () => [] },
  datos: { type: Array, default: () => [] },
  acciones: { type: Array, default: () => [] },
  itemsPorPagina: { type: Number, default: 9 },
  textoVacio: { type: String, default: "No hay datos registrados." },
});

// EMITS
const emit = defineEmits(["accionClick"]);

// ESTADO REACTIVO
const paginaActual = ref(1);
const codigosVisibles = ref({});

// COMPUTADOS
const datosArray = computed(() =>
  Array.isArray(props.datos) ? props.datos : [],
);

const datosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * props.itemsPorPagina;
  return datosArray.value.slice(inicio, inicio + props.itemsPorPagina);
});

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(datosArray.value.length / props.itemsPorPagina)),
);

// WATCH
watch(datosArray, () => {
  if (paginaActual.value > totalPaginas.value) {
    paginaActual.value = 1;
  }
});

// FUNCIONES
function esVisible(accion, fila) {
  return accion.visible ? accion.visible(fila) : true;
}

function manejarClick(accion, fila) {
  emit("accionClick", { accion: accion.id, fila });
}
</script>

<template>
  <!-- TABLA GENÉRICA CON PAGINACIÓN -->
  <div class="gestion-table-wrapper">
    <div class="table-responsive">
      <table class="gestion-table">
        <!-- CABECERA -->
        <thead>
          <tr>
            <th
              v-for="(columna, idx) in columnas"
              :key="idx"
              :style="columna.width ? { width: columna.width } : {}"
            >
              {{ columna.titulo }}
            </th>
            <th v-if="acciones.length > 0">Acciones</th>
          </tr>
        </thead>

        <!-- CUERPO DE LA TABLA -->
        <tbody>
          <tr v-for="fila in datosPaginados" :key="fila.id">
            <!-- CELDAS POR COLUMNA -->
            <td
              v-for="(columna, idx) in columnas"
              :key="idx"
              :style="columna.width ? { width: columna.width } : {}"
            >
              <!-- BADGE -->
              <span
                v-if="columna.tipo === 'badge'"
                class="gestion-badge"
                :class="columna.badgeClass(fila)"
              >
                {{ columna.valor(fila) }}
              </span>

              <!-- ICONO CLICKEABLE -->
              <a
                v-else-if="columna.tipo === 'icon'"
                href="javascript:void(0)"
                class="gestion-icon-link"
                :class="columna.clase ? columna.clase(fila) : 'text-primary'"
                :title="
                  typeof columna.tooltip === 'function'
                    ? columna.tooltip(fila)
                    : columna.tooltip || ''
                "
                @click="
                  $emit('accionClick', {
                    accion: columna.accion || 'icon',
                    fila,
                  })
                "
              >
                <i
                  :class="[
                    'bi',
                    typeof columna.icono === 'function'
                      ? columna.icono(fila)
                      : columna.icono,
                  ]"
                ></i>
              </a>

              <!-- LINK CLICKEABLE -->
              <a
                v-else-if="columna.tipo === 'link'"
                href="javascript:void(0)"
                :class="columna.clase ? columna.clase(fila) : 'text-primary'"
                @click="
                  $emit('accionClick', {
                    accion: columna.accion || 'link',
                    fila,
                  })
                "
              >
                {{ columna.valor(fila) }}
              </a>

              <!-- TEXTO TRUNCADO -->
              <span v-else-if="columna.tipo === 'truncado'" class="truncado">
                {{ columna.valor(fila) }}
              </span>

              <!-- TEXTO NORMAL -->
              <span v-else>{{ columna.valor(fila) }}</span>
            </td>

            <!-- CELDA DE ACCIONES -->
            <td v-if="acciones.length > 0" class="gestion-acciones">
              <button
                v-for="accion in acciones"
                :key="accion.id"
                v-show="esVisible(accion, fila)"
                :class="['gestion-btn', accion.clase]"
                @click="manejarClick(accion, fila)"
                :title="accion.tooltip"
              >
                <i class="bi" :class="accion.icono"></i>
              </button>
            </td>
          </tr>

          <!-- FILA VACÍA -->
          <tr v-if="datosPaginados.length === 0">
            <td :colspan="columnas.length + 1" class="text-center">
              {{ textoVacio }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINACIÓN -->
    <div v-if="totalPaginas > 1" class="gestion-pagination">
      <button
        class="gestion-pagina-btn"
        :disabled="paginaActual === 1"
        @click="paginaActual--"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <span class="gestion-pagina-info">
        Página {{ paginaActual }} de {{ totalPaginas }}
      </span>

      <button
        class="gestion-pagina-btn"
        :disabled="paginaActual === totalPaginas"
        @click="paginaActual++"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
