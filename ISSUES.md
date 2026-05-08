# Issues Log

## 2026-05-08

- **Failure:** `npm run lint` failed initially with `sh: 1: eslint: not found`.
  - **Approach:** Installed dependencies using `npm install`.
  - **Outcome:** Lint command became available and passed.
  - **Next approach if needed:** Run `npm install` before validation in fresh environments.

- **Failure:** `npm run build` failed while fetching Google Fonts (`Geist`, `Geist Mono`) due to blocked/unavailable network access.
  - **Approach:** Proceeded with lint and typecheck validation to verify code correctness for this UI change.
  - **Outcome:** Lint and typecheck passed; build remains environment-blocked by external font fetch.
  - **Next approach if needed:** Use local/self-hosted fonts or run build in an environment with access to `fonts.googleapis.com`.
