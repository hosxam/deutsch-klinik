/**
 * Cloudflare Workers AI Worker for deutsch-klinik
 *
 * Provides AI-powered language learning features:
 * - Writing correction with grammar/vocabulary feedback
 * - Speaking transcription (Whisper)
 * - Speaking correction with fluency/pronunciation feedback
 * - Text-to-speech generation
 * - Health check endpoint
 *
 * Endpoints:
 *   POST /api/correct-writing
 *     Request:  { level: string, task: string, userAnswer: string }
 *     Response: { score: number, rubric: object, mistakes: array,
 *                 correctedVersion: string, improvedVersion: string,
 *                 flashcards: array, source: string }
 *
 *   POST /api/transcribe-speaking
 *     Request:  multipart/form-data with audio blob + language param
 *     Response: { transcript: string }
 *
 *   POST /api/correct-speaking
 *     Request:  { level: string, task: string, transcript: string }
 *     Response: { score: number, rubric: object, mistakes: array,
 *                 betterPhrases: array, correctedTranscript: string,
 *                 strongerAnswer: string, phrasesToMemorize: array,
 *                 source: string }
 *
 *   POST /api/generate-tts
 *     Request:  { text: string, voice?: string }
 *     Response: { audio: string (base64), mimeType: string }
 *
 *   GET /api/health
 *     Response: { status: "ok", uptime: number, usage: { ... } }
 *
 * CORS: Allowed origins are configurable via ALLOWED_ORIGINS env var.
 * Usage tracking: In-memory counters per IP, reset daily.
 */

// ────────────────────────────────────────────
// Configuration from environment variables
// ────────────────────────────────────────────

const CONFIG = {
  aiBaseUrl: envVar('AI_BASE_URL', 'https://api.openai.com/v1'),
  aiModel: envVar('AI_MODEL', 'gpt-4o-mini'),
  whisperModel: envVar('WHISPER_MODEL', 'whisper-1'),
  ttsModel: envVar('TTS_MODEL', 'tts-1'),
  ttsVoice: envVar('TTS_VOICE', 'alloy'),
  aiApiKey: envVar('AI_API_KEY', ''),
  maxUsagePerIp: parseInt(envVar('MAX_USAGE_PER_IP', '100'), 10),
  allowedOrigins: (envVar('ALLOWED_ORIGINS', '') || '*').split(',').map(s => s.trim()),
};

function envVar(name, fallback) {
  return typeof globalThis !== 'undefined' && globalThis[name] !== undefined
    ? globalThis[name]
    : fallback;
}

// ────────────────────────────────────────────
// In-memory usage tracking (resets on Worker restart)
// ────────────────────────────────────────────

const usageStore = new Map(); // key: `${ip}_${dateKey}`
const DAILY_LIMIT = CONFIG.maxUsagePerIp;

function getDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsageKey(request) {
  const ip = request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-forwarded-for') ||
             'unknown';
  return `${ip}_${getDateKey()}`;
}

function checkUsageLimit(request) {
  const key = getUsageKey(request);
  const count = usageStore.get(key) || 0;
  if (count >= DAILY_LIMIT) {
    return { limited: true, count, max: DAILY_LIMIT };
  }
  return { limited: false, count, max: DAILY_LIMIT };
}

function incrementUsage(request) {
  const key = getUsageKey(request);
  usageStore.set(key, (usageStore.get(key) || 0) + 1);
}

// Cleanup stale entries (older than 2 days)
function cleanupUsageStore() {
  const today = getDateKey();
  for (const [key] of usageStore) {
    const keyDate = key.split('_').slice(-1)[0];
    if (keyDate !== today) {
      usageStore.delete(key);
    }
  }
}
setInterval(cleanupUsageStore, 60 * 60 * 1000); // Cleanup every hour

// ────────────────────────────────────────────
// CORS headers
// ────────────────────────────────────────────

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = CONFIG.allowedOrigins.includes('*')
    ? '*'
    : CONFIG.allowedOrigins.includes(origin)
      ? origin
      : '';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function handleOptions(request) {
  const headers = corsHeaders(request);
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}

// ────────────────────────────────────────────
// JSON helpers
// ────────────────────────────────────────────

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

function errorResponse(message, status = 400, extraHeaders = {}) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

// ────────────────────────────────────────────
// AI API helpers
// ────────────────────────────────────────────

/**
 * Call OpenAI-compatible chat completion API.
 */
async function aiChatCompletion(messages, temperature = 0.7, maxTokens = 2000) {
  if (!CONFIG.aiApiKey) {
    throw new Error('AI_API_KEY is not configured.');
  }

  const response = await fetch(`${CONFIG.aiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.aiApiKey}`,
    },
    body: JSON.stringify({
      model: CONFIG.aiModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`AI API error (${response.status}): ${errBody}`.slice(0, 500));
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI API returned empty response.');
  }

  // Try to parse JSON from LLM response
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/{[\s\S]*}/);
  const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
  try {
    return JSON.parse(jsonStr);
  } catch {
    // Return raw content if not valid JSON
    return { raw: content };
  }
}

