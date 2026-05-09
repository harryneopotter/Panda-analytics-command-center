# App Area Guide

## Overview
`app/` is the only source area with product logic. `app/page.tsx` is a large client-side demo surface; `app/layout.tsx` owns document metadata and font wiring; `app/globals.css` holds the Tailwind entry + theme tokens.

## Structure
- `page.tsx` — single-screen prototype UI, tab state, mock data, interactive demo panels.
- `layout.tsx` — metadata, fonts, shell markup.
- `globals.css` — Tailwind import and app-wide styling tokens.

## Where to Look
| Task | Location | Notes |
|------|----------|-------|
| Edit dashboard copy or flow | `app/page.tsx` | Keep compliance/doctor-approval gates explicit. |
| Update page metadata/fonts | `app/layout.tsx` | Document title/description live here. |
| Adjust theme/token styling | `app/globals.css` | Prefer variables and utilities over new CSS blocks. |

## Conventions
- Treat `page.tsx` as a demo prototype, not a production app shell.
- Keep stateful logic local to the client component unless it becomes clearly reusable.
- Preserve the medical/compliance tone; no ranking promises, testimonials, or solicitation CTA language.
- Prefer small, targeted edits inside the large file instead of broad reshuffles.

## Anti-patterns
- Don’t add backend/API wiring without an explicit product change.
- Don’t move demo data to new modules unless the file becomes unmanageable.
- Don’t split the page into extra route segments for cosmetic reasons.
- Don’t weaken the compliance/doctor approval gate copy.
