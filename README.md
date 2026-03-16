# Skins.com Status

Custom status page for `status.skins.com`, built and deployed from this repository.

## What this repo does

- Runs service checks from GitHub Actions every 5 minutes
- Stores rolling check history in-repo under `data/checks/`
- Syncs incidents and maintenance from GitHub issues
- Generates a fully custom Vue frontend for GitHub Pages

## Local development

```bash
npm install
npm run generate:data
npm run dev
```

## Data flow

1. `npm run monitor` checks every configured service in `data/services.json`.
2. Raw check history is updated in `data/checks/*.json`.
3. Incident data is synced from GitHub issues into `data/incidents/snapshot.json`.
4. `npm run generate:data` compiles the raw data into `public/data/status-data.json`.
5. GitHub Pages builds and deploys the Vue app.

## Incident workflow

Create incidents or maintenance events from the issue templates in this repo. They are automatically surfaced on the status page after the issue or a comment is added.
