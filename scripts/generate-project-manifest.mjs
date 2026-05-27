import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    input: "",
    output: "",
    domain: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--input" && next) {
      args.input = next;
      index += 1;
    } else if (token === "--output" && next) {
      args.output = next;
      index += 1;
    } else if (token === "--domain" && next) {
      args.domain = next;
      index += 1;
    }
  }

  return args;
}

function normalizeText(value) {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function stripMarkdown(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[_`]/g, "")
    .trim();
}

function extractSection(markdown, titlePattern) {
  const lines = markdown.split(/\r?\n/);
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/;
  const buffer = [];
  let capturing = false;
  let startLevel = 0;

  for (const line of lines) {
    const match = line.match(headingPattern);

    if (match) {
      const level = match[1].length;
      const title = stripMarkdown(match[2]);

      if (!capturing && titlePattern.test(title)) {
        capturing = true;
        startLevel = level;
        continue;
      }

      if (capturing && level <= startLevel) {
        break;
      }
    }

    if (capturing) {
      buffer.push(line);
    }
  }

  return normalizeText(buffer.join("\n"));
}

function extractTableValue(sectionContent, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\|\\*\\*${escapedLabel}\\*\\*\\|([^|\\n]+)\\|`, "i");
  const match = sectionContent.match(regex);
  return match ? stripMarkdown(match[1]) : "";
}

function extractBullets(sectionContent) {
  const lines = sectionContent.split(/\r?\n/);
  const items = [];
  let current = "";

  const bulletPattern = /^(\d+\.|[-*])\s+(.*)$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (current) {
        current += " ";
      }
      continue;
    }

    const bulletMatch = line.match(bulletPattern);
    if (bulletMatch) {
      if (current) {
        items.push(stripMarkdown(current.trim()));
      }
      current = bulletMatch[2];
      continue;
    }

    if (line.startsWith("#") || line.startsWith("|")) {
      continue;
    }

    if (current) {
      current += ` ${line}`;
    }
  }

  if (current) {
    items.push(stripMarkdown(current.trim()));
  }

  return items.filter(Boolean);
}

function extractBoldHeadings(sectionContent) {
  const matches = [...sectionContent.matchAll(/\*\*([^*]+)\*\*/g)];
  const values = matches.map((match) => stripMarkdown(match[1]));
  return [...new Set(values)].filter(Boolean);
}

function extractTableRows(sectionContent) {
  return sectionContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !/^\|[-:\s|]+\|$/.test(line))
    .map((line) =>
      line
        .split("|")
        .map((part) => stripMarkdown(part))
        .filter(Boolean),
    )
    .filter((cells) => {
      const headerLabels = new Set(["Product", "Attribute", "Details", "Name"]);
      return cells.length > 1 && !headerLabels.has(cells[0]);
    })
    .map((cells) => cells.join(" | "))
    .filter(Boolean);
}

function firstSentence(value) {
  const trimmed = stripMarkdown(value).replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return "";
  }

  const match = trimmed.match(/^(.+?[.!?])\s/);
  return match ? match[1] : trimmed;
}

