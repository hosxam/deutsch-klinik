/**
 * AI Writing Correction Service
 *
 * Calls the backend proxy endpoint for AI-powered writing correction.
 * The endpoint URL is configured via VITE_AI_CORRECTION_ENDPOINT.
 * No API keys live in this frontend code.
 */

const endpoint = import.meta.env.VITE_AI_CORRECTION_ENDPOINT || '';

export function isCorrectionEnabled() {
  return endpoint.length > 0;
}

export async function correctWriting({ level, task, userAnswer }) {
  if (!endpoint) {
    throw new Error(
      'Live AI correction is not configured yet. Use Copy Prompt instead.'
    );
  }

  if (!userAnswer || userAnswer.trim().length < 2) {
    throw new Error('Write an answer first.');
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, task, userAnswer }),
    });
  } catch (err) {
    throw new Error(
      `Could not reach the correction service. Check your connection or try again later.`
    );
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody.error || '';
    } catch {}
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

  // Validate and sanitize the response so partial data still shows
  const sanitized = {
    score: typeof data.score === 'number' ? Math.max(0, Math.min(10, data.score)) : null,
    rubric: data.rubric && typeof data.rubric === 'object' ? data.rubric : null,
    mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
    correctedVersion: typeof data.correctedVersion === 'string' ? data.correctedVersion : '',
    improvedVersion: typeof data.improvedVersion === 'string' ? data.improvedVersion : '',
    flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
  };

  return sanitized;
}
