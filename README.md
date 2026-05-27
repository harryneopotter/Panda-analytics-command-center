# Client Dashboard Generator

This repository started life as a **single-client, doctor-led visibility dashboard** and was later refactored into a **reusable manifest-driven dashboard generator**.

The original prototype was built to show one client how an educational content workflow could work end to end:

- capture input
- shape content
- review compliance
- track visibility
- report progress

That first version was useful, but it was still tied to one domain and one operating model. The current repo keeps that origin story, but now supports a more general flow:

- take a client research brief
- normalize it into a project manifest
- generate a client-specific dashboard instance
- render that instance from the manifest
- hand it off for deployment

## What This Repo Is Now

This is not a live backend product. It is a **client delivery tool** for generating branded dashboard instances from research and schema input.

The current shape is:

- a shared dashboard engine
- a schema for project manifests
- a generator that converts research into a manifest
- a validator for the manifest shape
- a generated client instance package
- a viewer for generated instances

## How It Evolved

### 1. Single client prototype

The app began as a doctor-focused dashboard prototype. The goal was to prove the operating model for one client and one workflow.

### 2. Structured schema

Once the workflow became clearer, the dashboard data was moved toward a manifest schema so the UI could be driven by data instead of hardcoded copy.

### 3. Reusable generator

The repo then gained a lightweight pipeline that turns a client research document into:

- a normalized manifest
- a validated instance package
- a deployable client-specific dashboard

### 4. Reusable client delivery

The long-term direction is not “one dashboard for everyone.” It is:

- one shared engine
- one generated instance per client
- one consistent workflow for each project

## Example

The repo includes an example client instance for **Vaanaya Health**, generated from a market research brief.

That example demonstrates the current flow:

- research brief in
- manifest out
- instance package out
- dashboard rendered from the manifest

## Repository Layout

- `app/` contains the Next.js App Router pages.
- `app/page.tsx` is the original prototype dashboard.
- `app/instances/` renders generated client instances.
- `components/instance-dashboard/` contains the manifest-driven tabbed dashboard UI.
- `docs/project-manifest.schema.json` defines the manifest shape.
- `docs/project-manifest-pipeline.md` describes the research -> manifest -> instance flow.
- `scripts/` contains the generator, validator, and bootstrap scripts.
- `generated/` contains example manifest output.
- `instances/` contains generated client instance packages.
- `AGENTS.md` contains working instructions for future agent sessions.

## Running Locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/` for the original prototype dashboard
- `http://localhost:3000/instances` for the generated instance index
- `http://localhost:3000/instances/vaanaya-health` for the example client instance

Useful checks:

```bash
npm run lint
npm run build
npx tsc -p tsconfig.json --noEmit
```

## Generating A Client Instance

The pipeline is intentionally lightweight.

### One-step bootstrap

```bash
node scripts/bootstrap-client-project.mjs --input "D:\Downloads\Market research on Vaanaya Health.md" --output-dir instances\vaanaya-health
```

### What the pipeline does

1. Reads the client research document
2. Normalizes it into a manifest
3. Validates the manifest against the schema
4. Generates a client instance package
5. Marks the instance as ready for deployment

## Product Constraints

- Treat all metrics, signals, and rankings as demo/sample data unless they come from real connected sources.
- Keep compliance review and approval gates explicit in the UI and copy.
- Do not introduce ranking guarantees, testimonials, solicitation CTAs, or any implication of paid visibility.
- Keep the client-facing output brandable, reusable, and domain-aware.

## Current Status

This repo is now both:

- the original prototype dashboard, kept as the starting point
- the reusable generator that turns client research into a dashboard instance

That is the core story: it began as one dashboard for one client, then grew into a repeatable delivery tool.
