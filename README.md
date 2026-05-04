# Dr. Visibility Dashboard

**Client-facing prototype for doctor-led educational content visibility system.**

Built for Dr. UserA (urologist / uro-oncology / robotics / renal transplant) to demonstrate a structured operating system for weekly video capture, multi-platform repurposing, compliance-aware review, and regional visibility tracking.

**Status:** Pre-contract demo (v0.1 Monday prototype). All data is fictional/sample. Not production.

---

## Core Positioning

> Doctor-authored videos, professionally packaged, compliance-reviewed, consistently published, and visibility-tracked.

The dashboard shows how the doctor’s original medical voice stays central while the service handles planning, packaging, consistency, platform adaptation, compliance review, and visibility tracking — without risky medical advertising or ranking guarantees.

---

## Features (9 Tabs)

| Tab | Purpose |
|-----|---------|
| **Overview** | Executive summary: visibility status, content system, compliance mode, focus areas, monthly system goal |
| **Weekly Capture** | Upcoming shoot card + 7-topic list for Kidney Stone Awareness theme. Shows doctor input needed, status, risk levels, and full capture flow |
| **Content Pipeline** | Full operational table (topic, category, stage, outputs, doctor approval, compliance, next action). 4 demo items with filters |
| **Reel Repurposing** | Before/after sample cards showing how existing IG reels become YT Shorts + Website FAQ + GBP posts with safe titles, descriptions, hashtags, and compliance notes |
| **Compliance Review** | Ethics & Content Safety Review checklist. Items flagged with risk level, specific flags, and suggested fixes. All NMC-safe language |
| **Visibility Map** | Interactive regional grid (Core NCR + Referral Belt). Clickable city cards showing status (Green/Yellow/Red/Blue), search intent, gaps, suggested content, and recommended platforms. Modal detail view |
| **Keyword Tracker** | Search topics turned into content priorities. Columns: keyword, category, visibility, competitor strength, recommended action, priority |
| **Competitor Snapshot** | Competitive intelligence without accusations. Safe labels (Strong/Moderate/Weak/Opportunity). Notes on tone/compliance patterns to avoid |
| **Monthly Report** | Output summary, visibility movement, next-month plan, required doctor input. Placeholder for real analytics |

**Global elements:**
- Persistent demo banner: “Sample Proposal Dashboard — Demo Data | Publishing requires doctor approval”
- Medical-professional dark navy theme with teal/emerald/amber status accents
- All badges, tables, and flows match PRD spec

---

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- No external map library (CSS grid + interactive divs for demo speed)
- Zero backend / API calls — fully static demo data
- Deployable on Vercel in one click

---

## Getting Started

```bash
unzip doctor-visibility-dashboard.zip
cd doctor-visibility-dashboard
npm install
npm run dev
```

Open http://localhost:3000

---

## Map Data Schema & Population

The Visibility Map uses a hardcoded `mapNodes` array in `app/page.tsx` (demoData.mapNodes).

### Required Fields per Node

```ts
type MapNode = {
  id?: string;
  city: string;
  state: string;
  status: "Green" | "Yellow" | "Red" | "Blue";
  searchIntent: string[]; // real patient search queries
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
   - Google Keyword Planner or Ahrefs/SEMrush (search volume + competition for “urologist in [city]”, “kidney stone treatment [city]”, “robotic urology [city]”, “renal transplant [state]”)
   - Competitor SERP analysis (top 3 results per query)
   - Doctor’s existing content audit (which topics already have strong coverage)

3. **Status logic (example rules):**
   - Green = ranking in top 3 for 2+ high-intent keywords + strong video/FAQ coverage
   - Yellow = top 10 but missing video/FAQ depth
   - Red = no presence or dominated by hospital aggregators
   - Blue = clear patient search demand with zero doctor-led content

4. **Future upgrade path:**
   - Replace grid with real Leaflet.js + React Leaflet + lat/lng coordinates
   - Add Google Maps Geocoding for precise pins
   - Connect to live Search Console API or custom visibility tracker
   - Add time-series trend lines per region

**Current demo uses 16 nodes** spanning NCR + Haryana + Rajasthan + Uttar Pradesh + Bihar with authentic 2026 patient search data (mix of English + Hindi terms). All cities labelled by state.

---

## Demo Data Notes

- All content, rankings, and metrics are fictional and clearly labelled.
- No patient data, no real hospital footage, no actual rankings.
- Compliance language strictly follows NMC 2026 educational-only rules (no superlatives, no guarantees, no testimonials, no before/after, no aggressive CTAs).
- Doctor approval is always shown as a required final gate.

---

## Production Recommendations

- Replace static JSON with real database (Supabase / PostgreSQL)
- Add authentication (Clerk or NextAuth) for doctor + operator roles
- Integrate real video upload + auto-caption + compliance AI review
- Connect Google Search Console + YouTube Analytics + Instagram Graph API
- Add PDF export for monthly reports
- Add real Leaflet map with live pins

---

## Why This Wins the Contract

- Proves this is **not** random social media management
- Shows repeatable weekly operating system (1–2 shoots → 6–7 reels → multi-platform repurposing)
- Demonstrates medical compliance awareness without over-promising
- Gives the doctor exactly what he asked for: “I only provide medical content and approval. The rest is handled.”

---

**Built per PRD v0.1** — Doctor Visibility Dashboard, Monday Demo Prototype.  
All rights to client. Do not redistribute without permission.
