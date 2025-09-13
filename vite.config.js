import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [
    vue(),
    nodePolyfills({
      include: ["stream", "util", "buffer", "process", "crypto"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ];

  // Only add devtools plugin in development mode
  if (mode === 'development') {
    plugins.push(vueDevTools());
  }

  return {
    plugins,
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:8001",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        },
        "/gemini-api": {
          target: "https://generativelanguage.googleapis.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => {
            // Get API key from loaded env
            const apiKey = env.VITE_GEMINI_API_KEY;
            const newPath = path.replace(/^\/gemini-api/, "");

            if (apiKey) {
              // Add API key as query parameter
              const separator = newPath.includes("?") ? "&" : "?";
              return `${newPath}${separator}key=${apiKey}`;
            } else {
              console.error(
                "VITE_GEMINI_API_KEY not found in environment variables"
              );
              return newPath;
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      global: "globalThis",
      "process.env": {},
      "process.env.NODE_ENV": JSON.stringify("development"),
    },
    optimizeDeps: {
      include: [
        "filepond",
        "vue-filepond",
        "filepond-plugin-file-validate-type",
        "pdfjs-dist",
      ],
    },
    worker: {
      format: "es",
    },
    test: {
      environment: "jsdom",
      globals: true,
    },
  };
});
