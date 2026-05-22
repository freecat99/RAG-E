// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  build: {
    // Output goes to the extension root so manifest.json can reference it
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        // Your React sidebar entry point
        index: resolve(__dirname, "index.html"),
      },
      output: {
        // Stable filenames — no hashes — so manifest.json never needs updating
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});