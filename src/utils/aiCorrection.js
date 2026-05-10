/**
 * Cloudflare Workers AI correction service.
 *
 * The deployed Worker URL is public routing, not a secret. API keys and Workers
 * AI access stay inside Cloudflare. Vite env vars may override the default.
 *
 * Supports unified VITE_AI_WORKER_URL env var (preferred), with fallback to
 * VITE_AI_CORRECTION_ENDPOINT, VITE_AI_SPEAKING_ENDPOINT, VITE_CLOUDFLARE_AI_ENDPOINT.
 *
 * All AI features are optional. The app never crashes if AI is unavailable.
 * Local self-check fallbacks are generated when the Worker is unreachable.
 */

export const DEFAULT_CLOUDFLARE_AI_ENDPOINT = 'https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev';

// ────────────────────────────────────────────
// Env var resolution
// ────────────────────────────────────────────

const envWorkerUrl = import.meta.env.VITE_AI_WORKER_URL || '';
const envWritingEndpoint = import.meta.env.VITE_AI_CORRECTION_ENDPOINT || '';
const envSpeakingEndpoint = import.meta.env.VITE_AI_SPEAKING_ENDPOINT || '';
const envCloudflareEndpoint = import.meta.env.VITE_CLOUDFLARE_AI_ENDPOINT || '';

function cleanEndpoint(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

/**
 * Get the base Worker URL (without path suffix).
 * Priority: VITE_AI_WORKER_URL > VITE_AI_CORRECTION_ENDPOINT > VITE_CLOUDFLARE_AI_ENDPOINT > default
 */
function getWorkerBaseUrl() {
  return cleanEndpoint(envWorkerUrl || envWritingEndpoint || envCloudflareEndpoint || DEFAULT_CLOUDFLARE_AI_ENDPOINT);
}

/**
 * Get the endpoint for speaking features (transcription, speaking correction).
 * Priority: VITE_AI_WORKER_URL > VITE_AI_SPEAKING_ENDPOINT > VITE_AI_CORRECTION_ENDPOINT > VITE_CLOUDFLARE_AI_ENDPOINT > default
 */
function getSpeakingBaseUrl() {
  return cleanEndpoint(envWorkerUrl || envSpeakingEndpoint || envWritingEndpoint || envCloudflareEndpoint || DEFAULT_CLOUDFLARE_AI_ENDPOINT);
}

export function getAiCorrectionEndpoint() {
  return getWorkerBaseUrl();
}

export function getAiSpeakingEndpoint() {
  return getSpeakingBaseUrl();
}

export function isCorrectionEnabled() {
  return getWorkerBaseUrl().length > 0;
}

export function isSpeakingCorrectionEnabled() {
  return getSpeakingBaseUrl().length > 0;
}

// ────────────────────────────────────────────
// Usage limit tracking (localStorage)
// ────────────────────────────────────────────

const USAGE_STORAGE_KEY = 'dk_ai_usage';

function getDateKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function loadUsageData() {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.dateKey === getDateKey()) return data;
  } catch { /* empty */ }
  return null;
}

function saveUsageData(data) {
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify({
      dateKey: getDateKey(),
      corrections: data.corrections || 0,
      transcriptions: data.transcriptions || 0,
      tts: data.tts || 0,
    }));
  } catch { /* empty */ }
}

function incrementUsageCounter(type) {
  const data = loadUsageData() || { corrections: 0, transcriptions: 0, tts: 0 };
  if (type === 'correction') data.corrections = (data.corrections || 0) + 1;
  if (type === 'transcription') data.transcriptions = (data.transcriptions || 0) + 1;
  if (type === 'tts') data.tts = (data.tts || 0) + 1;
  saveUsageData(data);
}

const USAGE_LIMITS = {
  corrections: 20,   // Daily max writing + speaking corrections
  transcriptions: 10, // Daily max audio transcriptions
  tts: 30,            // Daily max TTS generations
};

/**
 * Check whether calling another AI feature is within daily limits.
 * @param {'correction'|'transcription'|'tts'} type
 * @returns {boolean} true if usage should be limited (over limit)
 */
