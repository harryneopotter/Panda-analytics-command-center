# Codebase Overview

This repository is a small Next.js App Router prototype for a doctor-led educational visibility workflow. It is intentionally demo-first: the UI is built to show the operating model, not to connect to live analytics or publishing systems.

## Main Files

- `app/page.tsx` contains the full demo UI in one client component.
- `app/layout.tsx` defines the root document shell, metadata, and Google font setup.
- `app/globals.css` sets the Tailwind import and global theme tokens.
- `README.md` explains the product positioning and the available demo tabs.
- `AGENTS.md` contains the working rules for future agent sessions.
- `HISTORY.md` tracks completed tasks.
- `ISSUES.md` tracks failures, blockers, and fallback approaches.
- `scripts/generate-project-manifest.mjs` turns a research markdown file into a normalized project manifest.
- `scripts/validate-project-manifest.mjs` checks the generated manifest against the required project shape.
- `scripts/generate-project-instance.mjs` scaffolds a client-specific instance package from a validated manifest.
- `scripts/bootstrap-client-project.mjs` runs generate -> validate -> instance in one step.
- `generated/vaanaya-health.manifest.json` is the example output generated from the research brief.
- `instances/vaanaya-health/` is the generated client package created from the Vaanya Health research brief.

## Runtime Shape

- Next.js App Router, React 19, TypeScript strict mode, Tailwind CSS v4.
- No backend routes, database, auth layer, or test runner are configured.
- The page is a client component because it relies on local state, modal interactions, and tab switching.
- All content and metrics shown in the dashboard are sample/demo data unless the app is later wired to real sources.

## Current UI Structure

The single page is organized into these sections:

1. Overview
2. Weekly Capture
3. Content Pipeline
4. Reel Repurposing
5. Compliance Review
6. Visibility Map
7. Keyword Tracker
8. Competitor Snapshot
9. Monthly Report

The data model is embedded in `demoData` inside `app/page.tsx`, with local TypeScript types for tabs, content items, compliance entries, map nodes, keywords, competitors, and monthly reporting.

## Domain Constraints

- Treat visibility, ranking, and performance numbers as illustrative samples.
- Keep compliance review and doctor approval as enforced gates in copy and UI.
- Do not introduce ranking guarantees, testimonials, solicitation CTAs, or any implication of paid visibility.
- Preserve the educational, prototype, and non-production framing.

## Working Notes

- `app/page.tsx` is large by design; if code changes are needed, prefer small refactors that split out stable subcomponents instead of rewriting the whole file.
- Match the existing conventions: double quotes, TypeScript strictness, Tailwind utilities, and focused diffs.
- Useful checks are `npm run lint`, `npm run build`, and `npx tsc -p tsconfig.json --noEmit`.
- The manifest generator is intentionally lightweight and heuristic-driven; refine the extraction rules when new domain packs expose different markdown shapes.

## First Places To Look

- If the task is about copy or compliance language, check `app/page.tsx` and `README.md`.
- If the task is about app structure or agent workflow, check `AGENTS.md`.
- If the task is about recent changes, check `HISTORY.md`.
- If the task is about a failure or workaround, check `ISSUES.md`.
