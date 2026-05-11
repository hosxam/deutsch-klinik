/**
 * Listening audio guard utilities.
 *
 * Ensures that the played audio file matches the currently selected listening item.
 * Prevents playing cached/preloaded audio from a different item.
 */

/**
 * Compute a fast text signature (hash) from a string.
 * Used to detect when script text changes between items.
 * @param {string} text
 * @returns {string} hex hash
 */
export function computeTextSignature(text) {
  if (!text) return '';
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Build an audio cache key that includes the item ID, level, script hash, and voice/speed.
 * @param {string} levelId - e.g. 'A1', 'A2'
 * @param {object} ex - listening exercise item
 * @param {object} [options]
 * @param {string} [options.voiceName] - voice name for TTS (not audio files)
 * @param {number} [options.speed] - playback speed
 * @returns {string} cache key or empty string if ex is invalid
 */
export function buildAudioCacheKey(levelId, ex, { voiceName, speed } = {}) {
  if (!ex || !ex.id) return '';
  const scriptHash = computeTextSignature(ex.script || '');
  const voicePart = voiceName ? `:${voiceName.replace(/[^a-zA-Z0-9_-]/g, '_')}` : '';
  const speedPart = speed && speed !== 1 ? `:${speed}x` : '';
  return `listening-audio:${levelId}:${ex.id}:${scriptHash}${voicePart}${speedPart}`;
}

/**
 * Verify audio file URL matches the current listening item.
 * @param {string} audioUrl - the resolved audio URL to play
 * @param {object} ex - listening exercise item
 * @returns {{ ok: boolean, reason?: string }}
 */
export function verifyAudioMatch(audioUrl, ex) {
  if (!audioUrl) {
    return { ok: false, reason: 'No audio URL provided.' };
  }
  if (!ex || !ex.id) {
    return { ok: false, reason: 'No exercise item provided.' };
  }

  const itemIdKebab = ex.id.toLowerCase().replace(/_/g, '-');
  const urlLower = audioUrl.toLowerCase();

  // Check that the audio filename contains the item's ID
  if (!urlLower.includes(itemIdKebab)) {
    return {
      ok: false,
      reason: `Audio URL "${audioUrl}" does not match item ID "${ex.id}". Expected filename containing "${itemIdKebab}".`,
    };
  }

  return { ok: true };
}

/**
 * Get the expected audio filename for a listening item.
 * @param {object} ex
 * @returns {string}
 */
export function getExpectedAudioFileName(ex) {
  if (!ex || !ex.id) return '';
  return ex.id.toLowerCase().replace(/_/g, '-') + '.mp3';
}

/**
 * Get the expected audio path for a listening item (same as ex.audio but recomputed).
 * @param {object} ex
 * @returns {string}
 */
export function getExpectedAudioPath(ex) {
  const name = getExpectedAudioFileName(ex);
  return name ? `audio/listening/${name}` : '';
}

/**
 * Get a standardized listening exercise payload used by both ListeningPage and
 * DailyMissionPage. Ensures audio, transcript, questions, answers, and ID
 * always come from the same item object.
 *
 * @param {object} item - listening exercise item from listeningData
 * @param {string} levelId - e.g. 'A1', 'A2'
 * @param {object} [options]
 * @param {string} [options.voiceName] - voice name for TTS cache key
 * @param {number} [options.speed] - playback speed for cache key
 * @returns {{ id: string|null, level: string, title: string, script: string, questions: Array, ttsText: string, audioCacheKey: string }}
 */
export function getListeningExercisePayload(item, levelId, { voiceName, speed } = {}) {
  if (!item || !item.id) {
    return {
      id: null,
      level: levelId || '',
      title: '',
      script: '',
      questions: [],
      ttsText: '',
      audioCacheKey: '',
    };
  }
  return {
    id: item.id,
    level: levelId || '',
    title: item.title || '',
    script: item.script || '',
    questions: item.questions || [],
    ttsText: item.script || '',
    audioCacheKey: buildAudioCacheKey(levelId || '', item, { voiceName, speed }),
  };
}
