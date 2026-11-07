import { mount } from "svelte";
import { loadSharedStyles, preloadImages, revealWhenBooted } from "../../core/src";
import App from "./App.svelte";

// The logo screen image downloads during POST so the desktop never peeks through
preloadImages("../img/loading-svelte.jpg", "../img/es.png");

loadSharedStyles().then(() => {
  mount(App, { target: document.getElementById("app")! });
  revealWhenBooted();
});
