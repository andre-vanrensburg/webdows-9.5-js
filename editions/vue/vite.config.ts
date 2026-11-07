import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Built into /vue at the site root; relative base so it also works in previews
export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: { outDir: "../../vue", emptyOutDir: true }
});