function getDomainPack(researchText, requestedDomain) {
  const lower = researchText.toLowerCase();
  const detectedDomain = requestedDomain || (lower.includes("children's nutrition") || lower.includes("kids' nutrition") || lower.includes("pediatric") ? "consumer_health_children_nutrition" : "generic");

  const packs = {
    generic: {
      id: "generic",
      label: "Generic",
      domainLabel: "General Business",
      audienceLabel: "Clients / customers",
      labels: {
        focusNode: "Focus Area",
        visibilityGap: "Opportunity Gap",
        deliverable: "Content Asset",
        competitor: "Benchmark",
      },
      enabledSections: [
        "overview",
        "focusNodes",
        "visibilitySignals",
        "deliverables",
        "competitors",
        "monthlyReport",
      ],
      workflowStages: ["Idea", "Draft", "Review", "Approved", "Scheduled", "Published"],
      complianceMode: "review before publishing",
      tabs: [
        { id: "overview", label: "Overview" },
        { id: "intake", label: "Content Intake" },
        { id: "pipeline", label: "Content Pipeline" },
        { id: "signals", label: "Visibility Signals" },
        { id: "keywords", label: "Keyword Tracker" },
        { id: "competitors", label: "Competitor Snapshot" },
        { id: "review", label: "Review & Guardrails" },
        { id: "report", label: "Monthly Report" },
        { id: "research", label: "Research Summary" },
      ],
      restrictedClaims: ["Guaranteed results", "Unverified claims", "Testimonials presented as proof"],
      blockedCtAs: ["Buy now for guaranteed results", "Instant win promises"],
      requiredDisclaimers: ["Sample data only", "Claims require substantiation"],
    },
    consumer_health_children_nutrition: {
      id: "consumer_health_children_nutrition",
      label: "Consumer Health / Children Nutrition",
      domainLabel: "Children's Nutrition Brand",
      audienceLabel: "Parents / caregivers",
      labels: {
        focusNode: "Product / Topic",
        visibilityGap: "Demand Gap",
        deliverable: "Content Asset",
        competitor: "Benchmark Brand",
      },
      enabledSections: [
        "overview",
        "focusNodes",
        "visibilitySignals",
        "deliverables",
        "competitors",
        "monthlyReport",
      ],
      workflowStages: [
        "Idea",
        "Draft",
        "Claims Review",
        "Product Review",
        "Approved",
        "Scheduled",
        "Published",
      ],
      complianceMode: "claims review before publishing",
      tabs: [
        { id: "overview", label: "Overview" },
        { id: "intake", label: "Content Intake" },
        { id: "pipeline", label: "Content Pipeline" },
        { id: "signals", label: "Visibility Signals" },
        { id: "keywords", label: "Keyword Tracker" },
        { id: "competitors", label: "Competitor Snapshot" },
        { id: "review", label: "Compliance Review" },
        { id: "report", label: "Monthly Report" },
        { id: "research", label: "Research Summary" },
      ],
      restrictedClaims: [
        "Guaranteed health outcomes",
        "Medical treatment claims without substantiation",
        "Before/after performance promises",
        "Unverified 90% improvement claims",
      ],
      blockedCtAs: [
        "Buy now for guaranteed results",
        "Treats deficiencies without evidence",
        "Doctor-style treatment promises",
      ],
      requiredDisclaimers: [
        "Demo data only if presented as sample",
        "Claims must be substantiated",
        "Not medical advice",
      ],
    },
  };

  return packs[detectedDomain] ?? packs.generic;
}

