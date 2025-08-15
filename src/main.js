import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import "primeicons/primeicons.css";
import App2 from "./App2.vue";
import router from "./router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App2);
app.use(router);
app.use(Toast);
app.mount("#app");
