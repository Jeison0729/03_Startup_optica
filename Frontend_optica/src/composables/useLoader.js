// DEPENDENCIAS E IMPORTACIONES
import { ref } from "vue";

// ESTADO GLOBAL DE CARGA
const cargando = ref(false);

// COMPOSABLE DE LOADER
export function useLoader() {
  // FUNCIONES

  // Muestra el loader
  const mostrar = () => {
    cargando.value = true;
  };

  // Oculta el loader
  const ocultar = () => {
    cargando.value = false;
  };

  // RETORNO
  return { cargando, mostrar, ocultar };
}
