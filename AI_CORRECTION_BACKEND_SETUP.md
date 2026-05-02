# AI Correction Backend Setup (Writing + Speaking)

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
| **Writing endpoint** | `VITE_AI_CORRECTION_ENDPOINT` in `.env.local` |
| **Speaking endpoint** | `VITE_AI_SPEAKING_ENDPOINT` in `.env.local` (falls back to writing endpoint) |
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

## Worker Behavior (type-based routing)

The Worker accepts a `type` field in the request body to route between
correction modes:

| Body `type` | Mode | Required fields |
|-------------|------|-----------------|
| `"writing"` | Writing correction | `level`, `task`, `userAnswer` |
| `"speaking"` | Speaking feedback | `level`, `task`, `transcript` |
| *(omitted)* | Defaults to writing | `level`, `task`, `userAnswer` |

### Writing prompt

Sent when `type === "writing"` (or no type provided):
- Expects `userAnswer` (the learner's written text)
- Returns: score, rubric (5 keys), mistakes[], correctedVersion, improvedVersion,
  flashcards[]

### Speaking prompt

Sent when `type === "speaking"`:
- Expects `transcript` only (no audio is ever sent to the backend)
- Returns: score, rubric (6 keys including fluency + pronunciationRisks),
  mistakes[], betterPhrases[], correctedTranscript, strongerAnswer,
  phrasesToMemorize[]
- Pronunciation risks are assessed from transcript patterns only, not from audio

## Worker Code

The Worker `src/index.js` lives in its own deployment directory, not in this
React project. Use the code below to create or update your Worker.

### Full Worker Code (supports both writing and speaking)

```javascript
export default {
  async fetch(request, env) {
    const allowedOrigin = "https://hosxam.github.io";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(allowedOrigin),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, allowedOrigin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, allowedOrigin);
    }

    // Route by type field
    const type = body.type || "writing";

    if (type === "speaking") {
      return handleSpeaking(body, env, allowedOrigin);
    }

    return handleWriting(body, env, allowedOrigin);
  },
};

async function handleWriting(body, env, allowedOrigin) {
  const { level, task, userAnswer } = body;

  if (!userAnswer || userAnswer.length < 2) {
    return json({ error: "No answer provided" }, 400, allowedOrigin);
  }

  const prompt = `You are correcting a German writing task for a learner.

Level: ${level}
Task: ${task}
User answer:
${userAnswer}

Return JSON only with:
{
  "score": number,
  "rubric": {
    "taskCompletion": string,
    "grammar": string,
    "vocabulary": string,
    "wordOrder": string,
    "register": string
  },
  "mistakes": [
    { "original": string, "corrected": string, "explanation": string }
  ],
  "correctedVersion": string,
  "improvedVersion": string,
  "flashcards": [
    { "front": string, "back": string }
  ]
}

Explain mistakes in English.
Be strict but fair for the learner's level.
Do not include markdown.
Do not include text outside JSON.`;

  return callGroq(prompt, env, allowedOrigin);
}

async function handleSpeaking(body, env, allowedOrigin) {
  const { level, task, transcript } = body;

  if (!transcript || transcript.length < 2) {
    return json({ error: "No transcript provided" }, 400, allowedOrigin);
  }

  const prompt = `You are assessing a German speaking answer based on the transcript.

Level: ${level}
Speaking task: ${task}
Transcript: ${transcript}

Return JSON only with:
{
  "score": number,
  "rubric": {
    "taskCompletion": string,
    "grammar": string,
    "vocabulary": string,
    "structure": string,
    "fluency": string,
    "pronunciationRisks": string
  },
  "mistakes": [
    { "original": string, "corrected": string, "explanation": string }
  ],
  "betterPhrases": [
    { "original": string, "better": string, "explanation": string }
  ],
  "correctedTranscript": string,
  "strongerAnswer": string,
  "phrasesToMemorize": [
    { "german": string, "english": string }
  ]
}

Explain mistakes in English.
Assess pronunciation risks only from transcript patterns; do not claim to hear audio.
Be strict but fair for the learner's level.
Do not include markdown.
Do not include text outside JSON.`;

  return callGroq(prompt, env, allowedOrigin);
}

async function callGroq(prompt, env, allowedOrigin) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return json(
      { error: "AI provider failed", details: errorText },
      502,
      allowedOrigin
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    return json({ error: "No AI response text" }, 502, allowedOrigin);
  }

  try {
    return json(JSON.parse(text), 200, allowedOrigin);
  } catch {
    return json(
      { error: "AI returned invalid JSON", raw: text },
      502,
      allowedOrigin
    );
  }
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}
```

## How to Update the Worker

If you change the Worker code:

```bash
# From the Worker project directory
npx wrangler deploy
```

Secrets remain unchanged. No redeployment needed for secret updates.

## How to Rebuild and Redeploy the Frontend

```bash
# 1. Set the endpoints in .env.local (not tracked by git)
echo "VITE_AI_CORRECTION_ENDPOINT=https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev" > .env.local
echo "VITE_AI_SPEAKING_ENDPOINT=https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev" >> .env.local

# 2. Build and deploy
npm run build
npm run deploy
```

The frontend reads both env vars at build time. If either is missing, the
corresponding section shows a graceful fallback message.

## CORS

Allowed origin: `https://hosxam.github.io`

For local development, temporarily change `allowedOrigin` to `*` or add
`http://localhost:5173`.

## Security

**No API keys are stored in this repository.**

| Artifact | Location | Security |
|----------|----------|----------|
| `GROQ_API_KEY` | Cloudflare Worker secret | Never in code. Set via `wrangler secret put` |
| `VITE_AI_CORRECTION_ENDPOINT` | `.env.local` (local only) | Git-ignored. Not in source control |
| `VITE_AI_SPEAKING_ENDPOINT` | `.env.local` (local only) | Git-ignored. Not in source control |
| `.env.example` | Git-tracked | Empty placeholders. Safe to commit |

## Speaking-Specific Notes

- **No audio is sent to the backend.** Only the transcript text is sent.
- **MediaRecorder audio stays in the browser.** It is used only for local
  playback. It is never stored or uploaded.
- **Pronunciation risks are inferred from the transcript**, not from audio.
  The Groq model analyzes word choice and sentence patterns that might indicate
  pronunciation difficulty (e.g., similar-looking words, common confusions).
- **Speech recognition** uses the browser's native Web Speech API with `de-DE`.
  If unsupported, users can type or paste their transcript manually.

## Testing Speaking

After deployment:

1. Open a speaking prompt at `/#/level/{levelId}/speaking`
2. Complete the preparation and speaking phases
3. Type or paste your transcript (or use speech recognition)
4. Click "Get Speaking Feedback"
5. Wait for the result (usually 2-5 seconds)
6. Verify: score out of 10, rubric (6 keys), mistakes, better phrases,
   corrected transcript, stronger answer, phrases to memorize
7. Verify audio recording works locally and does not appear in the network request
8. Verify the copy-prompt fallback still works

## If Rate Limits Become an Issue

The Worker uses `llama-3.3-70b-versatile`. You can switch to the faster model:

```javascript
model: "llama-3.1-8b-instant"
```

No other changes needed. The faster model returns results in 1-2 seconds.

## If You Want to Change the AI Provider

Update the Worker's fetch URL, auth header, and request body format. No frontend
changes needed. Supported alternatives:

| Provider | API URL | Secret |
|----------|---------|--------|
| Groq | `https://api.groq.com/openai/v1/chat/completions` | `GROQ_API_KEY` |
| Gemini | Gemini native API | `GEMINI_API_KEY` |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `OPENAI_API_KEY` |
| Claude | Anthropic API | `ANTHROPIC_API_KEY` |
