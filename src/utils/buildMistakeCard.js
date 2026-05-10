/**
 * buildMistakeCard.js — Shared mistake flashcard builder.
 *
 * Transforms a raw mistake object (from incorrectAnswers[level]) into a
 * consistent shape suitable for flashcard rendering in MistakeNotebookPage,
 * DailyMissionPage, or anywhere mistake cards appear.
 *
 * NEW mistakes (with context fields) get rich front/back content.
 * OLD mistakes (without context fields) gracefully fall back.
 *
 * SM-2 fields are preserved but not modified here — they live in vocabularyMastery.
 */

/**
 * Build a mistake flashcard from a raw mistake object.
 *
 * @param {object} mistake - A single entry from incorrectAnswers[level]
 * @param {string} level - A1/A2/B1/B2/C1
 * @param {object} [vocabMastery] - The SRS entry from vocabularyMastery for this mistake
 * @returns {{
 *   id: string,
 *   skill: string,
 *   level: string,
 *   topic: string,
 *   front: string,
 *   back: string,
 *   sourcePrompt: string|null,
 *   sourceQuestion: string|null,
 *   sourceOptions: Array|null,
 *   userAnswer: string,
 *   correctAnswer: string,
 *   explanation: string|null,
 *   correctedSentence: string|null,
 *   contextMissing: boolean,
 * }}
 */
export function buildMistakeCard(mistake, level, vocabMastery) {
  const skill = mistake.skill || mistake.topic || 'general';
  const topic = mistake.topic || skill;
  const userAnswer = mistake.userAnswer || '';
  const correctAnswer = mistake.correctAnswer || '';

  const hasContext = !!(
    mistake.sourcePrompt ||
    mistake.sourceQuestion ||
    mistake.sourceSentence ||
    mistake.sourceItemId
  );

  // Determine the most meaningful source text for context display
  const sourceText =
    mistake.sourcePrompt ||
    mistake.sourceSentence ||
    mistake.sourceQuestion ||
    null;

  // Build the front (what the user sees before flipping)
  let front = '';
  if (hasContext) {
    if (sourceText) {
      front = sourceText;
    } else {
      front = mistake.sourceTitle || 'Review this mistake';
    }
    // Append user answer indicator
    if (userAnswer) {
      front += '\n\nYour answer: ' + userAnswer;
    }
  } else {
    // Old mistake without context — show fallback but still include what we know
    front = 'Context missing for this older mistake.';
    if (userAnswer) {
      front += '\n\nYour answer: ' + userAnswer;
    }
  }

  // Build the back (correct answer + explanation)
  let back = 'Correct answer: ' + correctAnswer;
  if (mistake.correctedSentence) {
    back += '\n\nFull sentence:\n' + mistake.correctedSentence;
  }
  if (mistake.explanation) {
    back += '\n\nExplanation:\n' + mistake.explanation;
  } else if (!hasContext) {
    back += '\n\nExplanation not available for this older mistake.';
  }
  if (mistake.sourceTitle) {
    back += '\n\nSource: ' + mistake.sourceTitle;
  }

  return {
    id: `${level}_${mistake.exerciseId || Date.now()}`,
    skill,
    level,
    topic,
    front,
    back,
    sourcePrompt: mistake.sourcePrompt || null,
    sourceQuestion: mistake.sourceQuestion || null,
    sourceOptions: mistake.sourceOptions || null,
    userAnswer,
    correctAnswer,
    explanation: mistake.explanation || null,
    correctedSentence: mistake.correctedSentence || null,
    contextMissing: !hasContext,
    // SM-2 fields from vocabularyMastery (if provided)
    dueAt: vocabMastery?.due || null,
    easeFactor: vocabMastery?.ease || 2.5,
    intervalDays: vocabMastery?.interval || 0,
    repetitions: vocabMastery?.repetitions || 0,
    mastered: vocabMastery?.mastered || false,
  };
}

/**
 * Check if the front of a mistake card would show only an isolated answer
 * (die, der, das, einen, etc.) with no surrounding context.
 *
 * @param {string} front - The card front text
 * @returns {boolean} true if the front appears impoverished
 */
export function isMistakeCardImpoverished(front) {
  const cleaned = (front || '').trim().toLowerCase();
  // Common isolated German articles / short answers
  const isolatedWords = [
    'der', 'die', 'das', 'den', 'dem', 'des',
    'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
    'mein', 'meine', 'dein', 'deine', 'sein', 'seine', 'ihr', 'ihre',
    'bin', 'bist', 'ist', 'sind', 'seid',
    'true', 'false',
  ];
  if (isolatedWords.includes(cleaned)) return true;
  // Fewer than 4 chars with no spaces
  if (cleaned.length < 4 && !cleaned.includes(' ')) return true;
  return false;
}

export default buildMistakeCard;
