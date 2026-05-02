# AI Writing Correction - Backend Setup

## Why a Backend Proxy?

This app is deployed on GitHub Pages. API keys cannot be stored in the frontend
code because they would be visible to every visitor. A backend proxy is required.

The React frontend calls your backend endpoint (no key). The backend calls the
AI API (with the key). The key never reaches the browser.

## Recommended Backend

Cloudflare Worker + Gemini API free tier.

- **Cloudflare Workers**: free tier (100k requests/day)
- **Gemini API free tier**: 60 requests per minute, 1,500 per day, no credit card
  required (as of May 2026)

## How to Create the Worker

Prerequisites: Node.js installed.

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Log in to your Cloudflare account
wrangler login

# 3. Create a new Worker project
mkdir deutsch-klinik-correction
cd deutsch-klinik-correction
wrangler init

# 4. Replace src/index.js with the content below

# 5. Set your Gemini API key as a secret (never in code)
wrangler secret put GEMINI_API_KEY
# Paste your key when prompted

# 6. Deploy
wrangler deploy
```

## Worker Code

Create `src/index.js` with:

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

    const { level, task, userAnswer } = body;

    if (!userAnswer || userAnswer.length < 2) {
      return json({ error: "No answer provided" }, 400, allowedOrigin);
    }

    const prompt = `
You are correcting a German writing task for a learner.

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
    {
      "original": string,
      "corrected": string,
      "explanation": string
    }
  ],
  "correctedVersion": string,
  "improvedVersion": string,
  "flashcards": [
    {
      "front": string,
      "back": string
    }
  ]
}

Explain mistakes in English.
Be strict but fair for the learner's level.
Do not include markdown.
`;

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return json(
        { error: "AI provider failed", details: errorText },
        502,
        allowedOrigin
      );
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

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
  },
};

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

## Configure the React App

Create `.env.local` in the project root (do not commit it):

```
VITE_AI_CORRECTION_ENDPOINT=https://your-worker-name.your-subdomain.workers.dev/correct-writing
```

The app reads this at build time. After setting it, rebuild and redeploy:

```bash
npm run build
npm run deploy
```

## CORS

The Worker code only allows requests from `https://hosxam.github.io`. If you
test locally, change `allowedOrigin` to `*` temporarily, or better, add your
local dev URL (e.g. `http://localhost:5173`).

## Security Warning

**Never commit these values:**

```
GEMINI_API_KEY
ANTHROPIC_API_KEY
OPENAI_API_KEY
GROQ_API_KEY
```

Use `wrangler secret put KEY_NAME` to set them on Cloudflare. They will never
appear in your code or in version control.

## Alternative Backends

### Groq (free tier, fast)

Same Worker pattern, just replace the fetch URL:

```
https://api.groq.com/openai/v1/chat/completions
```

Headers: `Authorization: Bearer ${env.GROQ_API_KEY}`

### OpenAI / Claude

Same pattern, different API URL and auth header.

## Testing

After deploying both Worker and frontend:

1. Open a writing prompt
2. Write an answer and submit
3. Click "Get AI Correction"
4. Wait for the result (usually 2-5 seconds)
5. Check that score, rubric, mistakes, corrections, and flashcards appear
6. Verify the old "Copy Prompt" fallback still works
