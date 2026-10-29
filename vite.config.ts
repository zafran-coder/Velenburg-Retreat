import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local Vite Serverless API emulator (bridges /api/* during `npm run dev`)
function localApiServerlessPlugin() {
  return {
    name: "local-api-serverless-plugin",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || !req.url.startsWith("/api/")) {
          return next();
        }

        const pathname = req.url.split("?")[0];
        try {
          if (pathname === "/api/availability") {
            const mod = await server.ssrLoadModule("./api/availability.ts");
            return await mod.default(req, res);
          }
          if (pathname === "/api/bookings") {
            const mod = await server.ssrLoadModule("./api/bookings.ts");
            return await mod.default(req, res);
          }
          if (pathname === "/api/admin") {
            const mod = await server.ssrLoadModule("./api/admin.ts");
            return await mod.default(req, res);
          }
        } catch (error: any) {
          console.error("[Local API Middleware Error]:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: error?.message || "Internal API Error" }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Populate process.env for Node server modules
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile(),
      localApiServerlessPlugin(),
    ],
    define: {
      "process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ""),
      "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
