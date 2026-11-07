import { createApp } from "vue";
import { loadSharedStyles, revealWhenBooted } from "../../core/src";
import App from "./App.vue";

loadSharedStyles().then(() => {
  createApp(App).mount("#app");
  revealWhenBooted();
});
