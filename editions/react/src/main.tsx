import { createRoot } from "react-dom/client";
import { loadSharedStyles, revealWhenBooted } from "../../core/src";
import { App } from "./App";

loadSharedStyles().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
  revealWhenBooted();
});
