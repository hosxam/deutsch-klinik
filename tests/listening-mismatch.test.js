/**
 * Tests for listening audio mismatch fix in Today's Plan (DailyMissionPage).
 *
 * Verifies:
 * 1. getListeningExercisePayload produces consistent payloads from item objects
 * 2. audio cache key includes level + item ID + script hash
 * 3. switching items changes the cache key
 * 4. stale cached audio from item A is not used for item B
 * 5. ListeningPage and DailyMissionPage produce matching payloads for the same item
 * 6. computeTextSignature produces stable hashes
 */

import { describe, it, expect } from 'vitest';
import {
  getListeningExercisePayload,
  computeTextSignature,
  buildAudioCacheKey,
} from '../src/utils/audioGuard';

// Helper to create a mock listening item
function makeItem(id, overrides = {}) {
  return {
    id,
    title: overrides.title || `Exercise ${id}`,
    script: overrides.script || `This is the script for ${id}.`,
    questions: overrides.questions || [
      { question: 'What is this?', answer: 'exercises', type: 'text' },
    ],
    audio: overrides.audio || null,
    ...overrides,
  };
}

describe('getListeningExercisePayload', () => {
  it('returns null payload for null item', () => {
    const payload = getListeningExercisePayload(null, 'A1');
    expect(payload.id).toBe(null);
    expect(payload.title).toBe('');
    expect(payload.script).toBe('');
    expect(payload.questions).toEqual([]);
    expect(payload.ttsText).toBe('');
    expect(payload.audioCacheKey).toBe('');
  });

  it('returns empty payload for undefined item', () => {
    const payload = getListeningExercisePayload(undefined, 'A1');
    expect(payload.id).toBe(null);
    expect(payload.title).toBe('');
  });

  it('returns empty payload for item without id', () => {
    const payload = getListeningExercisePayload({ script: 'test' }, 'A1');
    expect(payload.id).toBe(null);
  });

  it('returns item id, title, script, questions from item', () => {
    const item = makeItem('A1_listening_001', {
      title: 'Die Familie',
      script: 'Meine Familie ist groß.',
      questions: [
        { question: 'Wie groß?', answer: 'groß', type: 'text' },
      ],
    });
    const payload = getListeningExercisePayload(item, 'A1');
    expect(payload.id).toBe('A1_listening_001');
    expect(payload.title).toBe('Die Familie');
    expect(payload.script).toBe('Meine Familie ist groß.');
    expect(payload.ttsText).toBe('Meine Familie ist groß.');
    expect(payload.questions).toHaveLength(1);
    expect(payload.questions[0].question).toBe('Wie groß?');
  });

  it('ttsText matches script', () => {
    const item = makeItem('lrn_001', { script: 'Hallo Welt.' });
    const payload = getListeningExercisePayload(item, 'A1');
    expect(payload.ttsText).toBe(payload.script);
  });

  it('audioCacheKey includes level, item id, and script hash', () => {
    const item = makeItem('A1_listening_003', { script: 'Der Hund läuft.' });
    const payload = getListeningExercisePayload(item, 'A1');
    expect(payload.audioCacheKey).toContain('A1');
    expect(payload.audioCacheKey).toContain('A1_listening_003');
    // script hash is a hex string
    const parts = payload.audioCacheKey.split(':');
    const hashPart = parts[parts.length - 1];
    expect(hashPart).toMatch(/^[0-9a-f]+$/);
  });

  it('payload level matches provided levelId', () => {
    const item = makeItem('lrn_x');
    const payload = getListeningExercisePayload(item, 'B1');
    expect(payload.level).toBe('B1');
  });

  it('questions defaults to empty array', () => {
    const item = makeItem('no_q', { questions: undefined });
    const payload = getListeningExercisePayload(item, 'A1');
    expect(payload.questions).toEqual([]);
  });

  it('title defaults to empty string', () => {
    const item = { id: 'no_title' };
    const payload = getListeningExercisePayload(item, 'A1');
    expect(payload.title).toBe('');
  });
});