function buildManifest(researchText, requestedDomain) {
  const domainPack = getDomainPack(researchText, requestedDomain);

  const companyProfile = extractSection(researchText, /Company Profile/i);
  const foundersSection = extractSection(researchText, /Founders and Leadership/i);
  const missionSection = extractSection(researchText, /Mission and Vision/i);
  const productPortfolio = extractSection(researchText, /Product Portfolio/i);
  const differentiatorsSection = extractSection(researchText, /Key Product Differentiators/i);
  const pricingSection = extractSection(researchText, /Pricing Strategy/i);
  const marketingSection = extractSection(researchText, /Social Media Strategy/i);
  const recommendationsSection = extractSection(researchText, /Strategic Recommendations/i);

  const companyName = extractTableValue(companyProfile, "Company Name") || "Unknown Client";
  const founded = extractTableValue(companyProfile, "Founded") || "";
  const industry = extractTableValue(companyProfile, "Industry") || domainPack.label;
  const headquarters = extractTableValue(companyProfile, "Headquarters") || "";

  const founderBullets = extractBullets(foundersSection);
  const founders = founderBullets.map((entry) => {
    const [name, ...rest] = entry.split(" - ");
    return {
      name: stripMarkdown(name).replace(/\d+$/g, "").trim(),
      note: rest.join(" - ").trim(),
    };
  });

  const missionSummary = firstSentence(missionSection);
  const productNames = [
    ...extractBoldHeadings(productPortfolio),
    ...extractTableRows(productPortfolio).map((row) => row.split(" | ")[0]),
  ]
    .filter((value) => {
      const excluded = new Set(["Core Products", "Gummies Range", "Form", "Flavors", "Purpose", "Benefits", "Key Ingredients", "Target Age", "Price", "Product", "Status"]);
      return !excluded.has(value) && !/^\d+(\.\d+)?\s/.test(value) && /(Mix|Gummies)/i.test(value);
    })
    .filter((value, index, array) => array.indexOf(value) === index);

  const productFlavor = productPortfolio.includes("Chocolate") ? "Chocolate" : "";
  const targetAgeMatches = [...new Set((productPortfolio.match(/\b\d+(?:-\d+|\+)?\s*years?\b/gi) ?? []).map((entry) => entry.replace(/\s+/g, " ").trim()))];
  const differentiators = extractBullets(differentiatorsSection);
  const pricingRows = extractTableRows(pricingSection);
  const channels = [
    "Own Website",
    "Amazon India",
    "Instagram",
    "WhatsApp",
    "Email",
  ];
  const socialStrategyBullets = extractBullets(marketingSection);
  const strengths = extractBullets(extractSection(researchText, /Strengths/i));
  const weaknesses = extractBullets(extractSection(researchText, /Weaknesses/i));
  const opportunities = extractBullets(extractSection(researchText, /Opportunities/i));
  const threats = extractBullets(extractSection(researchText, /Threats/i));
  const recommendations = extractBullets(recommendationsSection);

  const competitorNames = [
    "Horlicks",
    "Complan",
    "Boost",
    "Bournvita",
    "Pediasure",
    "Protinex",
  ];

  const focusNodes = [
    {
      id: "fn-product-education",
      type: "product",
      label: "Smart Growth Mix",
      status: "Yellow",
      searchIntent: [
        "kids nutrition powder",
        "clean label nutrition for kids",
        "children nutrition drink",
      ],
      currentGap:
        "Needs clearer explanation of ingredients, usage, and parent trust signals.",
      recommendedAction:
        "Create ingredient explainer, usage FAQ, and parent education carousel.",
      recommendedPlatforms: ["Website FAQ", "Instagram", "Amazon listing"],
      priority: "High",
    },
    {
      id: "fn-clean-label",
      type: "content_pillar",
      label: "Clean-label trust",
      status: "Green",
      searchIntent: [
        "no fillers no chemicals",
        "clean label nutrition for children",
        "natural nutrition drink",
      ],
      currentGap:
        "Brand trust is strong conceptually but needs clearer substantiation and repeated proof points.",
      recommendedAction:
        "Build a proof-led content pillar around certification, ingredients, and testing.",
      recommendedPlatforms: ["Instagram", "Website FAQ", "Email"],
      priority: "High",
    },
    {
      id: "fn-marketplace",
      type: "platform",
      label: "Amazon listings",
      status: "Yellow",
      searchIntent: ["buy kids nutrition online", "child nutrition supplement amazon"],
      currentGap:
        "Marketplace copy should be strengthened to answer parent concerns quickly.",
      recommendedAction:
        "Refresh titles, bullets, A+ content, and FAQs for trust and conversion.",
      recommendedPlatforms: ["Amazon", "Website", "Email"],
      priority: "High",
    },
    {
      id: "fn-parent-faq",
      type: "audience",
      label: "Parent FAQ",
      status: "Blue",
      searchIntent: [
        "how to choose kids nutrition",
        "is kids supplement safe",
        "what to check on labels for children",
      ],
      currentGap:
        "High-intent parent questions are not yet covered with enough educational depth.",
      recommendedAction:
        "Create a parent FAQ hub and comparison guide for label literacy.",
      recommendedPlatforms: ["Website FAQ", "Blog", "Instagram"],
      priority: "High",
    },
    {
      id: "fn-subscription",
      type: "service",
      label: "Subscription retention",
      status: "Red",
      searchIntent: [
        "kids nutrition subscription",
        "repeat purchase nutrition product",
      ],
      currentGap:
        "Recurring purchase messaging and nurture flow need clearer value framing.",
      recommendedAction:
        "Develop a subscription landing page and retention email series.",
      recommendedPlatforms: ["Website", "Email", "WhatsApp"],
      priority: "Medium",
    },
  ];

  const keywords = [
    {
      keyword: "kids nutrition powder",
      category: "Product",
      regionOrSegment: "India",
      intentType: "Commercial",
      currentVisibility: "Partial",
      recommendedAction: "Create product explainer and comparison content",
      priority: "High",
    },
    {
      keyword: "clean label nutrition for kids",
      category: "Trust",
      regionOrSegment: "India",
      intentType: "Informational",
      currentVisibility: "Weak",
      recommendedAction: "Build certification and ingredient transparency content",
      priority: "High",
    },
    {
      keyword: "no added sugar kids drink",
      category: "Ingredient",
      regionOrSegment: "India",
      intentType: "Commercial",
      currentVisibility: "Partial",
      recommendedAction: "Publish sweetener and ingredient FAQ",
      priority: "High",
    },
    {
      keyword: "best nutrition for kids in India",
      category: "Category",
      regionOrSegment: "India",
      intentType: "Commercial",
      currentVisibility: "Weak",
      recommendedAction: "Create category comparison and parent decision guide",
      priority: "High",
    },
    {
      keyword: "kids supplement amazon",
      category: "Marketplace",
      regionOrSegment: "Amazon India",
      intentType: "Commercial",
      currentVisibility: "Partial",
      recommendedAction: "Strengthen marketplace listing and review-proof assets",
      priority: "Medium",
    },
  ];

  const competitors = competitorNames.map((name) => ({
    name,
    observedStrength: name === "Pediasure" ? "Medical-grade positioning" : "Heritage brand recognition",
    channels: [
      {
        name: "Website",
        status: name === "Pediasure" ? "Strong" : "Strong",
        notes: "Recognized brand presence and high awareness",
      },
      {
        name: "Instagram",
        status: name === "Pediasure" ? "Moderate" : "Moderate",
        notes: "Social brand support and parent-facing content",
      },
      {
        name: "YouTube",
        status: name === "Pediasure" ? "Moderate" : "Moderate",
        notes: "Educational and awareness content",
      },
      {
        name: "Marketplace",
        status: "Strong",
        notes: "Retail and e-commerce distribution advantage",
      },
    ],
    contentGap:
      "Needs more proof-led, parent-friendly comparison content and clean-label explanation.",
    opportunity:
      "Differentiate with transparency, Indian superfoods, and founder-led trust building.",
  }));

  const deliverables = [
    {
      type: "FAQ",
      title: "Parent FAQ: How to choose a clean-label kids nutrition product",
      purpose: "Answer trust and label questions early",
      platforms: ["Website", "Instagram"],
      status: "Planned",
      linkedGap: "Parent FAQ",
      priority: "High",
    },
    {
      type: "BLOG_POST",
      title: "What does clean-label nutrition mean for children?",
      purpose: "Educate parents on ingredient transparency",
      platforms: ["Website", "Email"],
      status: "Planned",
      linkedGap: "Clean-label trust",
      priority: "High",
    },
    {
      type: "SOCIAL_POST",
      title: "Ingredient spotlight: ragi, ashwagandha, and brahmi",
      purpose: "Build proof-led awareness around formulation",
      platforms: ["Instagram", "WhatsApp"],
      status: "Planned",
      linkedGap: "Product education",
      priority: "High",
    },
    {
      type: "LANDING_PAGE",
      title: "Subscription plan and repeat purchase benefits",
      purpose: "Support retention and recurring revenue",
      platforms: ["Website"],
      status: "Planned",
      linkedGap: "Subscription retention",
      priority: "Medium",
    },
    {
      type: "DIRECTORY_UPDATE",
      title: "Amazon listing refresh for Smart Growth Mix",
      purpose: "Improve marketplace clarity and conversion",
      platforms: ["Amazon India"],
      status: "Planned",
      linkedGap: "Marketplace listings",
      priority: "High",
    },
  ];

  const overview = {
    executiveSummary:
      "Premium D2C children’s nutrition brand focused on clean-label trust, parent education, and repeat purchase growth.",
    monthlyGoal:
      "Strengthen parent trust, publish proof-led product education, and improve marketplace clarity.",
    workflowStatus: "Needs Attention",
    focusAreas: [
      "Product education",
      "Clean-label trust",
      "Amazon listing optimization",
      "Parent FAQ depth",
    ],
  };

  const researchSummary = {
    sourcesReviewed: 11,
    competitorsReviewed: competitorNames.length,
    keywordsReviewed: keywords.length,
    regionsOrSegmentsChecked: 3,
    lastUpdated: new Date().toISOString(),
  };

  const visibilitySignals = {
    summary:
      "Strong clean-label positioning and founder story; weaker category awareness versus heritage brands.",
    strongSignals: [
      "Clean-label certification and ingredient transparency",
      "Founder-led trust story",
      "Premium brand positioning",
    ],
    weakSignals: [
      "Limited brand awareness versus heritage brands",
      "Needs stronger parent FAQ depth",
      "Marketplace copy can be clearer",
    ],
    competitorPatterns: [
      "Heritage brands win on recognition",
      "Premium brands win on medical credibility",
      "Vaanaya can win on clean-label trust and Indian ingredient story",
    ],
    highFrequencyGaps: [
      "Ingredient explanation",
      "Parent decision support",
      "Subscription value framing",
    ],
  };

  const monthlyReport = {
    summary:
      "Sample monthly report structure for a children’s nutrition brand, with emphasis on trust, product education, and channel clarity.",
    whatWasDone: [
      "Drafted product education assets",
      "Outlined parent FAQ topics",
      "Prepared marketplace improvement list",
    ],
    whatChanged: [
      "More structured trust messaging",
      "Clearer differentiation from heritage brands",
      "Sharper channel focus on website, Amazon, and Instagram",
    ],
    nextMonthPlan: [
      "Publish ingredient explainer series",
      "Refresh Amazon product pages",
      "Launch parent FAQ hub",
      "Draft subscription retention messaging",
    ],
    risksOrBlockers: [
      "Unsupported health claims",
      "Slow brand awareness growth",
      "Price sensitivity in the premium segment",
    ],
  };

  const clientInputsNeeded = [
    {
      item: "Approved product fact sheet and ingredient list",
      neededBy: "Before claims review",
      impactIfDelayed: "Content cannot move to approval without substantiated facts",
    },
    {
      item: "Restricted claims and legal review notes",
      neededBy: "Before publishing",
      impactIfDelayed: "Marketplace and social copy must remain conservative",
    },
    {
      item: "Brand voice, tone, and visual rules",
      neededBy: "Before content production",
      impactIfDelayed: "Assets may not match brand expectations",
    },
  ];

  const productHighlights = [
    {
      name: "Smart Growth Mix",
      purpose: "Daily nutrition for height, bone strength, and immunity",
      format: "Powder",
      status: "Available",
      ageRange: "3-12 years",
    },
    {
      name: "Smart Growth Mix 12+",
      purpose: "Nutrition support for older children and teens",
      format: "Powder",
      status: "Available",
      ageRange: "12+ years",
    },
    {
      name: "Smart Focus Mix",
      purpose: "Focus, calm energy, and digestive support",
      format: "Sachets",
      status: "Available",
      ageRange: "3-12 years",
    },
    {
      name: "Multivitamin Gummies",
      purpose: "Daily vitamins for kids",
      format: "Gummies",
      status: "Available",
      ageRange: "3-12 years",
    },
  ];

  const marketStats = [
    "Indian nutritional supplements market valued at USD 42.97 billion in 2024",
    "Indian pediatric nutritional supplements market projected at USD 13.1 billion by 2034",
    "Children's nutrition is moving toward clean-label, child-friendly formats, and e-commerce",
  ];

  const complianceNotes = [
    "No guaranteed health outcomes",
    "No unsupported medical treatment claims",
    "No before/after promises",
    "Claims require substantiation before publishing",
    "Doctor-style medical language should be avoided",
  ];

  const restrictedClaims = [
    ...domainPack.restrictedClaims,
    "90% test-group improvement claims without documented substantiation",
  ];

  const currentDomain = "consumer_health / children_nutrition";
  const lastUpdated = new Date().toISOString();

  return {
    schemaVersion: "1.0.0",
    projectContext: {
      domainId: domainPack.id,
      domainLabel: domainPack.label,
      generatedFor: companyName,
    },
    client: {
      name: companyName,
      domain: currentDomain,
      location: {
        city: headquarters ? headquarters.split(",")[0].trim() : "Delhi",
        state: headquarters.includes(",") ? headquarters.split(",").slice(1).join(",").trim() : "India",
      },
    },
    dashboardConfig: {
      labels: domainPack.labels,
      enabledSections: domainPack.enabledSections,
      tabs: domainPack.tabs,
    },
    overview,
    researchSummary,
    focusNodes,
    visibilitySignals,
    keywords,
    competitors,
    deliverables,
    guardrails: {
      enabled: true,
      notes: complianceNotes,
      restrictedClaims,
      approvalRequired: true,
    },
    clientInputsNeeded,
    monthlyReport,
    notebooklmMeta: {
      used: true,
      sourceCount: 11,
      lastUpdated,
      gapsDetected: weaknesses.length + threats.length,
      highFrequencySignals: [
        "clean-label trust",
        "parent education",
        "premium nutrition positioning",
      ],
    },
    generatedViews: {
      domain: {
        id: domainPack.id,
        label: domainPack.domainLabel,
        audienceLabel: domainPack.audienceLabel,
        workflowStages: domainPack.workflowStages,
        complianceMode: domainPack.complianceMode,
      },
      brand: {
        founded,
        industry,
        mission: missionSummary || "Every kid's life healthier and happier with optimal nutrition.",
        founders,
        productHighlights,
        differentiators,
        pricing: pricingRows,
        channels,
      },
      market: {
        marketStats,
        strengths,
        weaknesses,
        opportunities,
        threats,
        recommendations,
        competitorNames,
      },
      product: {
        names: productNames,
        productFlavor,
        targetAge: targetAgeMatches.join(" and ") || "3-12 years",
      },
      marketing: {
        socialStrategyBullets,
      },
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    throw new Error("Usage: node scripts/generate-project-manifest.mjs --input <research.md> [--output <manifest.json>] [--domain <domain-id>]");
  }

  const inputPath = path.resolve(process.cwd(), args.input);
  const markdown = await fs.readFile(inputPath, "utf8");
  const manifest = buildManifest(markdown, args.domain);
  const output = `${JSON.stringify(manifest, null, 2)}\n`;

  if (args.output) {
    const outputPath = path.resolve(process.cwd(), args.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, output, "utf8");
  } else {
    process.stdout.write(output);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
