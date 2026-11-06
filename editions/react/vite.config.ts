import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built into /react at the site root; relative base so it also works in previews
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "../../react", emptyOutDir: true }
});
