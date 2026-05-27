import fs from "node:fs/promises";
import path from "node:path";

export type ProjectManifest = {
  schemaVersion: string;
  projectContext: {
    domainId: string;
    domainLabel: string;
    generatedFor: string;
  };
  client: {
    name: string;
    domain: string;
    location: {
      city: string;
      state: string;
    };
  };
  dashboardConfig: {
    labels: Record<string, string>;
    enabledSections: string[];
    tabs: Array<{
      id: string;
      label: string;
      description?: string;
    }>;
  };
  overview: {
    executiveSummary: string;
    monthlyGoal: string;
    workflowStatus: string;
    focusAreas: string[];
  };
  researchSummary: {
    sourcesReviewed: number;
    competitorsReviewed: number;
    keywordsReviewed: number;
    regionsOrSegmentsChecked: number;
    lastUpdated: string;
  };
  focusNodes: Array<{
    id: string;
    type: string;
    label: string;
    status: string;
    currentGap: string;
    recommendedAction: string;
    recommendedPlatforms: string[];
    priority: string;
  }>;
  visibilitySignals: {
    summary: string;
    strongSignals: string[];
    weakSignals: string[];
    competitorPatterns: string[];
    highFrequencyGaps: string[];
  };
  keywords: Array<{
    keyword: string;
    category: string;
    regionOrSegment: string;
    intentType: string;
    currentVisibility: string;
    recommendedAction: string;
    priority: string;
  }>;
  competitors: Array<{
    name: string;
    observedStrength: string;
    contentGap: string;
    opportunity: string;
  }>;
  deliverables: Array<{
    type: string;
    title: string;
    purpose: string;
    platforms: string[];
    status: string;
    linkedGap: string;
    priority: string;
  }>;
  guardrails: {
    enabled: boolean;
    notes: string[];
    restrictedClaims: string[];
    approvalRequired: boolean;
  };
  clientInputsNeeded: Array<{
    item: string;
    neededBy: string;
    impactIfDelayed: string;
  }>;
  monthlyReport: {
    summary: string;
    whatWasDone: string[];
    whatChanged: string[];
    nextMonthPlan: string[];
    risksOrBlockers: string[];
  };
  notebooklmMeta: {
    used: boolean;
    sourceCount: number;
    lastUpdated: string;
    gapsDetected: number;
    highFrequencySignals: string[];
  };
  generatedViews: {
    domain: {
      id: string;
      label: string;
      audienceLabel: string;
      workflowStages: string[];
      complianceMode: string;
    };
    brand: {
      founded: string;
      industry: string;
      mission: string;
      founders: Array<{
        name: string;
        note: string;
      }>;
      productHighlights: Array<{
        name: string;
        purpose: string;
        format: string;
        status: string;
        ageRange: string;
      }>;
      differentiators: string[];
      pricing: string[];
      channels: string[];
    };
    market: {
      marketStats: string[];
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
      recommendations: string[];
      competitorNames: string[];
    };
    product: {
      names: string[];
      productFlavor: string;
      targetAge: string;
    };
    marketing: {
      socialStrategyBullets: string[];
    };
  };
};

export type InstanceSummary = {
  slug: string;
  name: string;
  domainLabel: string;
  domainId: string;
  status: string;
  generatedAt: string;
  route: string;
};

export type InstanceDetails = {
  manifest: ProjectManifest;
  instance: {
    schemaVersion: string;
    instanceType: string;
    projectSlug: string;
    projectName: string;
    domainId: string;
    domainLabel: string;
    generatedAt: string;
    status: string;
    sourceManifest: string;
    dashboardRoute: string;
    renderConfig: {
      labels: Record<string, string>;
      enabledSections: string[];
      tabs: Array<{
        id: string;
        label: string;
        description?: string;
      }>;
      guardrails: ProjectManifest["guardrails"];
    };
    outputs: {
      manifest: string;
      instance: string;
      summary: string;
    };
  };
};

const instancesRoot = path.join(process.cwd(), "instances");

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function listInstanceSummaries(): Promise<InstanceSummary[]> {
  try {
    const entries = await fs.readdir(instancesRoot, { withFileTypes: true });
    const summaries: InstanceSummary[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const slug = entry.name;
      const manifestPath = path.join(instancesRoot, slug, "manifest.json");
      const instancePath = path.join(instancesRoot, slug, "instance.json");
      const manifest = await readJson<ProjectManifest>(manifestPath);
      const instance = await readJson<InstanceDetails["instance"]>(instancePath);

      if (!manifest || !instance) {
        continue;
      }

      summaries.push({
        slug,
        name: manifest.client.name,
        domainLabel: manifest.projectContext.domainLabel,
        domainId: manifest.projectContext.domainId,
        status: instance.status,
        generatedAt: instance.generatedAt,
        route: instance.dashboardRoute,
      });
    }

    return summaries.sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    return [];
  }
}

export async function loadInstance(slug: string): Promise<InstanceDetails | null> {
  const manifestPath = path.join(instancesRoot, slug, "manifest.json");
  const instancePath = path.join(instancesRoot, slug, "instance.json");
  const manifest = await readJson<ProjectManifest>(manifestPath);
  const instance = await readJson<InstanceDetails["instance"]>(instancePath);

  if (!manifest || !instance) {
    return null;
  }

  return {
    manifest,
    instance,
  };
}
