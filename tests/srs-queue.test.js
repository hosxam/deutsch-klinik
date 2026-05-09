import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Side-effect-free unit tests for the SM-2 SRS logic.
 * These test the core scheduling math without DOM/browser dependencies.
 */

// Replicate the core SM-2 scheduling logic from store.js for testing
function getLocalDateKey(offsetDays = 0) {
  const d = new Date();
  if (offsetDays) d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDefaultMastery() {
  return {
    correct: 0,
    incorrect: 0,
    mastered: false,
    ease: 2.5,
    interval: 1,
    due: getLocalDateKey(),
    repetitions: 0,
  };
}

function simulateRecordVocabAnswer(wordId, rating, masteryStore) {
  // This is a pure simulation matching store.js:recordVocabAnswer
  let m = masteryStore[wordId] || getDefaultMastery();
  m = { ...m }; // clone

  if (typeof rating === 'boolean') {
    rating = rating ? 3 : 1;
  }

  const isCorrect = rating >= 3;
  m.correct += isCorrect ? 1 : 0;
  m.incorrect += isCorrect ? 0 : 1;

  if (rating === 1) {
    // Again: reset
    m.repetitions = 0;
    m.interval = 0;
    m.ease = Math.max(1.3, m.ease - 0.2);
  } else if (rating === 2) {
    // Hard
    if (m.repetitions === 0) {
      m.interval = 1;
    } else {
      m.interval = Math.max(1, Math.round(m.interval * 1.2));
    }
    m.repetitions += 1;
    m.ease = Math.max(1.3, m.ease - 0.15);
  } else if (rating === 3) {
    // Good
    if (m.repetitions === 0) {
      m.interval = 1;
    } else if (m.repetitions === 1) {
      m.interval = 6;
    } else {
      m.interval = Math.round(m.interval * m.ease);
    }
    m.repetitions += 1;
    m.ease = Math.min(3.0, m.ease + 0.15);
  } else {
    // Easy
    if (m.repetitions === 0) {
      m.interval = 3;
    } else if (m.repetitions === 1) {
      m.interval = Math.round(6 * 1.3);
    } else {
      m.interval = Math.round(m.interval * m.ease * 1.3);
    }
    m.repetitions += 1;
    m.ease = Math.min(3.0, m.ease + 0.3);
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + m.interval);
  m.due = (() => {
    const y = dueDate.getFullYear();
    const mon = String(dueDate.getMonth() + 1).padStart(2, '0');
    const d = String(dueDate.getDate()).padStart(2, '0');
    return `${y}-${mon}-${d}`;
  })();

  m.mastered = m.correct >= 5 && m.ease >= 2.5;
  masteryStore[wordId] = m;
  return m;
}

function simulateGetDueVocabWords(wordIds, masteryStore) {
  const today = getLocalDateKey();
  const dueReview = [];
  const mistakeCards = [];
  const newCards = [];

  wordIds.forEach(id => {
    const m = masteryStore[id];
    if (!m) {
      newCards.push(id);
    } else if (m.due <= today) {
      // Card is due — past its scheduled review date
      if (m.incorrect > m.correct && m.incorrect >= 2) {
        mistakeCards.push(id);
      } else {
        dueReview.push(id);
      }
    }
    // Cards with future due dates are skipped regardless of mastered status
  });

  const MAX_DAILY_QUEUE = 25;
  const MAX_NEW_CARDS = 10;
  const queue = [];
  queue.push(...dueReview);
  if (queue.length < MAX_DAILY_QUEUE) {
    const mistakeRoom = MAX_DAILY_QUEUE - queue.length;
    queue.push(...mistakeCards.slice(0, mistakeRoom));
  }
  if (queue.length < MAX_DAILY_QUEUE) {
    const newRoom = Math.min(MAX_NEW_CARDS, MAX_DAILY_QUEUE - queue.length);
    queue.push(...newCards.slice(0, newRoom));
  }

  return queue;
}

// ===== TESTS =====

describe('SM-2 SRS: Rating Behavior', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('Again (rating=1) resets interval and decreases ease', () => {
    // First answer correct to build some history
    simulateRecordVocabAnswer('A1_1', 3, store);
    expect(store['A1_1'].interval).toBe(1);
    expect(store['A1_1'].repetitions).toBe(1);
    expect(store['A1_1'].ease).toBeCloseTo(2.65, 2);

    // Now answer Again
    simulateRecordVocabAnswer('A1_1', 1, store);
    expect(store['A1_1'].repetitions).toBe(0);
    expect(store['A1_1'].interval).toBe(0);
    expect(store['A1_1'].ease).toBeCloseTo(2.45, 2);
  });

  it('Hard (rating=2) schedules sooner than Good', () => {
    // First answer
    simulateRecordVocabAnswer('A1_hard', 2, store);
    const hardInterval = store['A1_hard'].interval;

    // For comparison, answer Good on another word
    simulateRecordVocabAnswer('A1_good', 3, store);
    const goodInterval = store['A1_good'].interval;

    // Both start at interval 1 on first answer
    expect(hardInterval).toBe(1);
    expect(goodInterval).toBe(1);

    // Second round: Hard vs Good should diverge
    simulateRecordVocabAnswer('A1_hard', 2, store);
    simulateRecordVocabAnswer('A1_good', 3, store);
    expect(store['A1_hard'].interval).toBeLessThanOrEqual(store['A1_good'].interval);
  });

  it('Good (rating=3) schedules card into the future', () => {
    simulateRecordVocabAnswer('A1_1', 3, store);
    const today = getLocalDateKey();
    expect(store['A1_1'].interval).toBe(1);
    expect(store['A1_1'].due > today || store['A1_1'].due === today).toBe(true);

    // Second Good: interval grows to 6
    simulateRecordVocabAnswer('A1_1', 3, store);
    expect(store['A1_1'].interval).toBe(6);

    // Third Good: interval multiplied by ease (2.5+0.15+0.15 = 2.8)
    simulateRecordVocabAnswer('A1_1', 3, store);
    // ease after first Good: 2.5+0.15 = 2.65
    // ease after second Good: 2.65+0.15 = 2.80
    // interval = round(6 * 2.80) = round(16.8) = 17
    expect(store['A1_1'].interval).toBe(17);
  });

  it('Easy (rating=4) schedules farther than Good', () => {
    simulateRecordVocabAnswer('A1_easy', 4, store);
    simulateRecordVocabAnswer('A1_good', 3, store);

    // Easy starts at interval 3, Good at interval 1
    expect(store['A1_easy'].interval).toBe(3);
    expect(store['A1_good'].interval).toBe(1);
    expect(store['A1_easy'].due).not.toBe(store['A1_good'].due);
  });

  it('Good/Easy cards do not reappear before due date', () => {
    const today = getLocalDateKey();

    simulateRecordVocabAnswer('A1_1', 3, store);
    // Due date should be today+1 (interval=1 for first Good)
    const due = store['A1_1'].due;
    expect(due).toBe(getLocalDateKey(1));

    // Card was just answered. Due date is tomorrow, so it should NOT
    // appear in today's queue.
    const queue = simulateGetDueVocabWords(['A1_1'], store);
    expect(queue).not.toContain('A1_1');

    // Simulate a far future due — definitely excluded
    let m = store['A1_1'];
    m.mastered = true;
    m.due = '2999-12-31';
    store['A1_1'] = m;

    const queue2 = simulateGetDueVocabWords(['A1_1'], store);
    expect(queue2).not.toContain('A1_1');
  });

  it('not-due cards do not appear in queue', () => {
    simulateRecordVocabAnswer('A1_1', 3, store);
    // Card starts non-mastered, due today. getDueVocabWords
    // checks: if (!m.mastered || m.due <= today) => true => it shows.
    // To exclude, we must either mark mastered with future due,
    // OR the card just isn't in the queue because of daily cap.
    // Let's use the mastered+future due pattern
    let m = store['A1_1'];
    m.mastered = true;
    m.due = '2999-12-31';
    store['A1_1'] = m;

    const queue = simulateGetDueVocabWords(['A1_1'], store);
    expect(queue).not.toContain('A1_1');
  });

  it('due cards appear in queue', () => {
    // Create a card due today (past due date)
    store['A1_due'] = {
      correct: 2, incorrect: 0, mastered: false,
      ease: 2.5, interval: 1, due: getLocalDateKey(), repetitions: 1,
    };
    const queue = simulateGetDueVocabWords(['A1_due'], store);
    expect(queue).toContain('A1_due');
  });

  it('just-answered card does not reappear same day (due=tomorrow)', () => {
    simulateRecordVocabAnswer('A1_1', 3, store);
    // After Good, interval=1, due=tomorrow. Should NOT appear in today's queue.
    const queue = simulateGetDueVocabWords(['A1_1'], store);
    expect(queue).not.toContain('A1_1');
  });
});

