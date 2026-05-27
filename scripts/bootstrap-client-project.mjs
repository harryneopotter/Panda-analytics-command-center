import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    input: "",
    outputDir: "",
    domain: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--input" && next) {
      args.input = next;
      index += 1;
    } else if (token === "--output-dir" && next) {
      args.outputDir = next;
      index += 1;
    } else if (token === "--domain" && next) {
      args.domain = next;
      index += 1;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    throw new Error("Usage: node scripts/bootstrap-client-project.mjs --input <research.md> [--output-dir <dir>] [--domain <domain-id>]");
  }

  const outputDir = path.resolve(process.cwd(), args.outputDir || "instances");
  await fs.mkdir(outputDir, { recursive: true });

  const manifestPath = path.join(outputDir, "manifest.json");
  const generateManifestArgs = [
    path.resolve(process.cwd(), "scripts/generate-project-manifest.mjs"),
    "--input",
    args.input,
    "--output",
    manifestPath,
  ];

  if (args.domain) {
    generateManifestArgs.push("--domain", args.domain);
  }

  execFileSync(process.execPath, generateManifestArgs, {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  execFileSync(process.execPath, [
    path.resolve(process.cwd(), "scripts/validate-project-manifest.mjs"),
    "--input",
    manifestPath,
  ], {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  execFileSync(process.execPath, [
    path.resolve(process.cwd(), "scripts/generate-project-instance.mjs"),
    "--manifest",
    manifestPath,
    "--output-dir",
    outputDir,
  ], {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  console.log(`Bootstrap complete: ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