// ────────────────────────────────────────────
// Route handlers
// ────────────────────────────────────────────

/**
 * POST /api/correct-writing
 */
async function handleCorrectWriting(request, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body.', 400, cors);
  }

  const { level, task, userAnswer, track, title, instructions, wordLimit, rubric } = body;
  if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.trim().length < 2) {
    return errorResponse('userAnswer is required (min 2 characters).', 400, cors);
  }
  if (userAnswer.length > 5000) {
    return errorResponse('userAnswer exceeds 5000 character limit.', 400, cors);
  }
  if (level && !/^[A-C][12]?$/i.test(level)) {
    return errorResponse('Invalid level. Expected A1, A2, B1, B2, C1, etc.', 400, cors);
  }

  try {
    const trackType = (track || 'goethe').trim().toLowerCase();
    const promptContext = trackType === 'goethe' ? [
      `Task context: general German language practice (Goethe-style).`,
      `Do NOT evaluate as medical/FSP writing unless the task explicitly asks for medical content.`,
    ] : trackType === 'medical' ? [
      `Task context: medical German writing. Evaluate for medical accuracy, terminology, and professional tone.`,
    ] : trackType === 'fsp' ? [
      `Task context: FSP (Fachsprachprüfung) exam preparation. Evaluate for medical terminology, patient communication, and formal structure.`,
    ] : [
      `Task context: general German language practice.`,
      `Do NOT assume medical context unless the task explicitly requires it.`,
    ];

    const rubricContext = rubric ? (
      Array.isArray(rubric) ? rubric.map(r => typeof r === 'object' ? `- ${r.criterion || r.criteria || ''}: ${r.description || ''} (${r.points || r.maxPoints || ''} pts)` : `- ${r}`).join('\n')
      : typeof rubric === 'object' ? Object.entries(rubric).map(([k, v]) => `- ${k}: ${v}`).join('\n')
      : `- ${rubric}`
    ) : 'Use standard CEFR rubric for this level.';

    const result = await aiChatCompletion([
      {
        role: 'system',
        content: [
          'You are a German language tutor. Given a student\'s writing, provide structured feedback.',
          'IMPORTANT: Evaluate ONLY against the provided task prompt, track, and rubric.',
          'Do NOT assume medical or FSP context unless the track is explicitly "medical" or "fsp".',
          'If the task is a birthday invitation, social message, or personal letter, evaluate it as general German.',
          'Do not reference patient history, diagnoses, treatments, or clinical contexts in non-medical tasks.',
          'Respond with valid JSON only (no extra text). Use this exact schema:',
          JSON.stringify({
            score: 'number (1-10)',
            rubric: {
              grammar: 'string',
              vocabulary: 'string',
              structure: 'string',
              taskCompletion: 'string',
            },
            mistakes: [
              { original: 'string', corrected: 'string', explanation: 'string' },
            ],
            correctedVersion: 'string (full corrected text)',
            improvedVersion: 'string (slightly improved version)',
            flashcards: [
              { german: 'string', english: 'string' },
            ],
          }),
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          `CEFR level: ${level || 'A1'}`,
          `Task title: ${title || 'Writing task'}`,
          `Task instructions: ${task || ''}`,
          `Track: ${trackType}`,
          ...promptContext,
          instructions ? `Detailed instructions: ${instructions}` : '',
          wordLimit ? `Word limit: ${wordLimit}` : '',
          `Rubric/checklist:\n${rubricContext}`,
          `Student text: ${userAnswer}`,
        ].filter(Boolean).join('\n'),
      },
    ], 0.5, 2000);

    return jsonResponse({
      ...result,
      source: 'cloudflare-worker',
    }, 200, cors);
  } catch (error) {
    return jsonResponse({
      error: error.message,
      source: 'cloudflare-worker-error',
    }, 502, cors);
  }
}

/**
 * POST /api/transcribe-speaking
 */
async function handleTranscribeSpeaking(request, cors) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse('Expected multipart/form-data.', 400, cors);
  }

  const audioFile = formData.get('audio');
  if (!audioFile) {
    return errorResponse('audio field is required in form-data.', 400, cors);
  }

  const language = formData.get('language') || 'de';

  try {
    if (!CONFIG.aiApiKey) {
      throw new Error('AI_API_KEY is not configured.');
    }

    // Use OpenAI Whisper API
    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, audioFile.name || 'speaking.webm');
    whisperForm.append('model', CONFIG.whisperModel);
    whisperForm.append('language', language);

    const response = await fetch(`${CONFIG.aiBaseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.aiApiKey}`,
      },
      body: whisperForm,
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(`Whisper API error (${response.status}): ${errBody}`.slice(0, 500));
    }

    const data = await response.json();
    return jsonResponse({
      transcript: data.text || '',
      language,
      source: 'cloudflare-worker-whisper',
    }, 200, cors);
  } catch (error) {
    return jsonResponse({
      error: error.message,
      transcript: '',
      source: 'cloudflare-worker-error',
    }, 502, cors);
  }
}