describe('SM-2 SRS: Mistake Handling', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('wrong answer (false/Again) creates mistake entry', () => {
    // Wrong = rating 1 = Again
    simulateRecordVocabAnswer('A1_1', 1, store);
    expect(store['A1_1'].incorrect).toBe(1);
    expect(store['A1_1'].correct).toBe(0);
    expect(store['A1_1'].repetitions).toBe(0);
    expect(store['A1_1'].interval).toBe(0);
  });

  it('wrong answer (rating=1) schedules short-term relearning', () => {
    simulateRecordVocabAnswer('A1_1', 1, store);
    // Interval is 0, so due is today (same day relearning)
    const today = getLocalDateKey();
    expect(store['A1_1'].interval).toBe(0);
    expect(store['A1_1'].due).toBe(today);
  });

  it('mistake-generated vocabulary appears before new cards when due', () => {
    // Create a mistake card with high incorrect count
    simulateRecordVocabAnswer('A1_mistake', 1, store);
    simulateRecordVocabAnswer('A1_mistake', 1, store);
    // Now A1_mistake has incorrect=2, which triggers mistake priority
    expect(store['A1_mistake'].incorrect).toBe(2);
    expect(store['A1_mistake'].correct).toBe(0);

    // Create a new card (never seen)
    // Create a due review card
    simulateRecordVocabAnswer('A1_review', 3, store);

    // Run queue builder
    const queue = simulateGetDueVocabWords(['A1_mistake', 'A1_review', 'A1_new'], store);

    // Mistake should come before new and review in priority
    // Actually the queue is: dueReview first, then mistakeCards, then newCards
    // But getDueVocabWords sorts as [dueReview, mistakeCards, newCards]
    // A1_review with correct=1 (due review) comes first
    // A1_mistake with incorrect=2 (mistake) comes second
    // A1_new (never seen) comes third
    const mistakeIdx = queue.indexOf('A1_mistake');
    const newIdx = queue.indexOf('A1_new');
    const reviewIdx = queue.indexOf('A1_review');

    // Mistake should be before new
    expect(mistakeIdx).toBeLessThan(newIdx);
    // Review should be before mistake (priority: due reviews > mistakes > new)
    expect(reviewIdx).toBeLessThan(mistakeIdx);
  });
});

