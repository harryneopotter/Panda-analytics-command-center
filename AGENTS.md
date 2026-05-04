# Agent Guide (doctor-visibility-dashboard)

This repository is a small Next.js App Router project (TypeScript, React 19, Next 16.x) with Tailwind CSS v4.

## Quick Commands

### Install

```bash
npm install
```

### Dev / Build / Start

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
```

### Lint

`package.json` defines `lint` as `eslint`.

```bash
npm run lint
```

Useful variants (eslint accepts file globs and flags):

```bash
npm run lint -- .
npm run lint -- --fix
npm run lint -- app/page.tsx
npx eslint .
npx eslint app/page.tsx --fix
```

### Typecheck

No explicit script is defined. Use `tsc` directly:

```bash
npx tsc -p tsconfig.json --noEmit
```

### Tests

No test runner is configured in this repo (no `test` script and no Jest/Vitest/Playwright deps).

If/when a test runner is added, prefer these patterns:

- Vitest single test file: `npx vitest path/to/file.test.ts`
- Vitest single test by name: `npx vitest -t "test name"`
- Jest single test file: `npx jest path/to/file.test.ts`
- Jest single test by name: `npx jest -t "test name"`
- Playwright single test file: `npx playwright test path/to/spec.ts`
- Playwright single test by name: `npx playwright test -g "test name"`

## Project Structure

- `app/` uses Next.js App Router.
- `app/layout.tsx` is the root layout; global CSS is `app/globals.css`.
- `app/page.tsx` is a client component (`'use client';`) and currently contains the full demo UI.
- Path alias is configured: `@/*` maps to repo root via `tsconfig.json`.

## Product / Copy Constraints

- This UI is a client-facing pitch/prototype that demonstrates the intended post-onboarding workflow; it is not a live product.
- Treat all metrics/signals as demo/sample placeholders unless they are sourced from real connected accounts with baseline tracking.
- Copy must emphasize compliance and doctor approval as enforced gates.
- Forbid ranking guarantees, testimonials, solicitation CTAs, or any implication of paid visibility.

## Agent Workflow Notes

- Look for `HISTORY.md`; create it if not present; append a brief entry for every task (what/why/files touched) before marking complete.
- Look for `ISSUES.md`; create it if not present; append entries for any error/failure (approach, why, outcome, next approach if needed).

## Code Style (Follow Existing Conventions)

### Language / TypeScript

- TypeScript strict mode is enabled (`tsconfig.json` has `"strict": true`).
- Prefer explicit types at module boundaries: component props, exported helpers, and complex objects.
- Use `type` for unions/intersections and simple object shapes; use `interface` when you expect extension/merging.
- Avoid `any`; prefer `unknown` + narrowing.
- Keep types near usage; extract reusable domain types to a `types/` module only when they are shared.

### React / Next.js

- Default to Server Components in `app/`; add `'use client'` only when needed (hooks, browser APIs, event handlers).
- Keep client components small; push data shaping and heavy computation to server components or plain helpers.
- Use `export const metadata` for document metadata (see `app/layout.tsx`).
- Avoid putting large static datasets inline in components unless it is truly demo/mock data.

### Imports

- Prefer ESM imports.
- Use type-only imports for types: `import type { X } from "...";`.
- Import order (grouped with a single blank line between groups):
  1) React/Next and other external packages
  2) Internal absolute imports via `@/` (or other internal modules)
  3) Relative imports (`./`, `../`)
  4) Side-effect imports (CSS) last, unless Next requires otherwise

### Formatting

- Match the repo's dominant quote style: most files use double quotes; keep it consistent.
- Prefer trailing commas in multiline objects/arrays when the formatter or ESLint enforces it.
- Keep JSX readable: wrap long prop values, avoid deeply nested ternaries, extract helpers.
- Prefer `const` over `let`; avoid reassignments.

Note: there is no Prettier config in this repo; formatting is primarily constrained by ESLint (Next core-web-vitals + TypeScript rules).

### Naming

- Components: `PascalCase` (e.g. `DoctorVisibilityDashboard`).
- Hooks: `useX`.
- Variables/functions: `camelCase`.
- Types/interfaces: `PascalCase`.
- Constants:
  - `camelCase` for local constants in components
  - `SCREAMING_SNAKE_CASE` only for true module-level constants that are broadly reused

### Error Handling

- Do not swallow errors. If a failure is expected/possible:
  - return a typed `Result`-style object (`{ ok: true, value } | { ok: false, error }`) in helpers, or
  - throw and let the caller decide, or
  - render a clear UI fallback with actionable messaging.
- In client components, handle async errors with UI state (`error` + `loading`), and keep side effects in `useEffect`.
- Avoid `console.log` in committed code; if needed, use `console.error` for error paths and remove before merge.

### CSS / Tailwind

- Tailwind is included via `@import "tailwindcss";` in `app/globals.css`.
- Prefer Tailwind utility classes for layout/spacing/typography; use CSS variables for theme tokens.
- For repeated className patterns, extract small components or helper functions rather than duplicating long strings.

## Lint Configuration Notes

- ESLint config is in `eslint.config.mjs` and uses:
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
- Next's default ignores are overridden and explicitly include `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.

## Repository Rules (Cursor/Copilot)

- No Cursor rules found (`.cursor/rules/` and `.cursorrules` are absent).
- No Copilot instructions found (`.github/copilot-instructions.md` is absent).

## Change Hygiene (For Agents)

- Keep diffs focused; do not reformat unrelated code.
- When editing `app/page.tsx`, prefer small refactors that split large JSX into components to reduce churn.
- Ensure `npm run build` and `npm run lint` pass after changes.
