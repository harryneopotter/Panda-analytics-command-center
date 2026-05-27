# Project Manifest Pipeline

This repo now includes a lightweight generator that turns a research markdown document into a normalized project manifest for a client-facing dashboard, then validates it and scaffolds a client-specific instance package.

## Inputs

- Research brief or market research doc
- Domain pack hint, if needed
- Project/schema expectations from the dashboard

## Output

- A project manifest JSON file that can seed a client dashboard instance
- The manifest includes project metadata, dashboard config, guardrails, research summary, content focus, competitors, deliverables, and reporting fields
- A client instance directory with the validated manifest, deployable instance metadata, and a small README handoff file

## Script

`scripts/generate-project-manifest.mjs`
`scripts/validate-project-manifest.mjs`
`scripts/generate-project-instance.mjs`
`scripts/bootstrap-client-project.mjs`

### Example

```bash
node scripts/generate-project-manifest.mjs --input "D:\Downloads\Market research on Vaanaya Health.md" --output generated\vaanaya-health.manifest.json
```

### One-step bootstrap

```bash
node scripts/bootstrap-client-project.mjs --input "D:\Downloads\Market research on Vaanaya Health.md" --output-dir instances\vaanaya-health
```

## Notes

- The generator auto-detects the children-nutrition domain from the Vaanya Health research brief.
- The output is intentionally normalized so the dashboard engine can render it without knowing the original research format.
- The generated manifest keeps guardrails first-class, so compliance claims remain explicit in the data model.
- The validation script ensures the generated manifest has the required top-level structure before instance generation.
- The instance generator writes a client-specific package that can be handed off for deployment.
