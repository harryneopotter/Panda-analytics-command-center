# Dr. Visibility Dashboard

**Client-facing prototype for a doctor-led educational visibility operating system.**

Built for Dr. UserA (urologist / uro-oncology / robotics / renal transplant) to demonstrate a structured operating workflow for weekly video capture, multi-platform repurposing, compliance-aware review, and regional visibility tracking.

**Status:** Pre-contract demo (v0.1). All data is fictional/sample. Not production.

---

## Core Positioning

> Doctor-authored education, professionally packaged, compliance-reviewed, consistently published, and visibility-tracked.

The dashboard shows how the doctor’s original medical voice stays central while the service handles planning, packaging, consistency, platform adaptation, compliance review, and visibility tracking — without risky medical advertising or ranking guarantees.

---

## Features (9 Tabs)

| Tab | Purpose |
|-----|---------|
| **Overview** | Executive summary: workflow status, content system, compliance mode, focus areas, monthly plan |
| **Weekly Capture** | Upcoming shoot + topic list. Shows doctor inputs needed, status, risk levels, and capture flow |
| **Content Pipeline** | Operational table (topic, category, stage, outputs, doctor approval gate, compliance, next action) |
| **Reel Repurposing** | Sample “source clip → variants” cards (YT Shorts / Website FAQ / GBP education post) with compliance notes |
| **Compliance Review** | Checklist + flagged items with risk level, specific flags, and suggested fixes |
| **Visibility Map** | Interactive regional grid. Click city cards for gaps, suggested education topics, and platform recommendations |
| **Keyword Tracker** | Education queries turned into content priorities (sample signals, not promises) |
| **Competitor Snapshot** | Non-accusatory market scan (illustrative) focusing on tone/compliance patterns to avoid |
| **Monthly Report** | Output summary + sample signal narrative + next-month plan + required doctor inputs |

**Global elements:**
- Demo banner: “Prototype dashboard — Demo data | Publishing requires compliance review + doctor approval”
- Calm medical-professional theme with status accents

---

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- No external map library (CSS grid + interactive divs for demo speed)
- Zero backend / API calls — fully static demo data

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Useful checks:

```bash
npm run build
npm run lint
npx tsc -p tsconfig.json --noEmit
```

---

## Security Notes (npm audit)

This prototype pins framework deps (`next@16.x`). If `npm audit` reports a PostCSS advisory via Next’s dependency tree, prefer using npm `overrides` to bump `postcss` without downgrading Next.

---

## Map Data Schema & Population

The Visibility Map uses a hardcoded `mapNodes` array in `app/page.tsx` (`demoData.mapNodes`).

### Required Fields per Node

```ts
type MapNode = {
  id?: string;
  city: string;
  state: string;
  status: "Green" | "Yellow" | "Red" | "Blue";
  searchIntent: string[]; // example patient search queries
  currentGap: string; // qualitative assessment
  suggestedContent: string; // specific video/FAQ topic
  recommendedPlatforms: string[]; // IG Reel | YT Short | Website FAQ | GBP Post
  priority: "Low" | "Medium" | "High";
};
```

### How to Populate with Real Data

**Target geography:** Entire NCR + Haryana + Rajasthan + Uttar Pradesh + Bihar + adjacent states (no arbitrary radius).

1. **Priority nodes to seed first** (high search volume + referral potential):
   - **NCR core**: Gurugram, Delhi, Noida, Faridabad, Ghaziabad, Sonipat, Panipat, Rohtak, Meerut, Karnal, Hisar
   - **Haryana**: Panipat (already in demo), Rohtak, Hisar, Karnal, Ambala
   - **Rajasthan**: Jaipur, Jodhpur, Udaipur, Bikaner
   - **Uttar Pradesh**: Lucknow, Kanpur, Varanasi, Agra, Prayagraj, Gorakhpur
   - **Bihar**: Patna, Gaya, Muzaffarpur, Bhagalpur

2. **Data sources for production:**
   - Google Search Console (impressions, clicks, top queries by city/region)
   - Keyword research tools (search volume + competition for education queries)
   - Neutral SERP reviews (top results per query; no accusations)
   - Doctor content audit (what already has strong educational coverage)

3. **Status logic (example signal tiers, not promises):**
   - Green = consistently strong signals on high-intent education queries + strong video/FAQ coverage
   - Yellow = partial signals; needs more depth and distribution consistency
   - Red = weak signals or dominated by large aggregators; prioritize foundational education assets
   - Blue = clear demand signal with low/no doctor-led educational coverage

4. **Future upgrade path:**
   - Replace grid with a real map (Leaflet + coordinates)
   - Connect to Search Console / platform APIs once onboarded
   - Add time-series trend views per region

**Current demo uses 16 nodes** spanning NCR + Haryana + Rajasthan + Uttar Pradesh + Bihar. All cities are labeled by state.

---

## Demo Data Notes

- All content, rankings/signals, and metrics are fictional and clearly labeled.
- No patient data, no real hospital footage, no verified live rankings.
- Compliance language follows an educational-only posture (no superlatives, no guarantees, no testimonials, no solicitation CTAs).
- Doctor approval is shown as a required final gate.

---

## Production Recommendations

- Replace static demo data with a real database (e.g. Supabase / Postgres)
- Add authentication (doctor + operator roles)
- Integrate video upload + captioning + compliance review workflow
- Connect platform analytics after onboarding and baseline collection

---

**Built per PRD v0.1** — Doctor Visibility Dashboard prototype.
