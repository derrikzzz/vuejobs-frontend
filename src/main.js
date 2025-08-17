import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/main.css";
import "primeicons/primeicons.css";
import App2 from "./App2.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App2);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);

// Initialize auth before mounting the app
const authStore = useAuthStore();
authStore.initializeAuth().then(() => {
  app.mount("#app");
});
