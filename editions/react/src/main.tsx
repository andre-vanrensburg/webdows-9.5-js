import { createRoot } from "react-dom/client";
import { loadSharedStyles } from "../../core/src";
import { App } from "./App";

loadSharedStyles().then(() => createRoot(document.getElementById("root")!).render(<App />));
