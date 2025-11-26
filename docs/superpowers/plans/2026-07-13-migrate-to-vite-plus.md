# Vite+ Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the separate Vite, tsup, ESLint, Prettier, and lint-staged workflow with Vite+ while preserving the demo app and the published package contract.

**Architecture:** Keep `vite.config.ts` as the single toolchain configuration. Use Vite+'s built-in Vite pipeline for the React/MDX demo and its `pack` block for the ESM/CJS library output; keep release-it and commitlint because they are release-policy tools rather than build-toolchain duplicates.

**Tech Stack:** Vite+, Vite 8/Rolldown, tsdown, Oxlint, Oxfmt, React 18, TypeScript, pnpm

---

### Task 1: Establish the migration baseline

**Files:**
- Inspect: `package.json`
- Inspect: `vite.config.ts`
- Inspect: `tsup.config.ts`
- Inspect: `.eslintrc.cjs`
- Inspect: `.husky/pre-commit`

- [x] **Step 1: Confirm a clean starting tree**

Run: `git status --short --branch`

Expected: the branch is reported and there are no pre-existing file changes.

- [x] **Step 2: Run the old validation commands**

Run: `pnpm build && pnpm build:demo && pnpm lint`

Expected before dependencies are installed: the command may fail with `tsup: command not found`; record that as an environment baseline rather than a product regression.

### Task 2: Run the official Vite+ migration

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `vite.config.ts`
- Delete: `.eslintrc.cjs`

- [x] **Step 1: Apply current non-interactive migration rules**

Run: `vp migrate --no-interactive --no-agent --no-editor --no-hooks`

Expected: `vite-plus` and the Vite compatibility alias are installed, Vite imports/scripts are rewritten, and supported lint/format configuration is consolidated.

- [x] **Step 2: Inspect every generated change**

Run: `git diff -- package.json vite.config.ts pnpm-lock.yaml .eslintrc.cjs`

Expected: only toolchain-related changes appear; package name, version, exports, files, repository metadata, and runtime API remain unchanged.

### Task 3: Move library packaging into Vite+

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json`
- Delete: `tsup.config.ts`

- [x] **Step 1: Add the package build contract to `vite.config.ts`**

Configure the Vite+ `pack` block with this behavior:

```ts
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
    return format === "es"
      ? { js: ".mjs", dts: ".d.mts" }
      : { js: ".cjs", dts: ".d.cts" };
  },
},
```

Expected: Vite+ owns both app and library configuration while keeping the ESM and CommonJS outputs aligned with `package.json#exports`.

- [x] **Step 2: Replace package scripts**

Use these command mappings in `package.json`:

```json
{
  "scripts": {
    "dev": "vp dev",
    "build:demo": "vp build",
    "build": "vp pack",
    "lint": "vp lint",
    "format": "vp fmt",
    "check": "vp check",
    "preview": "vp preview",
    "release": "vp run build && release-it --only-version"
  }
}
```

- [x] **Step 3: Remove the obsolete package configuration**

Delete: `tsup.config.ts`

Expected: no `tsup` import, dependency, script, or config file remains.

### Task 4: Consolidate staged-file checks

**Files:**
- Modify: `vite.config.ts`
- Modify: `.husky/pre-commit`
- Modify: `package.json`

- [x] **Step 1: Configure Vite+ staged checks**

Add this Vite+ configuration:

```ts
staged: {
  "*.{js,jsx,ts,tsx,mjs,cjs}": "vp check --fix",
  "*.{json,md,css,less,scss,yml,yaml}": "vp fmt --write",
},
```

- [x] **Step 2: Route the existing pre-commit hook through Vite+**

Use this hook body:

```sh
#!/usr/bin/env sh

vp staged
```

- [x] **Step 3: Remove superseded dependencies/configuration**

Remove ESLint, TypeScript ESLint, Prettier, stylelint, lint-staged, tsup, and their package-level configuration after Vite+ checks cover the same source set. Keep Husky and commitlint for the existing Git hooks.

### Task 5: Verify the migration end to end

**Files:**
- Verify: `dist/index.mjs`
- Verify: `dist/index.cjs`
- Verify: `dist/index.d.mts`
- Verify: `dist/index.d.cts`
- Verify: `dist/index.html`

- [x] **Step 1: Install the migrated dependency graph**

Run: `vp install`

Expected: installation completes using pnpm and the lockfile is current.

- [x] **Step 2: Run static checks**

Run: `vp check`

Expected: Oxlint, Oxfmt, and TypeScript checks pass, or any source issues exposed by stricter current defaults are fixed without changing the public API.

- [x] **Step 3: Build the library**

Run: `vp pack`

Expected: `dist/index.mjs`, `dist/index.cjs`, matching conditional declarations, and source maps are emitted.

- [x] **Step 4: Verify both module entry points**

Run: `node -e "import('./dist/index.mjs').then(m => console.log(Object.keys(m)))"`

Run: `node -e "const m = require('./dist/index.cjs'); console.log(Object.keys(m))"`

Expected: both commands load the package and expose the same public exports.

- [x] **Step 5: Build the demo app**

Run: `vp build`

Expected: the React/MDX demo builds successfully to `dist/index.html` with no unresolved aliases or plugins.

- [x] **Step 6: Review the final tree**

Run: `git diff --check && git status --short`

Expected: no whitespace errors, no generated `dist` files tracked, and all remaining changes belong to the Vite+ migration.
