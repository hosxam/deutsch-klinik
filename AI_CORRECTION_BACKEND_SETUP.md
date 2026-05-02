# AI Writing Correction - Backend Setup

## Why a Backend Proxy?

This app is deployed on GitHub Pages. API keys cannot be stored in the frontend
code because they would be visible to every visitor. A backend proxy is required.

The React frontend calls a Cloudflare Worker endpoint (no key). The Worker
calls the AI API (with the key stored as a Cloudflare secret). The key never
reaches the browser.

## Current Live Setup (as of 2026-05-03)

| Component | Value |
|-----------|-------|
| **Worker URL** | `https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev` |
| **AI Provider** | Groq API (`llama-3.3-70b-versatile`) |
| **Frontend env var** | `VITE_AI_CORRECTION_ENDPOINT=https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev` |
| **Secret** | `GROQ_API_KEY` set via `wrangler secret put` |

## How the Worker Was Deployed

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Log in
wrangler login

# 3. Set the Groq API key (never in code)
wrangler secret put GROQ_API_KEY

# 4. Deploy the worker
wrangler deploy
```

## How to Rebuild and Redeploy the Frontend

If you modify the Worker URL or rebuild locally:

```bash
# 1. Set the endpoint in .env.local (not tracked by git)
echo "VITE_AI_CORRECTION_ENDPOINT=https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev" > .env.local

# 2. Build and deploy
npm run build
npm run deploy
```

The frontend reads `VITE_AI_CORRECTION_ENDPOINT` at build time. If the env
variable is empty or missing, the app shows a graceful fallback message: "Live
AI correction is not configured yet. Use Copy Prompt instead."

## Worker Code

The Worker `src/index.js` lives in its own repo/deployment, not in this React
project. Its behavior:

1. Receives POST from the React app with `{ level, task, userAnswer }`
2. Validates CORS (only allows `https://hosxam.github.io`)
3. Constructs a prompt for the Groq API
4. Returns structured JSON with score, rubric, mistakes, corrections, flashcards
5. Returns appropriate HTTP error codes for failures (400, 502)

## CORS

Allowed origin: `https://hosxam.github.io`

For local development, you can temporarily change the Worker to allow `*` or
add `http://localhost:5173`.

## Security

**No API keys are stored in this repository.**

| Artifact | Location | Security |
|----------|----------|----------|
| `GROQ_API_KEY` | Cloudflare Worker secret | Never in code. Set via `wrangler secret put` |
| `VITE_AI_CORRECTION_ENDPOINT` | `.env.local` (local only) | Git-ignored. Not in source control |
| `.env.example` | Git-tracked | Empty placeholder. Safe to commit |

## Testing

After deploying both Worker and frontend:

1. Open a writing prompt at `/#/level/{levelId}/writing`
2. Write an answer and click Submit
3. Click "Get AI Correction"
4. Wait for the result (usually 2-5 seconds)
5. Verify: score, rubric breakdown, mistakes table, corrected version,
   improved version, and flashcards appear
6. Verify the old "Copy Prompt" fallback still works below the AI panel

## If You Want to Change the AI Provider

The Worker uses Groq with `llama-3.3-70b-versatile`. To switch:

- Update the Worker's fetch URL and auth header
- No frontend changes needed
- Redeploy the Worker with `wrangler deploy`

Supported alternatives (same architecture, different Worker code):

| Provider | API URL | Secret |
|----------|---------|--------|
| Groq | `https://api.groq.com/openai/v1/chat/completions` | `GROQ_API_KEY` |
| Gemini | Gemini native API | `GEMINI_API_KEY` |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `OPENAI_API_KEY` |
| Claude | Anthropic API | `ANTHROPIC_API_KEY` |