export function shouldLimitAIUsage(type) {
  const data = loadUsageData();
  if (!data) return false;
  const limit = USAGE_LIMITS[type === 'correction' ? 'corrections' : type === 'transcription' ? 'transcriptions' : 'tts'];
  const current = data[type === 'correction' ? 'corrections' : type === 'transcription' ? 'transcriptions' : 'tts'] || 0;
  return current >= limit;
}

/**
 * Get remaining usage for a specific feature type.
 * @param {'correction'|'transcription'|'tts'} type
 * @returns {{ remaining: number, max: number }}
 */
export function getAIUsageRemaining(type) {
  const data = loadUsageData();
  const limit = USAGE_LIMITS[type === 'correction' ? 'corrections' : type === 'transcription' ? 'transcriptions' : 'tts'];
  const current = data ? (data[type === 'correction' ? 'corrections' : type === 'transcription' ? 'transcriptions' : 'tts'] || 0) : 0;
  return { remaining: Math.max(0, limit - current), max: limit };
}

/**
 * Reset all daily AI usage counters.
 */
export function resetAIUsage() {
  try {
    localStorage.removeItem(USAGE_STORAGE_KEY);
  } catch { /* empty */ }
}

// ────────────────────────────────────────────
// Text length validation
// ────────────────────────────────────────────

const MAX_WRITING_CHARS = 5000;
const MAX_TTS_CHARS = 3000;

export function isValidWritingLength(text) {
  return text.length <= MAX_WRITING_CHARS;
}

export function isValidTTSLength(text) {
  return text.length <= MAX_TTS_CHARS;
}

// ────────────────────────────────────────────
// AI Health Check
// ────────────────────────────────────────────

/**
 * Check the health of the AI Worker.
 * @returns {Promise<{status: string, ok: boolean, error?: string}>}
 */
export async function getAIHealth() {
  const baseUrl = getWorkerBaseUrl();
  if (!baseUrl) {
    return { status: 'not-configured', ok: false, error: 'No AI endpoint configured.' };
  }

  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      return { status: 'unhealthy', ok: false, error: `Health check returned ${response.status}` };
    }
    const data = await response.json();
    return { status: 'ok', ok: true, ...data };
  } catch {
    return { status: 'unreachable', ok: false, error: 'Could not reach AI Worker.' };
  }
}

// ────────────────────────────────────────────
// Core AI functions
// ────────────────────────────────────────────

export async function correctWriting({ level, task, userAnswer, track, title, instructions, wordLimit, rubric }) {
  if (!userAnswer || userAnswer.trim().length < 2) {
    throw new Error('Write an answer first.');
  }

  if (userAnswer.length > MAX_WRITING_CHARS) {
    throw new Error(`Answer is too long (max ${MAX_WRITING_CHARS} characters).`);
  }

  const endpoint = getWorkerBaseUrl();
  if (!endpoint) {
    return createWritingSelfCheck({ level, task, userAnswer, reason: 'No AI endpoint is configured.' });
  }

  try {
    const data = await callBackend(`${endpoint}/api/correct-writing`, {
      type: 'writing',
      level,
      task,
      userAnswer,
      track: track || 'goethe',
      title: title || '',
      instructions: instructions || '',
      wordLimit: wordLimit || null,
      rubric: rubric || null,
    });
    incrementUsageCounter('correction');
    return normalizeWritingResponse(data);
  } catch (error) {
    if (error.code === 'AI_ENDPOINT_UNREACHABLE') {
      return createWritingSelfCheck({ level, task, userAnswer, reason: error.message });
    }
    throw error;
  }
}

export async function correctSpeaking({ level, task, transcript }) {
  if (!transcript || transcript.trim().length < 2) {
    throw new Error('Provide a transcript first.');
  }

  const endpoint = getSpeakingBaseUrl();
  if (!endpoint) {
    return createSpeakingSelfCheck({ level, task, transcript, reason: 'No AI endpoint is configured.' });
  }

  try {
    const data = await callBackend(`${endpoint}/api/correct-speaking`, {
      type: 'speaking',
      level,
      task,
      transcript,
    });
    incrementUsageCounter('correction');
    return normalizeSpeakingResponse(data);
  } catch (error) {
    if (error.code === 'AI_ENDPOINT_UNREACHABLE') {
      return createSpeakingSelfCheck({ level, task, transcript, reason: error.message });
    }
    throw error;
  }
}

