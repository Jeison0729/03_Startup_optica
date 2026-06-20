// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";

// ESTILOS GLOBALES
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// TUS ESTILOS - CORREGIDO
import "./styles/login.css";
import "./styles/recuperar.css";
import "./theme/_variables.css";
import "./theme/_cards.css";
import "./theme/_tables.css";
import "./theme/_badges.css";
import "./theme/_buttons.css";
import "./theme/_forms.css";
import "./theme/_modals.css";
import "./theme/_filters.css";
import "./theme/_spinner.css";
import "./theme/_misc.css";
import "./layout-styles/_content.css";
import "./layout-styles/_navbar.css";
import "./layout-styles/_sidebar.css";
import "./layout-styles/_footer.css";
import "./layout-styles/_responsive.css";
import "./layout-styles/_utilities.css";

// CREACIÓN DE LA APLICACIÓN
const app = createApp(App);

// PLUGINS
app.use(createPinia());
app.use(router);

// MONTAJE
app.mount("#app");
