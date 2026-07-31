import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const nodeCommand = process.execPath;

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          [`${command} ${args.join(" ")} exited with ${code}`, stdout, stderr]
            .filter(Boolean)
            .join("\n"),
        ),
      );
    });
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredFiles = [
  "LICENSE",
  "README.md",
  "dist/index.cjs",
  "dist/index.cjs.map",
  "dist/index.d.cts",
  "dist/index.d.mts",
  "dist/index.mjs",
  "dist/index.mjs.map",
  "package.json",
];

const forbiddenPrefixes = [".github/", "demo-dist/", "packages/", "src/", "tests/"];
const temporaryRoot = await mkdtemp(join(tmpdir(), "nice-use-modal-package-"));

try {
  const { stdout: packOutput } = await run(
    npmCommand,
    ["pack", "--json", "--ignore-scripts", "--pack-destination", temporaryRoot],
    process.cwd(),
  );
  const [packResult] = JSON.parse(packOutput);

  assert(packResult?.filename, "npm pack did not report an archive filename");

  const archivePath = join(temporaryRoot, packResult.filename);
  const archivedFiles = packResult.files.map(({ path }) => path).sort();

  for (const file of requiredFiles) {
    assert(archivedFiles.includes(file), `Package is missing required file: ${file}`);
  }

  for (const file of archivedFiles) {
    assert(
      !forbiddenPrefixes.some((prefix) => file.startsWith(prefix)),
      `Package includes private source or repository file: ${file}`,
    );
  }
  assert(
    archivedFiles.length === requiredFiles.length,
    `Package includes unexpected files: ${archivedFiles
      .filter((file) => !requiredFiles.includes(file))
      .join(", ")}`,
  );

  for (const reactMajor of ["18", "19"]) {
    const consumerRoot = join(temporaryRoot, `react-${reactMajor}`);
    await mkdir(consumerRoot);
    await writeFile(
      join(consumerRoot, "package.json"),
      JSON.stringify({ private: true, type: "module" }),
    );
    await run(
      npmCommand,
      [
        "install",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--no-package-lock",
        archivePath,
        `react@${reactMajor}`,
      ],
      consumerRoot,
    );

    const esmCheck = [
      'const pkg = await import("nice-use-modal");',
      'if (typeof pkg.ModalProvider !== "function" || typeof pkg.useModal !== "function")',
      '  throw new Error("ESM exports are invalid");',
    ].join("\n");
    await run(nodeCommand, ["--input-type=module", "--eval", esmCheck], consumerRoot);

    const cjsCheck = [
      'const pkg = require("nice-use-modal");',
      'if (typeof pkg.ModalProvider !== "function" || typeof pkg.useModal !== "function")',
      '  throw new Error("CommonJS exports are invalid");',
    ].join("\n");
    await run(nodeCommand, ["--input-type=commonjs", "--eval", cjsCheck], consumerRoot);

    const installedPackage = join(consumerRoot, "node_modules", "nice-use-modal");
    const packageManifest = JSON.parse(
      await readFile(join(installedPackage, "package.json"), "utf8"),
    );
    const packageReadme = await readFile(join(installedPackage, "README.md"), "utf8");
    const packageLicense = await readFile(join(installedPackage, "LICENSE"), "utf8");

    assert(packageManifest.name === "nice-use-modal", "Published package name is incorrect");
    assert(packageManifest.license === "MIT", "Published package license metadata is incorrect");
    assert(
      packageManifest.homepage === "https://cixiangtao.github.io/nice-use-modal/",
      "Published package homepage is incorrect",
    );
    assert(
      packageManifest.bugs?.url === "https://github.com/cixiangtao/nice-use-modal/issues",
      "Published package issue URL is incorrect",
    );
    assert(
      packageManifest.peerDependencies?.react === "^18.0.0 || ^19.0.0",
      "Published React peer dependency is incorrect",
    );
    assert(
      packageReadme.includes("https://github.com/cixiangtao/nice-use-modal"),
      "Published README does not link to the full GitHub documentation",
    );
    assert(packageLicense.startsWith("MIT License"), "Published LICENSE is not the MIT license");

    try {
      await access(join(installedPackage, ".github", "README.md"));
      throw new Error("Published package includes the GitHub-only README");
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  console.log(
    `Verified ${packResult.name}@${packResult.version}: ${archivedFiles.length} files, ESM/CJS, React 18/19.`,
  );
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
}
