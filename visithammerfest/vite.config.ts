import { appendFile } from "fs/promises";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const accessLogPlugin = () => {
  const logPath = path.resolve(process.cwd(), "dev-access.log");

  return {
    name: "access-log",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const host = req.headers.host || "-";
        const forwarded = req.headers["x-forwarded-for"]?.toString().split(",")[0].trim();
        const ip = forwarded || req.socket.remoteAddress || "-";
        const start = Date.now();
        res.on("finish", () => {
          const duration = Date.now() - start;
          const line = `${new Date().toISOString()} ${ip} ${host} ${req.method} ${req.url} ${res.statusCode} ${duration}ms\n`;
          appendFile(logPath, line).catch(() => {
            /* ignore fs errors to not break dev server */
          });
        });
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [accessLogPlugin(), react()],
  server: {
    port: 4179,
    allowedHosts: ["visithammerfest.wegener.no"],
    proxy: {
      "/api": {
        target: "http://localhost:5170",
        changeOrigin: true
      }
    }
  },
  preview: {
    allowedHosts: ["visithammerfest.wegener.no"]
  }
});
