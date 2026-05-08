# History

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
