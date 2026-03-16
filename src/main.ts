import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/main.scss";

createApp(App).use(router).mount("#app");
