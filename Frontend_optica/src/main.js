// DEPENDENCIAS E IMPORTACIONES
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";

// ESTILOS GLOBALES
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// CREACIÓN DE LA APLICACIÓN
const app = createApp(App);

// PLUGINS
app.use(createPinia()); // Store de Pinia
app.use(router); // Router de Vue

// MONTAJE
app.mount("#app");
