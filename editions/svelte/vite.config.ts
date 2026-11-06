import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Built into /svelte at the site root; relative base so it also works in previews
export default defineConfig({
  plugins: [svelte()],
  base: "./",
  build: { outDir: "../../svelte", emptyOutDir: true }
});