export async function transcribeAudio(audioBlob) {
  const endpoint = getSpeakingBaseUrl();
  if (!endpoint) {
    const error = new Error('Cloudflare AI transcription endpoint is unavailable. Use browser speech recognition or type the transcript.');
    error.code = 'AI_ENDPOINT_UNREACHABLE';
    throw error;
  }

  const formData = new FormData();
  formData.append('type', 'transcription');
  formData.append('audio', audioBlob, 'speaking.webm');
  formData.append('language', 'de');

  let response;
  try {
    response = await fetch(`${endpoint}/api/transcribe-speaking`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    const error = new Error('Could not reach the Cloudflare AI transcription Worker. Use browser speech recognition or type the transcript.');
    error.code = 'AI_ENDPOINT_UNREACHABLE';
    throw error;
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody.error || '';
    } catch { /* empty */ }
    throw new Error(`Transcription service returned an error (${response.status}). ${detail}`.trim());
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid response from transcription service.');
  }

  if (!data.transcript) {
    throw new Error('Transcription service returned no transcript.');
  }

  incrementUsageCounter('transcription');
  return { transcript: data.transcript };
}

/**
 * Generate TTS audio from German text.
 * @param {string} text - German text to synthesize.
 * @param {object} [options]
 * @param {string} [options.voice] - TTS voice to use.
 * @returns {Promise<{audio: string, mimeType: string}>}
 */