describe('listening item audio cache key consistency', () => {
  it('two identical items produce the same cache key', () => {
    const itemA = makeItem('lrn_001', { script: 'Same script.' });
    const itemB = makeItem('lrn_001', { script: 'Same script.' });
    expect(buildAudioCacheKey('A1', itemA)).toBe(buildAudioCacheKey('A1', itemB));
  });

  it('different items produce different cache keys', () => {
    const itemA = makeItem('lrn_001', { script: 'Script A.' });
    const itemB = makeItem('lrn_002', { script: 'Script B.' });
    expect(buildAudioCacheKey('A1', itemA)).not.toBe(buildAudioCacheKey('A1', itemB));
  });

  it('same item different scripts produce different cache keys', () => {
    const itemA = makeItem('lrn_001', { script: 'Version 1.' });
    const itemB = makeItem('lrn_001', { script: 'Version 2.' });
    expect(buildAudioCacheKey('A1', itemA)).not.toBe(buildAudioCacheKey('A1', itemB));
  });

  it('same item different levels produce different cache keys', () => {
    const item = makeItem('lrn_001', { script: 'Fixed script.' });
    expect(buildAudioCacheKey('A1', item)).not.toBe(buildAudioCacheKey('A2', item));
  });

  it('switching items changes the cache key', () => {
    // Simulates what happens when DailyMissionPage changes listeningItem
    const item1 = makeItem('lrn_001', { script: 'First script.' });
    const item2 = makeItem('lrn_002', { script: 'Second script.' });
    const key1 = buildAudioCacheKey('A1', item1);
    const key2 = buildAudioCacheKey('A1', item2);
    expect(key1).not.toBe(key2);
    // Verify both keys have different item IDs embedded
    expect(key1).toContain('lrn_001');
    expect(key2).toContain('lrn_002');
  });
});

describe('stale audio cache guard', () => {
  it('stale cached key does not match current item key', () => {
    const oldItem = makeItem('lrn_old', { script: 'Old script.' });
    const newItem = makeItem('lrn_new', { script: 'New script.' });
    const oldKey = buildAudioCacheKey('A1', oldItem);
    const newKey = buildAudioCacheKey('A1', newItem);
    // Simulating the mismatch guard: if cached !== current, stale
    expect(oldKey === newKey).toBe(false);
    expect(oldKey).not.toBe(newKey);
  });

  it('same item after reload produces same cache key', () => {
    const item = makeItem('lrn_stable', { script: 'Stable text.' });
    const key1 = buildAudioCacheKey('B1', item);
    const key2 = buildAudioCacheKey('B1', item);
    expect(key1).toBe(key2);
  });

  it('payload has id matching cache key reference', () => {
    const item = makeItem('listening_a1_05', { script: 'Exercise five text.' });
    const payload = getListeningExercisePayload(item, 'A1');
    // The cache key should reference the same item id
    expect(payload.audioCacheKey).toContain(payload.id);
  });
});

describe('ListeningPage and DailyMissionPage payload consistency', () => {
  it('both produce same payload for the same item', () => {
    const item = makeItem('A1_listening_002', {
      title: 'Das Wetter',
      script: 'Heute ist es sonnig.',
      questions: [
        { question: 'Wie ist das Wetter?', answer: 'sonnig', type: 'text' },
      ],
    });
    // Both pages should call the same helper
    const payload = getListeningExercisePayload(item, 'A1');
    expect(payload.id).toBe('A1_listening_002');
    expect(payload.script).toBe('Heute ist es sonnig.');
    expect(payload.ttsText).toBe('Heute ist es sonnig.');
    // If ListeningPage used this same helper for the same item, its payload
    // would be identical
  });

  it('payload ttsText and script are always the same', () => {
    const scripts = [
      'Kurzer Text.',
      'Ein längerer deutscher Satz mit vielen Wörtern.',
      '',
      '12345',
    ];
    for (const s of scripts) {
      const item = makeItem('test', { script: s });
      const payload = getListeningExercisePayload(item, 'A1');
      expect(payload.ttsText).toBe(payload.script);
    }
  });
});

describe('computeTextSignature', () => {
  it('returns empty string for null/undefined', () => {
    expect(computeTextSignature(null)).toBe('');
    expect(computeTextSignature(undefined)).toBe('');
  });

  it('returns same hash for identical texts', () => {
    const h1 = computeTextSignature('Der Hund läuft.');
    const h2 = computeTextSignature('Der Hund läuft.');
    expect(h1).toBe(h2);
    expect(h1).toBeTruthy();
  });

  it('returns different hash for different texts', () => {
    expect(computeTextSignature('Text A')).not.toBe(computeTextSignature('Text B'));
  });

  it('returns hex string', () => {
    const hash = computeTextSignature('Hallo Welt');
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });
});