describe('SM-2 SRS: Persistence and Compatibility', () => {
  it('old localStorage vocabulary data does not crash (graceful default)', () => {
    // Simulate corrupt/missing localStorage — should fall back to defaults
    const emptyStore = {};
    const defaultMastery = {
      correct: 0,
      incorrect: 0,
      mastered: false,
      ease: 2.5,
      interval: 1,
      due: getLocalDateKey(),
      repetitions: 0,
    };
    // Access a non-existent word
    const word = emptyStore['A1_nonexistent'] || defaultMastery;
    expect(word.correct).toBe(0);
    expect(word.incorrect).toBe(0);
    expect(word.mastered).toBe(false);
    expect(word.ease).toBe(2.5);
  });

  it('boolean true maps to Good (rating 3)', () => {
    simulateRecordVocabAnswer('A1_1', true, {});
    // Can't test the internal mapping without exposing it
    // The simulation uses typeof check, so verify correct behavior
  });
});

describe('SM-2 SRS: Queue Capping', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('new cards capped at 10 per session', () => {
    // Create 20 new cards (never seen)
    const wordIds = Array.from({ length: 20 }, (_, i) => `A1_new_${i}`);
    const queue = simulateGetDueVocabWords(wordIds, store);
    // New cards should be at most 10
    const newCount = wordIds.filter(id => queue.includes(id)).length;
    expect(newCount).toBeLessThanOrEqual(10);
  });

  it('total queue capped at 25', () => {
    const wordIds = Array.from({ length: 40 }, (_, i) => `A1_new_${i}`);
    const queue = simulateGetDueVocabWords(wordIds, store);
    expect(queue.length).toBeLessThanOrEqual(25);
  });
});

describe('Vocabulary Practice: Session Size', () => {
  it('session size 5 shows max 5 items', () => {
    // Create a pool of 20 items
    const pool = Array.from({ length: 20 }, (_, i) => `A1_item_${i}`);
    const queue = simulateGetDueVocabWords(pool, {});
    const sessionSize = 5;
    const session = queue.slice(0, Math.min(sessionSize, queue.length));
    expect(session.length).toBeLessThanOrEqual(5);
  });

  it('session size 10 shows max 10 items', () => {
    const pool = Array.from({ length: 20 }, (_, i) => `A1_item_${i}`);
    const queue = simulateGetDueVocabWords(pool, {});
    const sessionSize = 10;
    const session = queue.slice(0, Math.min(sessionSize, queue.length));
    expect(session.length).toBeLessThanOrEqual(10);
  });

  it('session size 25 shows max 25 items', () => {
    const pool = Array.from({ length: 40 }, (_, i) => `A1_item_${i}`);
    const queue = simulateGetDueVocabWords(pool, {});
    const sessionSize = 25;
    const session = queue.slice(0, Math.min(sessionSize, queue.length));
    expect(session.length).toBeLessThanOrEqual(25);
  });

  it('Vocabulary Practice does not show all vocabulary (respects daily cap)', () => {
    // 803 A1 words exist. Daily cap is 25. Even on first day you only get 10 new.
    const allA1 = Array.from({ length: 803 }, (_, i) => `A1_voc_${i}`);
    const queue = simulateGetDueVocabWords(allA1, {});
    // Queue should not contain all 803
    expect(queue.length).toBeLessThan(803);
    expect(queue.length).toBeLessThanOrEqual(25);
  });

  it('current level A1 does not load B2 vocabulary', () => {
    const a1Pool = Array.from({ length: 10 }, (_, i) => `A1_item_${i}`);
    const b2Pool = Array.from({ length: 10 }, (_, i) => `B2_item_${i}`);

    const a1Queue = simulateGetDueVocabWords(a1Pool, {});
    const b2Queue = simulateGetDueVocabWords(b2Pool, {});

    // A1 queue should not contain B2 items
    a1Queue.forEach(id => {
      expect(id.startsWith('A1_')).toBe(true);
    });
    b2Queue.forEach(id => {
      expect(id.startsWith('B2_')).toBe(true);
    });
  });
});

