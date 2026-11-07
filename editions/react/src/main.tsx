import { createRoot } from "react-dom/client";
import { loadSharedStyles, preloadImages, revealWhenBooted } from "../../core/src";
import { App } from "./App";

// The logo screen image downloads during POST so the desktop never peeks through
preloadImages("../img/loading-react.jpg", "../img/es.png");

loadSharedStyles().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
  revealWhenBooted();
});
