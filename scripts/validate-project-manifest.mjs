import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    input: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--input" && next) {
      args.input = next;
      index += 1;
    }
  }

  return args;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pushError(errors, message) {
  errors.push(message);
}

function requireString(errors, value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    pushError(errors, `${label} must be a non-empty string`);
  }
}

function requireArray(errors, value, label) {
  if (!Array.isArray(value)) {
    pushError(errors, `${label} must be an array`);
  }
}

function requireObject(errors, value, label) {
  if (!isObject(value)) {
    pushError(errors, `${label} must be an object`);
  }
}

function validateManifest(manifest) {
  const errors = [];

  requireObject(errors, manifest, "manifest");
  if (!isObject(manifest)) {
    return errors;
  }

  requireString(errors, manifest.schemaVersion, "schemaVersion");
  requireObject(errors, manifest.projectContext, "projectContext");
  requireObject(errors, manifest.client, "client");
  requireObject(errors, manifest.dashboardConfig, "dashboardConfig");
  requireObject(errors, manifest.overview, "overview");
  requireObject(errors, manifest.researchSummary, "researchSummary");
  requireArray(errors, manifest.focusNodes, "focusNodes");
  requireObject(errors, manifest.visibilitySignals, "visibilitySignals");
  requireArray(errors, manifest.keywords, "keywords");
  requireArray(errors, manifest.competitors, "competitors");
  requireArray(errors, manifest.deliverables, "deliverables");
  requireObject(errors, manifest.guardrails, "guardrails");
  requireArray(errors, manifest.clientInputsNeeded, "clientInputsNeeded");
  requireObject(errors, manifest.monthlyReport, "monthlyReport");
  requireObject(errors, manifest.notebooklmMeta, "notebooklmMeta");
  requireObject(errors, manifest.generatedViews, "generatedViews");

  if (isObject(manifest.projectContext)) {
    requireString(errors, manifest.projectContext.domainId, "projectContext.domainId");
    requireString(errors, manifest.projectContext.domainLabel, "projectContext.domainLabel");
    requireString(errors, manifest.projectContext.generatedFor, "projectContext.generatedFor");
  }

  if (isObject(manifest.client)) {
    requireString(errors, manifest.client.name, "client.name");
    requireString(errors, manifest.client.domain, "client.domain");
    requireObject(errors, manifest.client.location, "client.location");
    if (isObject(manifest.client.location)) {
      requireString(errors, manifest.client.location.city, "client.location.city");
      requireString(errors, manifest.client.location.state, "client.location.state");
    }
  }

  if (isObject(manifest.dashboardConfig)) {
    requireObject(errors, manifest.dashboardConfig.labels, "dashboardConfig.labels");
    requireArray(errors, manifest.dashboardConfig.enabledSections, "dashboardConfig.enabledSections");
    requireArray(errors, manifest.dashboardConfig.tabs, "dashboardConfig.tabs");

    if (Array.isArray(manifest.dashboardConfig.tabs)) {
      manifest.dashboardConfig.tabs.forEach((tab, index) => {
        if (!isObject(tab)) {
          pushError(errors, `dashboardConfig.tabs[${index}] must be an object`);
          return;
        }
        requireString(errors, tab.id, `dashboardConfig.tabs[${index}].id`);
        requireString(errors, tab.label, `dashboardConfig.tabs[${index}].label`);
      });
    }
  }

  if (isObject(manifest.guardrails)) {
    if (typeof manifest.guardrails.enabled !== "boolean") {
      pushError(errors, "guardrails.enabled must be a boolean");
    }
    if (typeof manifest.guardrails.approvalRequired !== "boolean") {
      pushError(errors, "guardrails.approvalRequired must be a boolean");
    }
    requireArray(errors, manifest.guardrails.notes, "guardrails.notes");
    requireArray(errors, manifest.guardrails.restrictedClaims, "guardrails.restrictedClaims");
  }

  if (isObject(manifest.researchSummary)) {
    for (const key of ["sourcesReviewed", "competitorsReviewed", "keywordsReviewed", "regionsOrSegmentsChecked"]) {
      if (typeof manifest.researchSummary[key] !== "number") {
        pushError(errors, `researchSummary.${key} must be a number`);
      }
    }
    requireString(errors, manifest.researchSummary.lastUpdated, "researchSummary.lastUpdated");
  }

  if (isObject(manifest.notebooklmMeta)) {
    if (typeof manifest.notebooklmMeta.used !== "boolean") {
      pushError(errors, "notebooklmMeta.used must be a boolean");
    }
    for (const key of ["sourceCount", "gapsDetected"]) {
      if (typeof manifest.notebooklmMeta[key] !== "number") {
        pushError(errors, `notebooklmMeta.${key} must be a number`);
      }
    }
    requireString(errors, manifest.notebooklmMeta.lastUpdated, "notebooklmMeta.lastUpdated");
    requireArray(errors, manifest.notebooklmMeta.highFrequencySignals, "notebooklmMeta.highFrequencySignals");
  }

  return errors;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    throw new Error("Usage: node scripts/validate-project-manifest.mjs --input <manifest.json>");
  }

  const inputPath = path.resolve(process.cwd(), args.input);
  const raw = await fs.readFile(inputPath, "utf8");
  const manifest = JSON.parse(raw);
  const errors = validateManifest(manifest);

  if (errors.length > 0) {
    console.error("Manifest validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  const projectName = manifest?.client?.name ?? "Unknown project";
  console.log(`Manifest validated for ${projectName}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
