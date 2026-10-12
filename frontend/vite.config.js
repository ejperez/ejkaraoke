import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, "index.html"),
          nested: resolve(import.meta.dirname, "remote.html"),
        },
      },
    },
    base: env.VITE_BASE_PATH || "/",
    server: {
      port: env.VITE_PORT || 3000,
      strictPort: true,
    },
  };
});
