import { resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";

import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["CHANGELOG.md", "README*.md", "docs/superpowers/**", "src/docs/**/*.md"],
    sortPackageJson: true,
    sortImports: true,
    sortTailwindcss: true,
  },
  lint: {
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    rules: {
      "eslint/no-unused-vars": "off",
      "unicorn/no-empty-file": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ["packages/useModal/index.tsx"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: false,
    deps: {
      neverBundle: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
    },
    outDir: "dist",
    outExtensions({ format }) {
      return format === "es" ? { js: ".mjs", dts: ".d.mts" } : { js: ".cjs", dts: ".d.cts" };
    },
  },
  staged: {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "vp check --fix",
    "*.{json,md,css,less,scss,yml,yaml}": "vp fmt --write",
  },
  server: {
    port: 3000,
  },
  plugins: lazyPlugins(() => [
    { enforce: "pre", ...mdx(/* jsxImportSource: …, otherOptions… */) },
    react(),
  ]),
  resolve: {
    alias: {
      "~": resolve(fileURLToPath(new URL(".", import.meta.url))),
      "@": resolve(fileURLToPath(new URL("./src", import.meta.url))),
    },
  },
});
