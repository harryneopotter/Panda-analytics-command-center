# Vaanaya Health Instance

This directory contains the generated client dashboard instance for Vaanaya Health.

## Contents

- `manifest.json`: normalized client manifest
- `instance.json`: deployable instance metadata

## Deployment Notes

- Treat this directory as the client-specific package.
- The shared dashboard engine should read `manifest.json` and render the dashboard from the generated config.
- The instance is marked `ready-for-deploy` after validation.
