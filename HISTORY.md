# History

## 2026-05-09
- Confirmed the Waterfox/Tailscale tab issue was a browser-injected hydration mismatch (`data-nm-theme="dark"` on `<html>`), then muted the warning with `suppressHydrationWarning` so the demo stays usable.
- Files touched: app/layout.tsx, HISTORY.md

## 2026-05-09
- Added `suppressHydrationWarning` on the root `<html>` element to mute browser-injected theme attribute hydration noise in Waterfox.
- Files touched: app/layout.tsx, HISTORY.md

## 2026-05-09
- Normalized the Next dev allowlist to the host/IP format Next expects for the Tailscale access points so dev HMR can load over the non-localhost origins.
- Files touched: next.config.ts, HISTORY.md

## 2026-05-09
- Generated hierarchy guidance for the repo: refreshed the root AGENTS file with an app-local pointer, added `app/AGENS.md` for the large demo surface, and recorded the repo-wide place to look for prototype copy and metadata edits.
- Files touched: AGENTS.md, app/AGENTS.md, HISTORY.md

## 2026-05-08
- Follow-up mobile fix: removed custom pointer-up/skip-click tab handling and switched tabs through a single direct click handler.
- This corrects the earlier touch-specific attempt below, which still left some mobile sessions over Tailscale unable to switch tabs reliably.
- Files touched: app/page.tsx, HISTORY.md, ISSUES.md
- Investigated mobile tab non-responsiveness reported over Tailscale-served dev URL and added touch-friendly tab interaction updates.
- Updated top tab buttons to reduce text-selection interference on touch devices (`select-none`, `touch-manipulation`) and to switch tabs on touch pointer-up in addition to click handling.
- Files touched: app/page.tsx, HISTORY.md, ISSUES.md

## 2026-05-05
- Documented latest review findings in a dedicated file for tracking and handoff, including four issues across compliance-stage styling, risk-level styling, ranking-language copy, and original-platform rendering.
- Expanded the same review document with an actionable fix plan and validation checklist (lint, typecheck, and manual UI checks) for the four reported issues.
- Files touched: REVIEW_COMMENTS_2026-05-05.md, HISTORY.md

## 2026-05-04
- Implemented medical-dash-v0.1 copy rewrite across all tabs; added consistent prototype/demo disclaimers, removed ranking/guarantee language in favor of sample “signals” language, and reinforced compliance + doctor approval as enforced publishing gates.
- Added copy-level scaffolding blocks (no backend) for Doctor Script Inbox statuses, Approval/Audit Log labels, clickable next actions examples, hospital scope selectors in Weekly Capture and Content Pipeline, and expanded compliance checklist flags.
- Files touched: app/page.tsx, HISTORY.md
