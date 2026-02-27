import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        portal: resolve(__dirname, "portal.html"),
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3011",
        changeOrigin: true,
      },
    },
  },
});