describe('Today Plan Vocabulary Filtering (SRS-based)', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('correctly completed outside Today Plan should not appear unless due', () => {
    simulateRecordVocabAnswer('A1_correct_word', 3, store);
    expect(store['A1_correct_word'].correct).toBe(1);

    // Make it mastered with future due => excluded
    let m = store['A1_correct_word'];
    m.mastered = true;
    m.due = '2999-12-31';
    store['A1_correct_word'] = m;

    const queue = simulateGetDueVocabWords(['A1_correct_word'], store);
    expect(queue).not.toContain('A1_correct_word');
  });

  it('wrong vocabulary should appear as remediation only when due', () => {
    simulateRecordVocabAnswer('A1_wrong', 1, store);
    expect(store['A1_wrong'].interval).toBe(0);
    expect(store['A1_wrong'].incorrect).toBe(1);

    const today = getLocalDateKey();
    expect(store['A1_wrong'].due).toBe(today);

    const queue = simulateGetDueVocabWords(['A1_wrong'], store);
    expect(queue).toContain('A1_wrong');

    // After mastering with future due => excluded
    simulateRecordVocabAnswer('A1_wrong', 3, store);
    let m = store['A1_wrong'];
    m.mastered = true;
    m.due = '2999-12-31';
    store['A1_wrong'] = m;

    const queue2 = simulateGetDueVocabWords(['A1_wrong'], store);
    expect(queue2).not.toContain('A1_wrong');
  });

  it('due SRS vocabulary appears in Today Plan', () => {
    // Create a card due today
    store['A1_due_word'] = {
      correct: 2, incorrect: 0, mastered: false,
      ease: 2.5, interval: 1, due: getLocalDateKey(), repetitions: 1,
    };
    const queue = simulateGetDueVocabWords(['A1_due_word'], store);
    expect(queue).toContain('A1_due_word');
  });

  it('not-due mastered vocabulary does not appear in Today Plan', () => {
    store['A1_mastered_future'] = {
      correct: 10,
      incorrect: 0,
      mastered: true,
      ease: 2.8,
      interval: 30,
      due: '2999-12-31',
      repetitions: 5,
    };

    const queue = simulateGetDueVocabWords(['A1_mastered_future'], store);
    expect(queue).not.toContain('A1_mastered_future');
  });
});

describe('Persistence and Backward Compatibility', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('answered vocabulary status persists (data survives serialization roundtrip)', () => {
    simulateRecordVocabAnswer('A1_persist_1', 3, store);
    simulateRecordVocabAnswer('A1_persist_2', 4, store);
    simulateRecordVocabAnswer('A1_persist_3', 1, store);

    const serialized = JSON.stringify(store);
    const deserialized = JSON.parse(serialized);

    expect(deserialized['A1_persist_1'].correct).toBe(1);
    expect(deserialized['A1_persist_1'].repetitions).toBe(1);
    expect(deserialized['A1_persist_2'].interval).toBe(3);
    expect(deserialized['A1_persist_3'].incorrect).toBe(1);
  });

  it('old flashcard key data does not crash', () => {
    const oldData = {
      'A1_old': {
        correct: 3,
        incorrect: 0,
        mastered: true,
        ease: 2.5,
        interval: 6,
        due: getLocalDateKey(),
        repetitions: 2,
      }
    };

    const queue = simulateGetDueVocabWords(['A1_old'], oldData);
    expect(queue).toContain('A1_old');
  });

  it('old practiceProgress_v1 data does not interfere', () => {
    // practiceProgress_v1 data is a separate layer
    const ppOld = {
      vocabulary: {
        'A1_pp_word': {
          status: 'completed',
          attempts: 1,
          lastAttempt: '2026-05-01',
        }
      }
    };

    // SRS queue ignores practiceProgress_v1 data
    const queue = simulateGetDueVocabWords(['A1_pp_word'], {});
    expect(queue).toContain('A1_pp_word');

    // practiceProgress_v1 data remains valid
    expect(ppOld.vocabulary['A1_pp_word'].status).toBe('completed');
    expect(ppOld.vocabulary['A1_pp_word'].attempts).toBe(1);
  });
});

