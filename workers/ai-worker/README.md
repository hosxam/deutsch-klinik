# Cloudflare AI Worker — deutsch-klinik

The AI Worker provides AI-powered language learning features for the deutsch-klinik app.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + usage stats |
| POST | `/api/correct-writing` | German writing correction |
| POST | `/api/transcribe-speaking` | Audio transcription (Whisper) |
| POST | `/api/correct-speaking` | German speaking feedback |
| POST | `/api/generate-tts` | Text-to-speech generation |
| OPTIONS | `*` | CORS preflight |

## Quick Start

```bash
# 1. Install dependencies (uses workerd runtime, no node_modules needed)
# 2. Copy the example config
cp wrangler.toml.example wrangler.toml

# 3. Set your API key
npx wrangler secret put AI_API_KEY

# 4. Deploy
npx wrangler deploy

# 5. Note the deployed URL (e.g. https://ai-worker.your-subdomain.workers.dev)
# 6. Set VITE_AI_WORKER_URL in the frontend .env
```

## Configuration

All configuration is via environment variables (set via `wrangler secret` or in `wrangler.toml` `[vars]`):

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_API_KEY` | *(required)* | OpenAI API key or compatible |
| `AI_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible API base URL |
| `AI_MODEL` | `gpt-4o-mini` | Model for text generation |
| `WHISPER_MODEL` | `whisper-1` | Model for transcription |
| `TTS_MODEL` | `tts-1` | Model for TTS |
| `TTS_VOICE` | `alloy` | TTS voice (alloy, echo, fable, onyx, nova, shimmer) |
| `MAX_USAGE_PER_IP` | `100` | Max daily requests per IP |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins (comma-separated) |

## Local Development

```bash
# Run locally with wrangler dev
npx wrangler dev

# Set local secrets in .dev.vars
echo 'AI_API_KEY=sk-...' > .dev.vars
```

## Usage Tracking

The Worker tracks requests per IP per day in memory. After restart, counters reset.
Daily limits are soft — the Worker returns 429 when exceeded.

## Privacy

- No audio or text data is stored persistently.
- All requests are proxied through OpenAI-compatible APIs.
- IP addresses are used only for rate limiting and not logged.
- See `docs/AI_PRIVACY_AND_LIMITS.md` in the frontend project for details.
