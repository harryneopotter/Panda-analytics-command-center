# History

## 2026-05-14
- Colored the instance dashboard cards by signal status/priority so high-signal items read visually instead of relying on corner tags, and added instance-level metadata so the browser title shows the client name on the generated route.
- Files touched: components/instance-dashboard/instance-dashboard.tsx, app/instances/[slug]/page.tsx, app/instances/page.tsx, HISTORY.md

## 2026-05-14
- Added a runtime viewer for generated client instances under `/instances`, plus shared instance-loading helpers so the Vaanya Health package can be opened directly in the browser.
- Files touched: lib/instances.ts, app/instances/page.tsx, app/instances/[slug]/page.tsx, HISTORY.md

## 2026-05-14
- Added the bootstrap workflow scripts for manifest validation and instance scaffolding, then generated the first client package at `instances/vaanaya-health/` from the Vaanaya Health research brief.
- Files touched: docs/project-manifest.schema.json, scripts/validate-project-manifest.mjs, scripts/generate-project-instance.mjs, scripts/bootstrap-client-project.mjs, package.json, docs/project-manifest-pipeline.md, instances/vaanaya-health/*, HISTORY.md

## 2026-05-27
- Rewrote `README.md` to reflect the repository's evolution from a single-client doctor-led prototype into a reusable manifest-driven client dashboard generator, while preserving the original origin story.
- Files touched: README.md, HISTORY.md

## 2026-05-14
- Tightened the instance dashboard status palette so red, yellow, green, and blue read more distinctly on the dark shell, and added a status legend above the active sections for color meaning.
- Files touched: components/instance-dashboard/instance-dashboard.tsx, HISTORY.md

## 2026-05-14
- Added a research-doc-to-manifest pipeline with `scripts/generate-project-manifest.mjs`, then generated a Vaanya Health example manifest in `generated/vaanaya-health.manifest.json` from the provided market research file.
- Added `docs/project-manifest-pipeline.md` plus repo orientation updates so future work can find the generator, manifest example, and extraction rules quickly.
- Files touched: scripts/generate-project-manifest.mjs, docs/project-manifest-pipeline.md, generated/vaanaya-health.manifest.json, AGENTS.md, CODEBASE_OVERVIEW.md, HISTORY.md

## 2026-05-14
- Added `CODEBASE_OVERVIEW.md` as a compact repo map for future work, updated `AGENTS.md` to point agents at the orientation docs, and created `ISSUES.md` to capture workspace failures and fallback notes.
- Files touched: AGENTS.md, CODEBASE_OVERVIEW.md, ISSUES.md, HISTORY.md

## 2026-05-05
- Documented latest review findings in a dedicated file for tracking and handoff, including four issues across compliance-stage styling, risk-level styling, ranking-language copy, and original-platform rendering.
- Expanded the same review document with an actionable fix plan and validation checklist (lint, typecheck, and manual UI checks) for the four reported issues.
- Files touched: REVIEW_COMMENTS_2026-05-05.md, HISTORY.md

## 2026-05-04
- Implemented medical-dash-v0.1 copy rewrite across all tabs; added consistent prototype/demo disclaimers, removed ranking/guarantee language in favor of sample “signals” language, and reinforced compliance + doctor approval as enforced publishing gates.
- Added copy-level scaffolding blocks (no backend) for Doctor Script Inbox statuses, Approval/Audit Log labels, clickable next actions examples, hospital scope selectors in Weekly Capture and Content Pipeline, and expanded compliance checklist flags.
- Files touched: app/page.tsx, HISTORY.md
