/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL("./src", import.meta.url))),
    },
  },
  build: {
    minify: false,
    lib: {
      entry: resolve(
        fileURLToPath(new URL("./src/hooks/useModal", import.meta.url))
      ),
      name: "nice-use-modal",
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom", "nanoid", "react/jsx-runtime"],
    },
  },
});
