import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    manifest: "",
    outputDir: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--manifest" && next) {
      args.manifest = next;
      index += 1;
    } else if (token === "--output-dir" && next) {
      args.outputDir = next;
      index += 1;
    }
  }

  return args;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.manifest) {
    throw new Error("Usage: node scripts/generate-project-instance.mjs --manifest <manifest.json> [--output-dir <dir>]");
  }

  const manifestPath = path.resolve(process.cwd(), args.manifest);
  const raw = await fs.readFile(manifestPath, "utf8");
  const manifest = JSON.parse(raw);
  const projectName = manifest?.client?.name ?? "project";
  const projectSlug = slugify(projectName) || "project";
  const outputDir = path.resolve(process.cwd(), args.outputDir || path.join("instances", projectSlug));

  await fs.mkdir(outputDir, { recursive: true });

  const manifestOutputPath = path.join(outputDir, "manifest.json");
  await fs.writeFile(manifestOutputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const instance = {
    schemaVersion: manifest.schemaVersion ?? "1.0.0",
    instanceType: "client-dashboard-instance",
    projectSlug,
    projectName,
    domainId: manifest?.projectContext?.domainId ?? "generic",
    domainLabel: manifest?.projectContext?.domainLabel ?? "Generic",
    generatedAt: new Date().toISOString(),
    status: "ready-for-deploy",
    sourceManifest: "./manifest.json",
    dashboardRoute: `/projects/${projectSlug}`,
    renderConfig: {
      labels: manifest?.dashboardConfig?.labels ?? {},
      enabledSections: manifest?.dashboardConfig?.enabledSections ?? [],
      tabs: manifest?.dashboardConfig?.tabs ?? [],
      guardrails: manifest?.guardrails ?? {},
    },
    outputs: {
      manifest: "manifest.json",
      instance: "instance.json",
      summary: "README.md",
    },
  };

  const instancePath = path.join(outputDir, "instance.json");
  await fs.writeFile(instancePath, `${JSON.stringify(instance, null, 2)}\n`, "utf8");

  const readme = `# ${projectName} Instance

This directory contains the generated client dashboard instance for ${projectName}.

## Contents

- \`manifest.json\`: normalized client manifest
- \`instance.json\`: deployable instance metadata

## Deployment Notes

- Treat this directory as the client-specific package.
- The shared dashboard engine should read \`manifest.json\` and render the dashboard from the generated config.
- The instance is marked \`ready-for-deploy\` after validation.
`;

  await fs.writeFile(path.join(outputDir, "README.md"), `${readme.trim()}\n`, "utf8");

  console.log(`Generated instance for ${projectName} at ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
