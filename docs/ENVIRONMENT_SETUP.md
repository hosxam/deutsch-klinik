# ENVIRONMENT_SETUP.md

## Quick Start

```bash
# Clone
git clone https://github.com/hosxam/deutsch-klinik.git
cd deutsch-klinik

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Required Environment Variables

None. The app works fully without any environment variables.

## Optional Environment Variables

### Supabase (Cloud Sync + Auth)

For cloud progress syncing across devices. If not configured, all data stays in localStorage and the sync panel shows "not configured".

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Cloudflare AI (Writing/Speaking Correction)

For AI-powered writing and speaking feedback. If not configured, correction features gracefully show "unavailable".

```bash
CLOUDFLARE_AI_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

### Test Environment

```bash
# Used by Playwright tests to point to the preview server
PREVIEW_URL=http://127.0.0.1:4175/deutsch-klinik/
# Default: http://127.0.0.1:4175/deutsch-klinik/

# For ai-unavailable tests (requires dev server running)
BASE_URL=http://localhost:5173
# Default: http://localhost:5173
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173/deutsch-klinik/`. Hot reload enabled.

### Dev server caveats
- Hash router: navigate via `http://localhost:5173/deutsch-klinik/#/dashboard`
- If the dev server shows a blank page, check the URL ends with `/deutsch-klinik/`
- No env vars needed for basic development

## Testing

### Playwright tests

```bash
# Run all tests (requires preview server pre-built)
npm run build
npx playwright test

# Run specific suites
npx playwright test tests/production-smoke.spec.cjs
npx playwright test tests/onboarding-smoke.spec.cjs
npx playwright test tests/fsp-smoke.spec.cjs
npx playwright test tests/auth-smoke.spec.cjs
npx playwright test tests/performance-smoke.spec.cjs
npx playwright test tests/ai-unavailable.spec.cjs  # Requires dev server
```

### Validators

```bash
npm run validate-curriculum
npm run validate-teach-before-test
npm run validate-curriculum-dependencies
npm run validate-fsp-quality
npm run validate-german-orthography
node scripts/validate-lint.cjs
```

## Production Deployment

### GitHub Pages (automatic)

```bash
npm run deploy
```

This runs `vite build` then publishes `dist/` to the `gh-pages` branch.

### Manual deployment

1. `npm run build`
2. Upload the `dist/` folder to any static host
3. Ensure the base path matches: if hosted at `https://host.com/deutsch-klinik/`, no change needed. If at root, update `base: '/deutsch-klinik/'` in `vite.config.js` to `base: '/'`.

### Deployment notes

- The app uses **hash routing** (`/#/path`). All paths resolve to `index.html`.
- The `base` config in `vite.config.js` is `/deutsch-klinik/` for GitHub Pages subpath hosting.
- Favicon at `public/favicon.svg` — auto-included by Vite.
- No server-side rendering — fully static SPA.
- No 404.html needed (hash routing avoids direct URL issues).
- The `gh-pages` npm package handles branch management for deployment.

## No-Secret Rules

- **Never commit `.env` files** — they are in `.gitignore`
- **Never hardcode API keys** in frontend code
- **Never commit Supabase service_role keys** — anon key is safe for public client usage
- **Cloudflare Worker handles all API secrets** server-side, not in frontend
- If you add new environment variables, add placeholder values to `.env.example` (create if needed)

## Troubleshooting

### Blank page on deploy
- Check the base path in `vite.config.js` matches your deployment path
- Verify favicon and asset paths

### Playwright tests fail with ERR_CONNECTION_REFUSED
- Run `npm run build && npx playwright test` — the webServer script in `playwright.config.cjs` runs `vite preview` automatically

### "Cannot find module" errors
- Run `npm install` to ensure dependencies are installed
- Check the package.json dependency list

### Validator errors showing pre-existing issues
- 10 curriculum map errors: `skill: "case"` in fsp_case units — pre-Phase 10
- 203 teach-before-test errors: missing `fsp_l_040` lesson — pre-Phase 10
- 287 orthography warnings: valid medical German — automated tool false positives
