import { appendFile } from "fs/promises";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
var accessLogPlugin = function () {
    var logPath = path.resolve(process.cwd(), "dev-access.log");
    return {
        name: "access-log",
        configureServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                var start = Date.now();
                res.on("finish", function () {
                    var duration = Date.now() - start;
                    var line = "".concat(new Date().toISOString(), " ").concat(req.method, " ").concat(req.url, " ").concat(res.statusCode, " ").concat(duration, "ms\n");
                    appendFile(logPath, line).catch(function () {
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
