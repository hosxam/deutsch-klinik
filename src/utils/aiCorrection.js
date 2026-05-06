/**
 * AI Correction Service (Writing + Speaking)
 *
 * Calls the backend proxy endpoint for AI-powered writing or speaking feedback.
 * Endpoint URLs are configured via VITE_AI_CORRECTION_ENDPOINT and
 * VITE_AI_SPEAKING_ENDPOINT. No API keys live in this frontend code.
 */

const writingEndpoint = import.meta.env.VITE_AI_CORRECTION_ENDPOINT || '';
const speakingEndpoint = import.meta.env.VITE_AI_SPEAKING_ENDPOINT || '';

/** For writing: check if the env var is configured */
export function isCorrectionEnabled() {
  return writingEndpoint.length > 0;
}

/** For speaking: check if its own endpoint or the writing fallback is set */
export function isSpeakingCorrectionEnabled() {
  return speakingEndpoint.length > 0 || writingEndpoint.length > 0;
}

/** Resolve the speaking endpoint, falling back to the writing endpoint */
function getSpeakingEndpoint() {
  return speakingEndpoint || writingEndpoint;
}

/**
 * Correct a writing submission.
 * Sends type: "writing" so the Worker can route it properly.
 */
export async function correctWriting({ level, task, userAnswer }) {
  if (!writingEndpoint) {
    throw new Error(
      'Live AI correction is not configured yet. Use Copy Prompt instead.'
    );
  }

  if (!userAnswer || userAnswer.trim().length < 2) {
    throw new Error('Write an answer first.');
  }

  const data = await callBackend(writingEndpoint, {
    type: 'writing',
    level,
    task,
    userAnswer,
  });

  return {
    score: typeof data.score === 'number' ? Math.max(0, Math.min(10, data.score)) : null,
    rubric: data.rubric && typeof data.rubric === 'object' ? data.rubric : null,
    mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
    correctedVersion: typeof data.correctedVersion === 'string' ? data.correctedVersion : '',
    improvedVersion: typeof data.improvedVersion === 'string' ? data.improvedVersion : '',
    flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
  };
}

/**
 * Get speaking feedback.
 * Sends type: "speaking" so the Worker routes to the speaking prompt.
 * Sends transcript text only -- no audio ever leaves the browser.
 */
export async function correctSpeaking({ level, task, transcript }) {
  const endpoint = getSpeakingEndpoint();

  if (!endpoint) {
    throw new Error(
      'Live speaking feedback is not configured yet. Type or paste your transcript and use a manual AI tool instead.'
    );
  }

  if (!transcript || transcript.trim().length < 2) {
    throw new Error('Provide a transcript first.');
  }

  const data = await callBackend(endpoint, {
    type: 'speaking',
    level,
    task,
    transcript,
  });

  return {
    score: typeof data.score === 'number' ? Math.max(0, Math.min(10, data.score)) : null,
    rubric: data.rubric && typeof data.rubric === 'object' ? data.rubric : null,
    mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
    betterPhrases: Array.isArray(data.betterPhrases) ? data.betterPhrases : [],
    correctedTranscript: typeof data.correctedTranscript === 'string' ? data.correctedTranscript : '',
    strongerAnswer: typeof data.strongerAnswer === 'string' ? data.strongerAnswer : '',
    phrasesToMemorize: Array.isArray(data.phrasesToMemorize) ? data.phrasesToMemorize : [],
  };
}

/** Shared fetch logic */
async function callBackend(endpoint, body) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    } catch {
    throw new Error(
      'Could not reach the correction service. Check your connection or try again later.'
    );
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody.error || '';
    } catch { /* empty */ }
    throw new Error(
      `Correction service returned an error (${response.status}). ${detail}`.trim()
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid response from correction service.');
  }

  return data;
}

/**
 * Transcribe audio using Cloudflare Workers AI Whisper.
 * Sends multipart/form-data to the Worker (no keys in frontend).
 */
export async function transcribeAudio(audioBlob) {
  const endpoint = import.meta.env.VITE_AI_SPEAKING_ENDPOINT || import.meta.env.VITE_AI_CORRECTION_ENDPOINT || '';
  if (!endpoint) {
    throw new Error('AI transcription is not configured.');
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
    throw new Error('Could not reach the transcription service. Check your connection.');
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