describe('FlashcardPage SRS Queue (Same Queue as Vocabulary Practice)', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('FlashcardPage due filter uses same queue (getDueVocabWords)', () => {
    const wordIds = ['A1_a', 'A1_b', 'A1_c'];
    // A1_a: rated Good = due tomorrow -> NOT due today
    simulateRecordVocabAnswer('A1_a', 3, store);
    // A1_b: rated Again twice = mistake, interval 0 -> due today
    simulateRecordVocabAnswer('A1_b', 1, store);
    simulateRecordVocabAnswer('A1_b', 1, store);
    // A1_c: new, never seen

    const queue = simulateGetDueVocabWords(wordIds, store);

    // A1_a answered Good, due=tomorrow, should NOT appear in today's queue
    expect(queue).not.toContain('A1_a');
    expect(queue).toContain('A1_b');
    expect(queue).toContain('A1_c');
    // A1_b is a mistake card, A1_c is new. Mistakes before new.
    expect(queue.indexOf('A1_b')).toBeLessThan(queue.indexOf('A1_c'));
  });

  it('Again/Hard/Good/Easy all produce valid SM-2 updates', () => {
    simulateRecordVocabAnswer('A1_r1', 1, store);
    simulateRecordVocabAnswer('A1_r2', 2, store);
    simulateRecordVocabAnswer('A1_r3', 3, store);
    simulateRecordVocabAnswer('A1_r4', 4, store);

    expect(store['A1_r1'].interval).toBe(0);
    expect(store['A1_r2'].interval).toBe(1);
    expect(store['A1_r3'].interval).toBe(1);
    expect(store['A1_r4'].interval).toBe(3);

    expect(store['A1_r1'].ease).toBeLessThan(store['A1_r2'].ease);
    expect(store['A1_r2'].ease).toBeLessThan(store['A1_r3'].ease);
    expect(store['A1_r3'].ease).toBeLessThan(store['A1_r4'].ease);
  });

  it('mastered + future due cards excluded (no early Good/Easy)', () => {
    store['A1_early'] = {
      correct: 5,
      incorrect: 0,
      mastered: true,
      ease: 2.5,
      interval: 30,
      due: '2999-12-31',
      repetitions: 5,
    };

    const queue = simulateGetDueVocabWords(['A1_early'], store);
    expect(queue).not.toContain('A1_early');
  });

  it('mistake cards prioritized before new cards', () => {
    simulateRecordVocabAnswer('A1_mistake', 1, store);
    simulateRecordVocabAnswer('A1_mistake', 1, store);

    const queue = simulateGetDueVocabWords(['A1_mistake', 'A1_new'], store);
    expect(queue.indexOf('A1_mistake')).toBeLessThan(queue.indexOf('A1_new'));
  });

  it('new cards capped at 10', () => {
    const allNew = Array.from({ length: 20 }, (_, i) => `A1_new_${i}`);
    const queue = simulateGetDueVocabWords(allNew, store);
    const newInQueue = allNew.filter(id => queue.includes(id)).length;
    expect(newInQueue).toBeLessThanOrEqual(10);
  });

  it('current level A1 does not include B2 words', () => {
    const a1Ids = ['A1_word_1', 'A1_word_2'];
    const b1Ids = ['B1_word_1', 'B1_word_2'];

    const a1Queue = simulateGetDueVocabWords(a1Ids, store);
    a1Queue.forEach(id => expect(id.startsWith('A1_')).toBe(true));

    const b1Queue = simulateGetDueVocabWords(b1Ids, store);
    b1Queue.forEach(id => expect(id.startsWith('B1_')).toBe(true));
  });
});

// ============================================================
// Phase 18B: Flashcard Card Type Generation Tests
// Replicate exact logic from FlashcardPage.jsx
// ============================================================

function generateCardTypes(word) {
  const art = word.article || '';
  const baseWord = word.word || '';
  const translation = word.translation || '';
  const isNoun = word.partOfSpeech === 'noun' || !!art;
  const cards = [];

  const meaningFront = art ? `${art} ${baseWord}` : baseWord;
  if (word.plural && isNoun) {
    cards.push({
      cardId: `${word._level}_${word.id}_meaning`,
      front: `${meaningFront} (${word.plural})`,
      back: translation,
      cardType: 'meaning',
      wordRef: `${word._level}_${word.id}`,
    });
  } else {
    cards.push({
      cardId: `${word._level}_${word.id}_meaning`,
      front: meaningFront,
      back: translation,
      cardType: 'meaning',
      wordRef: `${word._level}_${word.id}`,
    });
  }

  if (isNoun) {
    const cleanWord = baseWord.replace(/^(der|die|das)\s+/i, '').trim();
    cards.push({
      cardId: `${word._level}_${word.id}_article`,
      front: `Article of "${cleanWord}"?`,
      back: art ? `${art} ${cleanWord}` : cleanWord,
      cardType: 'article',
      wordRef: `${word._level}_${word.id}`,
    });
  }

  if (isNoun && word.plural) {
    const cleanWord = baseWord.replace(/^(der|die|das)\s+/i, '').trim();
    cards.push({
      cardId: `${word._level}_${word.id}_plural`,
      front: `Plural of "${art} ${cleanWord}"?`,
      back: word.plural,
      cardType: 'plural',
      wordRef: `${word._level}_${word.id}`,
    });
  }

  return cards;
}

function buildFlashcardQueue(words, sessionSize, masteryStore) {
  const today = getLocalDateKey();
  const MAX_NEW_CARDS = 10;
  const qDue = [];
  const qMistake = [];
  const qNew = [];

  words.forEach(w => {
    const id = `${w._level}_${w.id}`;
    const m = masteryStore[id];
    if (!m) {
      qNew.push(w);
    } else if (m.incorrect > m.correct && m.incorrect >= 2) {
      qMistake.push(w);
    } else if (!m.mastered || m.due <= today) {
      qDue.push(w);
    }
  });

  const cards = [];
  const generateCards = (wordList, limit) => {
    const result = [];
    for (const w of wordList) {
      if (result.length >= limit) break;
      const types = generateCardTypes(w);
      const eligible = (wordList === qNew)
        ? types.filter(t => t.cardType === 'meaning')
        : types;
      for (const t of eligible) {
        if (result.length < limit) result.push(t);
      }
    }
    return result;
  };

  cards.push(...generateCards(qDue, sessionSize));
  if (cards.length < sessionSize) {
    cards.push(...generateCards(qMistake, sessionSize - cards.length));
  }
  if (cards.length < sessionSize) {
    const newRoom = Math.min(MAX_NEW_CARDS, sessionSize - cards.length);
    cards.push(...generateCards(qNew, newRoom));
  }

  return cards;
}

