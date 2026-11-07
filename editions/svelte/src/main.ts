import { mount } from "svelte";
import { loadSharedStyles, revealWhenBooted } from "../../core/src";
import App from "./App.svelte";

loadSharedStyles().then(() => {
  mount(App, { target: document.getElementById("app")! });
  revealWhenBooted();
});
