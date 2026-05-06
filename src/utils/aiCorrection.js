/**
 * Cloudflare Workers AI correction service.
 *
 * The deployed Worker URL is public routing, not a secret. API keys and Workers
 * AI access stay inside Cloudflare. Vite env vars may override the default.
 */

export const DEFAULT_CLOUDFLARE_AI_ENDPOINT = 'https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev';

const envWritingEndpoint = import.meta.env.VITE_AI_CORRECTION_ENDPOINT || '';
const envSpeakingEndpoint = import.meta.env.VITE_AI_SPEAKING_ENDPOINT || '';
const envCloudflareEndpoint = import.meta.env.VITE_CLOUDFLARE_AI_ENDPOINT || '';

function cleanEndpoint(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function getWritingEndpoint() {
  return cleanEndpoint(envWritingEndpoint || envCloudflareEndpoint || DEFAULT_CLOUDFLARE_AI_ENDPOINT);
}

function getSpeakingEndpoint() {
  return cleanEndpoint(envSpeakingEndpoint || envWritingEndpoint || envCloudflareEndpoint || DEFAULT_CLOUDFLARE_AI_ENDPOINT);
}

export function getAiCorrectionEndpoint() {
  return getWritingEndpoint();
}

export function getAiSpeakingEndpoint() {
  return getSpeakingEndpoint();
}

export function isCorrectionEnabled() {
  return getWritingEndpoint().length > 0;
}

export function isSpeakingCorrectionEnabled() {
  return getSpeakingEndpoint().length > 0;
}

export async function correctWriting({ level, task, userAnswer }) {
  if (!userAnswer || userAnswer.trim().length < 2) {
    throw new Error('Write an answer first.');
  }

  const endpoint = getWritingEndpoint();
  if (!endpoint) {
    return createWritingSelfCheck({ level, task, userAnswer, reason: 'No AI endpoint is configured.' });
  }

  try {
    const data = await callBackend(endpoint, {
      type: 'writing',
      level,
      task,
      userAnswer,
    });
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

  const endpoint = getSpeakingEndpoint();
  if (!endpoint) {
    return createSpeakingSelfCheck({ level, task, transcript, reason: 'No AI endpoint is configured.' });
  }

  try {
    const data = await callBackend(endpoint, {
      type: 'speaking',
      level,
      task,
      transcript,
    });
    return normalizeSpeakingResponse(data);
  } catch (error) {
    if (error.code === 'AI_ENDPOINT_UNREACHABLE') {
      return createSpeakingSelfCheck({ level, task, transcript, reason: error.message });
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

export async function transcribeAudio(audioBlob) {
  const endpoint = getSpeakingEndpoint();
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
    response = await fetch(endpoint, {
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

  return { transcript: data.transcript };
}
