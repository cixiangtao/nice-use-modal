import { spawnSync } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const build = spawnSync("pnpm", ["build:demo"], {
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

await rm("dist", { force: true, recursive: true });
await mkdir("dist/server", { recursive: true });
await cp("demo-dist", "dist/client", { recursive: true });
await writeFile(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== "GET") {
      return response;
    }

    const url = new URL(request.url);
    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`,
);