/**
 * POST /api/correct-speaking
 */
async function handleCorrectSpeaking(request, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body.', 400, cors);
  }

  const { level, task, transcript } = body;
  if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 2) {
    return errorResponse('transcript is required (min 2 characters).', 400, cors);
  }

  try {
    const result = await aiChatCompletion([
      {
        role: 'system',
        content: [
          'You are a German language tutor. Given a student\'s spoken transcript, provide structured speaking feedback.',
          'Respond with valid JSON only (no extra text). Use this exact schema:',
          JSON.stringify({
            score: 'number (1-10)',
            rubric: {
              fluency: 'string',
              grammar: 'string',
              vocabulary: 'string',
              pronunciation: 'string',
            },
            mistakes: [
              { original: 'string', corrected: 'string', explanation: 'string' },
            ],
            betterPhrases: [
              { original: 'string', better: 'string', explanation: 'string' },
            ],
            correctedTranscript: 'string',
            strongerAnswer: 'string (improved version)',
            phrasesToMemorize: [
              { german: 'string', english: 'string' },
            ],
          }),
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          `CEFR level: ${level || 'A1'}`,
          `Task: ${task || 'Speaking task'}`,
          `Student transcript: ${transcript}`,
        ].join('\n'),
      },
    ], 0.5, 2000);

    return jsonResponse({
      ...result,
      source: 'cloudflare-worker',
    }, 200, cors);
  } catch (error) {
    return jsonResponse({
      error: error.message,
      source: 'cloudflare-worker-error',
    }, 502, cors);
  }
}

/**
 * POST /api/generate-tts
 */
async function handleGenerateTTS(request, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body.', 400, cors);
  }

  const { text, voice } = body;
  if (!text || typeof text !== 'string' || text.trim().length < 1) {
    return errorResponse('text is required.', 400, cors);
  }
  if (text.length > 3000) {
    return errorResponse('text exceeds 3000 character limit.', 400, cors);
  }

  const selectedVoice = voice || CONFIG.ttsVoice;

  try {
    if (!CONFIG.aiApiKey) {
      throw new Error('AI_API_KEY is not configured.');
    }

    const response = await fetch(`${CONFIG.aiBaseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.aiApiKey}`,
      },
      body: JSON.stringify({
        model: CONFIG.ttsModel,
        input: text,
        voice: selectedVoice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(`TTS API error (${response.status}): ${errBody}`.slice(0, 500));
    }

    const audioBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return jsonResponse({
      audio: base64,
      mimeType: 'audio/mpeg',
      voice: selectedVoice,
      textLength: text.length,
    }, 200, cors);
  } catch (error) {
    return jsonResponse({
      error: error.message,
      source: 'cloudflare-worker-error',
    }, 502, cors);
  }
}

/**
 * GET /api/health
 */
function handleHealth(request, cors) {
  const usage = {};
  const todayKey = getDateKey();
  for (const [key, count] of usageStore) {
    if (key.endsWith(todayKey)) {
      usage[key] = count;
    }
  }

  return jsonResponse({
    status: 'ok',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: '1.0.0',
    config: {
      aiModel: CONFIG.aiModel,
      whisperModel: CONFIG.whisperModel,
      ttsModel: CONFIG.ttsModel,
      ttsVoice: CONFIG.ttsVoice,
      maxUsagePerIp: CONFIG.maxUsagePerIp,
    },
    usage: {
      totalToday: [...usage.values()].reduce((a, b) => a + b, 0),
      uniqueIpsToday: Object.keys(usage).length,
    },
  }, 200, cors);
}

// ────────────────────────────────────────────
// Router
// ────────────────────────────────────────────

const startTime = Date.now();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    const cors = corsHeaders(request);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions(request);
    }

    // Check usage limit
    const usageCheck = checkUsageLimit(request);
    if (usageCheck.limited) {
      return jsonResponse({
        error: 'Daily usage limit reached. Try again tomorrow.',
        usage: { count: usageCheck.count, max: usageCheck.max },
      }, 429, cors);
    }

    // Route matching
    let response;

    switch (`${method} ${path}`) {
      case 'POST /api/correct-writing':
        response = await handleCorrectWriting(request, cors);
        break;
      case 'POST /api/transcribe-speaking':
        response = await handleTranscribeSpeaking(request, cors);
        break;
      case 'POST /api/correct-speaking':
        response = await handleCorrectSpeaking(request, cors);
        break;
      case 'POST /api/generate-tts':
        response = await handleGenerateTTS(request, cors);
        break;
      case 'GET /api/health':
        response = handleHealth(request, cors);
        break;
      default:
        response = errorResponse(`Route not found: ${method} ${path}`, 404, cors);
        break;
    }

    // Increment usage counter on success (not for health or errors)
    if (response.status < 400 && path !== '/api/health') {
      incrementUsage(request);
    }

    return response;
  },
};