export async function generateTTS(text, { voice } = {}) {
  if (!text || text.trim().length < 1) {
    throw new Error('Provide text to speak.');
  }

  if (text.length > MAX_TTS_CHARS) {
    throw new Error(`Text too long for TTS (max ${MAX_TTS_CHARS} characters).`);
  }

  const endpoint = getWorkerBaseUrl();
  if (!endpoint) {
    throw new Error('AI TTS endpoint is unavailable.');
  }

  try {
    const response = await fetch(`${endpoint}/api/generate-tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        const errBody = await response.json();
        detail = errBody.error || '';
      } catch { /* empty */ }
      throw new Error(`TTS service returned an error (${response.status}). ${detail}`.trim());
    }

    const data = await response.json();
    incrementUsageCounter('tts');
    return { audio: data.audio, mimeType: data.mimeType || 'audio/mpeg' };
  } catch (error) {
    if (error.code === 'AI_ENDPOINT_UNREACHABLE') {
      throw new Error('Could not reach the TTS service.');
    }
    throw error;
  }
}

async function callBackend(endpoint, body) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    const error = new Error('Could not reach the Cloudflare AI Worker. Showing local self-check feedback instead.');
    error.code = 'AI_ENDPOINT_UNREACHABLE';
    throw error;
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody.error || '';
    } catch { /* empty */ }

    if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 504) {
      const error = new Error(`Cloudflare AI Worker returned ${response.status}. Showing local self-check feedback instead.`);
      error.code = 'AI_ENDPOINT_UNREACHABLE';
      throw error;
    }

    throw new Error(`Correction service returned an error (${response.status}). ${detail}`.trim());
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Invalid response from correction service.');
  }
}

function normalizeWritingResponse(data) {
  return {
    score: typeof data.score === 'number' ? Math.max(0, Math.min(10, data.score)) : null,
    rubric: data.rubric && typeof data.rubric === 'object' ? data.rubric : null,
    mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
    correctedVersion: typeof data.correctedVersion === 'string' ? data.correctedVersion : '',
    improvedVersion: typeof data.improvedVersion === 'string' ? data.improvedVersion : '',
    flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
    source: data.source || 'cloudflare-worker',
  };
}

function normalizeSpeakingResponse(data) {
  return {
    score: typeof data.score === 'number' ? Math.max(0, Math.min(10, data.score)) : null,
    rubric: data.rubric && typeof data.rubric === 'object' ? data.rubric : null,
    mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
    betterPhrases: Array.isArray(data.betterPhrases) ? data.betterPhrases : [],
    correctedTranscript: typeof data.correctedTranscript === 'string' ? data.correctedTranscript : '',
    strongerAnswer: typeof data.strongerAnswer === 'string' ? data.strongerAnswer : '',
    phrasesToMemorize: Array.isArray(data.phrasesToMemorize) ? data.phrasesToMemorize : [],
    source: data.source || 'cloudflare-worker',
  };
}

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function createWritingSelfCheck({ level, task, userAnswer, reason }) {
  const words = wordCount(userAnswer);
  const hasCapitalStart = /^[A-ZÄÖÜ]/.test(userAnswer.trim());
  const hasSentenceEnd = /[.!?]$/.test(userAnswer.trim());
  const score = Math.max(3, Math.min(8, 4 + (words >= 25 ? 2 : 0) + (hasCapitalStart ? 1 : 0) + (hasSentenceEnd ? 1 : 0)));

  return {
    score,
    rubric: {
      taskCompletion: words >= 25 ? 'You wrote enough for a first review. Check that every instruction in the prompt is answered.' : 'The answer is short. Add details that directly answer the task.',
      grammar: 'Review verb position, articles, cases, and adjective endings before final submission.',
      vocabulary: 'Underline repeated words and replace them with level-appropriate alternatives.',
      structure: 'Use a clear opening sentence, supporting details, and a final sentence.',
    },
    mistakes: [
      {
        original: hasSentenceEnd ? 'Self-check needed' : 'Missing final punctuation',
        corrected: hasSentenceEnd ? 'Review articles, cases, and verb position' : `${userAnswer.trim()}.`,
        explanation: reason,
      },
    ],
    correctedVersion: userAnswer.trim(),
    improvedVersion: buildImprovedWritingHint(level, task, userAnswer),
    flashcards: [
      { german: 'die Satzstellung', english: 'word order' },
      { german: 'der Artikel', english: 'article' },
      { german: 'die Begründung', english: 'reason/justification' },
    ],
    source: 'local-self-check',
  };
}

function createSpeakingSelfCheck({ level, task, transcript, reason }) {
  const words = wordCount(transcript);
  const score = Math.max(3, Math.min(8, 4 + (words >= 20 ? 2 : 0) + (/[.!?]/.test(transcript) ? 1 : 0)));

  return {
    score,
    rubric: {
      fluency: words >= 20 ? 'You produced enough language to review. Practice connecting ideas more smoothly.' : 'The transcript is short. Add more complete sentences.',
      grammar: 'Check verb position, tense consistency, articles, and case endings.',
      vocabulary: 'Use precise nouns and linking phrases that match the task.',
      pronunciation: 'Read the answer aloud and mark long vowels, umlauts, ch, r, and final consonants.',
    },
    mistakes: [
      {
        original: 'Self-check needed',
        corrected: 'Review grammar and pronunciation points before repeating the answer',
        explanation: reason,
      },
    ],
    betterPhrases: [
      { original: 'Ich denke...', better: 'Meiner Ansicht nach...', explanation: 'More natural for structured spoken answers.' },
      { original: 'und dann', better: 'anschließend / danach', explanation: 'Creates a clearer sequence.' },
    ],
    correctedTranscript: transcript.trim(),
    strongerAnswer: buildImprovedSpeakingHint(level, task, transcript),
    phrasesToMemorize: [
      { german: 'Meiner Ansicht nach...', english: 'In my opinion...' },
      { german: 'Ein weiterer Punkt ist...', english: 'Another point is...' },
      { german: 'Zusammenfassend kann man sagen...', english: 'In summary, one can say...' },
    ],
    source: 'local-self-check',
  };
}

function buildImprovedWritingHint(level, task, userAnswer) {
  return [
    `Level ${level} improvement plan:`,
    `Task: ${task || 'Writing task'}`,
    '',
    userAnswer.trim(),
    '',
    'Add one clearer topic sentence, one example, and one closing sentence. Then check articles, verb position, and punctuation.',
  ].join('\n');
}

function buildImprovedSpeakingHint(level, task, transcript) {
  return [
    `Level ${level} speaking improvement plan:`,
    `Task: ${task || 'Speaking task'}`,
    '',
    transcript.trim(),
    '',
    'Repeat the answer with slower pacing, clearer connectors, and one extra supporting detail.',
  ].join('\n');
}
