import { createApp } from "vue";
import { loadSharedStyles, preloadImages, revealWhenBooted } from "../../core/src";
import App from "./App.vue";

// The logo screen image downloads during POST so the desktop never peeks through
preloadImages("../img/loading-vue.jpg", "../img/es.png");

loadSharedStyles().then(() => {
  createApp(App).mount("#app");
  revealWhenBooted();
});