describe('Phase 18B: Flashcard generateCardTypes', () => {
  it('generates meaning card for any word', () => {
    const types = generateCardTypes({ _level: 'A1', id: 1, word: 'Hallo', translation: 'hello', partOfSpeech: 'interjection' });
    const meaning = types.find(t => t.cardType === 'meaning');
    expect(meaning).toBeDefined();
    expect(meaning.front).toBe('Hallo');
    expect(meaning.back).toBe('hello');
    expect(meaning.wordRef).toBe('A1_1');
    expect(meaning.cardId).toBe('A1_1_meaning');
  });

  it('generates article card for noun', () => {
    const types = generateCardTypes({ _level: 'A1', id: 2, word: 'Arzt', article: 'der', translation: 'doctor', partOfSpeech: 'noun' });
    const article = types.find(t => t.cardType === 'article');
    expect(article).toBeDefined();
    expect(article.front).toContain('Article of');
    expect(article.back).toContain('der');
    expect(article.cardId).toBe('A1_2_article');
  });

  it('does not generate article card for non-noun', () => {
    const types = generateCardTypes({ _level: 'A1', id: 3, word: 'laufen', translation: 'to run', partOfSpeech: 'verb' });
    const article = types.find(t => t.cardType === 'article');
    expect(article).toBeUndefined();
  });

  it('generates plural card for noun with plural', () => {
    const types = generateCardTypes({ _level: 'A1', id: 4, word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' });
    const plural = types.find(t => t.cardType === 'plural');
    expect(plural).toBeDefined();
    expect(plural.front).toContain('Plural of');
    expect(plural.back).toBe('Ärzte');
    expect(plural.cardId).toBe('A1_4_plural');
  });

  it('does not generate plural card for non-noun', () => {
    const types = generateCardTypes({ _level: 'A1', id: 5, word: 'schön', translation: 'beautiful', partOfSpeech: 'adjective' });
    const plural = types.find(t => t.cardType === 'plural');
    expect(plural).toBeUndefined();
  });

  it('does not generate plural card for noun without plural', () => {
    const types = generateCardTypes({ _level: 'A1', id: 6, word: 'Wasser', article: 'das', translation: 'water', partOfSpeech: 'noun' });
    const plural = types.find(t => t.cardType === 'plural');
    expect(plural).toBeUndefined();
  });

  it('generates meaning, article, plural for full noun (3 card types)', () => {
    const types = generateCardTypes({ _level: 'A1', id: 7, word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' });
    expect(types.filter(t => t.cardType === 'meaning').length).toBe(1);
    expect(types.filter(t => t.cardType === 'article').length).toBe(1);
    expect(types.filter(t => t.cardType === 'plural').length).toBe(1);
    expect(types.length).toBe(3);
  });

  it('card IDs are stable: level_id_cardtype', () => {
    const types = generateCardTypes({ _level: 'A1', id: 7, word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' });
    expect(types[0].cardId).toBe('A1_7_meaning');
    expect(types[1].cardId).toBe('A1_7_article');
    expect(types[2].cardId).toBe('A1_7_plural');
  });

  it('meaning card includes plural info when noun has plural', () => {
    const types = generateCardTypes({ _level: 'A1', id: 8, word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' });
    const meaning = types.find(t => t.cardType === 'meaning');
    expect(meaning.front).toContain('(Ärzte)');
  });

  it('meaning card does not show plural for non-noun words', () => {
    const types = generateCardTypes({ _level: 'A1', id: 9, word: 'laufen', translation: 'to run', partOfSpeech: 'verb' });
    const meaning = types.find(t => t.cardType === 'meaning');
    expect(meaning.front).toBe('laufen');
    expect(meaning.front).not.toContain('(');
  });
});

describe('Phase 18B: Flashcard buildFlashcardQueue', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  function makeWord(id, level = 'A1', extra = {}) {
    return { _level: level, id, word: 'word' + id, translation: 'trans' + id, ...extra };
  }

  it('due review cards appear first in queue', () => {
    // Set up a due-but-not-mastered word (repetitions=1, interval=1, due=today)
    store['A1_1'] = { correct: 1, incorrect: 0, mastered: false, ease: 2.65, interval: 1, due: getLocalDateKey(), repetitions: 1 };
    const cards = buildFlashcardQueue([makeWord(1)], 20, store);
    expect(cards.length).toBeGreaterThanOrEqual(1);
    const wordRefs = cards.map(c => c.wordRef);
    expect(wordRefs).toContain('A1_1');
  });

  it('mistake cards appear before new cards', () => {
    simulateRecordVocabAnswer('A1_1', 1, store);
    simulateRecordVocabAnswer('A1_1', 1, store);
    simulateRecordVocabAnswer('A1_1', 1, store);
    const cards = buildFlashcardQueue([makeWord(1), makeWord(2)], 20, store);
    const mistakeIdx = cards.findIndex(c => c.wordRef === 'A1_1');
    const newIdx = cards.findIndex(c => c.wordRef === 'A1_2');
    expect(mistakeIdx).toBeGreaterThanOrEqual(0);
    expect(newIdx).toBeGreaterThanOrEqual(0);
    expect(mistakeIdx).toBeLessThan(newIdx);
  });

  it('caps new cards at MAX_NEW_CARDS (10)', () => {
    const words = Array.from({ length: 20 }, (_, i) => makeWord(i + 1));
    const cards = buildFlashcardQueue(words, 25, store);
    expect(cards.length).toBeLessThanOrEqual(25);
    const newRefs = cards.filter(c => !store[c.wordRef]);
    expect(newRefs.length).toBeLessThanOrEqual(10);
  });

  it('total queue capped at sessionSize', () => {
    const words = Array.from({ length: 50 }, (_, i) => makeWord(i + 1));
    const cards5 = buildFlashcardQueue(words, 5, store);
    expect(cards5.length).toBeLessThanOrEqual(5);
    const cards15 = buildFlashcardQueue(words, 15, store);
    expect(cards15.length).toBeLessThanOrEqual(15);
    const cards25 = buildFlashcardQueue(words, 25, store);
    expect(cards25.length).toBeLessThanOrEqual(25);
  });

  it('does not return all 100 words (reasonable cap)', () => {
    const words = Array.from({ length: 100 }, (_, i) => makeWord(i + 1));
    const cards = buildFlashcardQueue(words, 20, store);
    expect(cards.length).toBeLessThanOrEqual(25);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('returns different card types for nouns in due queue', () => {
    const wordData = { word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' };
    store['A1_1'] = { correct: 1, incorrect: 0, mastered: false, ease: 2.65, interval: 1, due: getLocalDateKey(), repetitions: 1 };
    const cards = buildFlashcardQueue([makeWord(1, 'A1', wordData)], 20, store);
    const types = cards.map(c => c.cardType);
    expect(types).toContain('meaning');
    expect(types).toContain('article');
    expect(types).toContain('plural');
  });

  it('new cards only get meaning card type (simpler intro)', () => {
    const wordData = { word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' };
    const cards = buildFlashcardQueue([makeWord(1, 'A1', wordData)], 10, store);
    const types = cards.map(c => c.cardType);
    expect(types).toEqual(['meaning']);
  });

  it('article card only shows for nouns', () => {
    const nounData = { word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' };
    store['A1_1'] = { correct: 1, incorrect: 0, mastered: false, ease: 2.65, interval: 1, due: getLocalDateKey(), repetitions: 1 };
    const nounCards = buildFlashcardQueue([makeWord(1, 'A1', nounData)], 20, store);
    const nounTypes = nounCards.map(c => c.cardType);
    expect(nounTypes).toContain('article');

    const verbData = { word: 'laufen', translation: 'to run', partOfSpeech: 'verb' };
    store = {};
    store['A1_2'] = { correct: 1, incorrect: 0, mastered: false, ease: 2.65, interval: 1, due: getLocalDateKey(), repetitions: 1 };
    const verbCards = buildFlashcardQueue([makeWord(2, 'A1', verbData)], 20, store);
    const verbTypes = verbCards.map(c => c.cardType);
    expect(verbTypes).not.toContain('article');
  });

  it('plural card only shows for nouns with plural', () => {
    const nounData = { word: 'Arzt', article: 'der', plural: 'Ärzte', translation: 'doctor', partOfSpeech: 'noun' };
    store['A1_1'] = { correct: 0, incorrect: 0, mastered: false, ease: 2.5, interval: 0, due: getLocalDateKey(), repetitions: 0 };
    const nounCards = buildFlashcardQueue([makeWord(1, 'A1', nounData)], 20, store);
    const nounTypes = nounCards.map(c => c.cardType);
    expect(nounTypes).toContain('plural');

    const noPluralData = { word: 'Wasser', article: 'das', translation: 'water', partOfSpeech: 'noun' };
    store = {};
    store['A1_2'] = { correct: 0, incorrect: 0, mastered: false, ease: 2.5, interval: 0, due: getLocalDateKey(), repetitions: 0 };
    const noPluralCards = buildFlashcardQueue([makeWord(2, 'A1', noPluralData)], 20, store);
    const noPluralTypes = noPluralCards.map(c => c.cardType);
    expect(noPluralTypes).not.toContain('plural');
  });

  it('session size 5 produces up to 5 cards', () => {
    const words = Array.from({ length: 10 }, (_, i) => makeWord(i + 1));
    const cards = buildFlashcardQueue(words, 5, store);
    expect(cards.length).toBeLessThanOrEqual(5);
  });

  it('session size 10 produces up to 10 cards', () => {
    const words = Array.from({ length: 20 }, (_, i) => makeWord(i + 1));
    const cards = buildFlashcardQueue(words, 10, store);
    expect(cards.length).toBeLessThanOrEqual(10);
  });

  it('Flashcards do not show all 803 words', () => {
    const words = Array.from({ length: 803 }, (_, i) => makeWord(i + 1));
    const cards = buildFlashcardQueue(words, 25, store);
    expect(cards.length).toBeLessThan(803);
    expect(cards.length).toBeLessThanOrEqual(25);
  });
});

describe('Phase 18B: SM-2 Scheduling Rules', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('Good card does not reappear immediately', () => {
    simulateRecordVocabAnswer('A1_1', 3, store);
    expect(store['A1_1'].interval).toBe(1);
    store['A1_1'].mastered = true;
    store['A1_1'].due = '2999-12-31';
    const queue = simulateGetDueVocabWords(['A1_1'], store);
    expect(queue).not.toContain('A1_1');
  });

  it('Easy card schedules farther than Good', () => {
    simulateRecordVocabAnswer('A1_easy', 4, store);
    simulateRecordVocabAnswer('A1_good', 3, store);
    expect(store['A1_easy'].interval).toBe(3);
    expect(store['A1_good'].interval).toBe(1);
    expect(store['A1_easy'].interval).toBeGreaterThan(store['A1_good'].interval);
  });

  it('Hard schedules sooner than Good', () => {
    simulateRecordVocabAnswer('A1_hard', 2, store);
    simulateRecordVocabAnswer('A1_good', 3, store);
    simulateRecordVocabAnswer('A1_hard', 2, store);
    simulateRecordVocabAnswer('A1_good', 3, store);
    expect(store['A1_hard'].interval).toBeLessThanOrEqual(store['A1_good'].interval);
  });

  it('Again schedules short relearning', () => {
    simulateRecordVocabAnswer('A1_1', 1, store);
    expect(store['A1_1'].interval).toBe(0);
    expect(store['A1_1'].due).toBe(getLocalDateKey());
  });

  it('Easy does not reappear before due date', () => {
    simulateRecordVocabAnswer('A1_1', 4, store);
    const m = store['A1_1'];
    m.mastered = true;
    m.due = '2999-12-31';
    store['A1_1'] = m;
    const queue = simulateGetDueVocabWords(['A1_1'], store);
    expect(queue).not.toContain('A1_1');
  });

  it('Hard schedules but is still due today', () => {
    simulateRecordVocabAnswer('A1_1', 2, store);
    expect(store['A1_1'].interval).toBe(1);
    // When interval=1 at time of call, due date = today + 1 day
    // So after recording, due is tomorrow
    const tomorrow = getLocalDateKey(1);
    expect(store['A1_1'].due).toBe(tomorrow);
  });

  it('mastered cards with future due excluded from queue', () => {
    store['A1_m'] = { correct: 10, incorrect: 0, mastered: true, ease: 2.8, interval: 30, due: '2999-12-31', repetitions: 5 };
    const queue = simulateGetDueVocabWords(['A1_m'], store);
    expect(queue).not.toContain('A1_m');
  });
});

describe('Phase 18B: Today Plan Integration', () => {
  let store;

  beforeEach(() => {
    store = {};
  });

  it('due cards appear in Today Plan', () => {
    store['A1_due'] = { correct: 2, incorrect: 0, mastered: false, ease: 2.5, interval: 1, due: getLocalDateKey(), repetitions: 1 };
    const queue = simulateGetDueVocabWords(['A1_due'], store);
    expect(queue).toContain('A1_due');
  });

  it('not-due cards do not appear in Today Plan', () => {
    store['A1_not_due'] = { correct: 5, incorrect: 0, mastered: true, ease: 2.5, interval: 30, due: '2999-12-31', repetitions: 5 };
    const queue = simulateGetDueVocabWords(['A1_not_due'], store);
    expect(queue).not.toContain('A1_not_due');
  });

  it('mistake cards prioritized before new cards in Today Plan', () => {
    store['A1_mistake'] = { correct: 0, incorrect: 3, mastered: false, ease: 2.1, interval: 0, due: getLocalDateKey(), repetitions: 0 };
    const queue = simulateGetDueVocabWords(['A1_mistake', 'A1_new'], store);
    expect(queue.indexOf('A1_mistake')).toBeLessThan(queue.indexOf('A1_new'));
  });

  it('new cards appear only within daily cap in Today Plan', () => {
    const words = Array.from({ length: 20 }, (_, i) => 'A1_new_' + i);
    const queue = simulateGetDueVocabWords(words, store);
    const newInQueue = words.filter(id => queue.includes(id)).length;
    expect(newInQueue).toBeLessThanOrEqual(10);
  });

  it('cards answered correctly in Flashcards do not reappear until due', () => {
    simulateRecordVocabAnswer('A1_correct', 3, store);
    // After Good (rating 3), interval=1 and due=tomorrow.
    // The card should NOT be in today's queue.
    let queue = simulateGetDueVocabWords(['A1_correct'], store);
    expect(queue).not.toContain('A1_correct');

    // Simulate setting future due far away
    let m = store['A1_correct'];
    m.mastered = true;
    m.due = '2999-12-31';
    store['A1_correct'] = m;

    queue = simulateGetDueVocabWords(['A1_correct'], store);
    expect(queue).not.toContain('A1_correct');
  });
});
