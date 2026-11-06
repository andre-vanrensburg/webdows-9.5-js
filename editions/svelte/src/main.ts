import { mount } from "svelte";
import { loadSharedStyles } from "../../core/src";
import App from "./App.svelte";

loadSharedStyles().then(() => mount(App, { target: document.getElementById("app")! }));
