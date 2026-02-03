import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["chat.wegener.no"],
    proxy: {
      "/api": {
        target: "http://chat-api:8080",
        changeOrigin: true,
      },
      "/runner": {
        target: "http://chat-safe-runner:8082",
        changeOrigin: true,
      },
    },
    hmr: process.env.HMR_HOST
      ? {
          protocol: "wss",
          host: process.env.HMR_HOST,
          clientPort: 443,
        }
      : undefined,
  }
});
