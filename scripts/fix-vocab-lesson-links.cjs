#!/usr/bin/env node
/**
 * fix-vocab-lesson-links.cjs
 *
 * Phase 8: Maps vocabulary items with invalid/generic lesson IDs
 * to the nearest real lesson by level and topic.
 *
 * Invalid IDs handled:
 * - *_lesson_general -> map to closest topic-matching lesson
 * - level-specific bad IDs (b1;travel, b2;psychology, etc.)
 * - Out-of-range numbers (lesson 26-30)
 * - Other weird IDs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const vocab = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanVocabulary.json'), 'utf8'));
const lessons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanLessons.json'), 'utf8'));

// Build a topic->lessonId mapping per level
// Lesson 1..25 are the "base" lessons. We map by matching topic keywords.
function buildTopicMap(level) {
  const levelLessons = lessons.filter(l => l.level === level);
  const map = {};
  for (const l of levelLessons) {
    const topic = (l.topic || '').toLowerCase();
    const title = (l.title || '').toLowerCase();
    const vocabTopics = (l.vocabularyTopics || []).join(' ').toLowerCase();
    const keywords = [topic, title, vocabTopics].join(' ');

    // Determine primary topic keyword for this lesson
    for (const kw of [
      'hobbies', 'leisure', 'free time', 'entertainment',
      'travel', 'transport', 'vacation', 'trip',
      'education', 'learning', 'school', 'training', 'university', 'academic', 'studium',
      'grammar', 'language',
      'shopping', 'services', 'store', 'market',
      'home', 'living', 'house', 'apartment',
      'business', 'economy', 'work', 'career', 'job', 'employment',
      'health', 'body', 'medical', 'fitness',
      'technology', 'media', 'tech', 'digital',
      'emotions', 'relationships', 'feelings', 'family',
      'food', 'restaurant', 'cooking', 'eating',
      'nature', 'environment', 'weather', 'climate',
      'sport', 'exercise', 'game',
      'culture', 'art', 'music', 'movie', 'film',
      'politics', 'society', 'government',
      'science', 'research', 'psychology',
      'law', 'legal', 'justice', 'recht',
      'communication', 'media', 'presse',
      'finance', 'money', 'bank',
      'admin', 'administration', 'office', 'behörde',
      'argumentation', 'debate', 'discussion',
      'academic', 'wissenschaft'
    ]) {
      if (keywords.includes(kw)) {
        if (!map[kw]) map[kw] = [];
        map[kw].push(l.id);
      }
    }
  }
  return map;
}

const B1_TOPIC_MAP = buildTopicMap('B1');
const B2_TOPIC_MAP = buildTopicMap('B2');
const C1_TOPIC_MAP = buildTopicMap('C1');

// Mapping rules for generic IDs
function mapGenericId(badId, topic, level) {
  const t = (topic || '').toLowerCase();
  const levelMap = level === 'B1' ? B1_TOPIC_MAP :
                   level === 'B2' ? B2_TOPIC_MAP :
                   level === 'C1' ? C1_TOPIC_MAP : {};

  // First: topic-based mapping
  const topicKeywords = [
    ['hobbies', 'hobbies', 'leisure', 'entertainment', 'free time'],
    ['travel', 'travel', 'transport', 'vacation', 'tourism', 'tourismus'],
    ['education', 'education', 'learning', 'school', 'university', 'academic', 'studium'],
    ['grammar', 'grammar', 'language'],
    ['shopping', 'shopping', 'services', 'store'],
    ['home', 'home', 'living', 'house'],
    ['business', 'business', 'economy', 'work', 'career', 'job', 'employment', 'beruf', 'arbeit'],
    ['health', 'health', 'body', 'medical', 'fitness'],
    ['technology', 'technology', 'media', 'tech', 'digital'],
    ['emotions', 'emotions', 'relationships', 'feelings', 'family'],
    ['food', 'food', 'restaurant', 'cooking'],
    ['nature', 'nature', 'environment', 'weather', 'climate', 'environment'],
    ['culture', 'culture', 'art', 'music'],
    ['politics', 'politics', 'society', 'government', 'politik'],
    ['psychology', 'psychology', 'science', 'research', 'psychologie'],
    ['law', 'law', 'legal', 'justice', 'recht'],
    ['communication', 'communication', 'media', 'presse'],
    ['finance', 'finance', 'money', 'bank'],
    ['admin', 'admin', 'administration', 'office', 'behörde'],
    ['argumentation', 'argumentation', 'debate', 'discussion'],
    ['academic', 'academic', 'wissenschaft', 'study', 'university']
  ];

  for (const [key, ...alts] of topicKeywords) {
    if (t.includes(key) || alts.some(a => t.includes(a))) {
      if (levelMap[key] && levelMap[key].length > 0) {
        return levelMap[key][0];
      }
    }
  }

  // If badId itself gives a clue
  if (badId.includes('travel')) return `${level}_lesson_1`;
  if (badId.includes('psychology')) return `${level}_lesson_17`;
  if (badId.includes('communication')) return `${level}_lesson_14`;
  if (badId.includes('economy')) return `${level}_lesson_9`;
  if (badId.includes('politics')) return `${level}_lesson_16`;
  if (badId.includes('academic')) return `${level}_lesson_18`;
  if (badId.includes('law') || badId.includes('admin')) return `${level}_lesson_20`;
  if (badId.includes('argumentation')) return `${level}_lesson_2`;
  if (badId.includes('workplace')) return `${level}_lesson_8`;
  if (badId.includes('abstract')) return `${level}_lesson_1`;
  if (badId.includes('general')) return `${level}_lesson_1`;

  // Last resort: lesson 1
  return `${level}_lesson_1`;
}

let totalFixed = { B1: 0, B2: 0, C1: 0 };

for (const level of ['B1', 'B2', 'C1']) {
  const items = vocab[level] || [];
  const lessonIds = new Set(lessons.filter(l => l.level === level).map(l => l.id));

  for (const item of items) {
    const lid = item.taughtInLessonId || item.lessonId;
    if (!lid) continue;

    const origLid = lid;

    // Check if this is a numeric-only lessonId
    if (/^\d+$/.test(lid)) {
      const padded = `${level}_lesson_${lid}`;
      if (lessonIds.has(padded)) {
        if (item.taughtInLessonId) item.taughtInLessonId = padded;
        if (item.lessonId) item.lessonId = padded;
        totalFixed[level]++;
        continue;
      }
    }

    if (lessonIds.has(lid)) continue;

    // Invalid — map to a real lesson
    const newLid = mapGenericId(lid, item.topic, level);
    if (item.taughtInLessonId) {
      item.taughtInLessonId = newLid;
    } else if (item.lessonId) {
      item.lessonId = newLid;
    }
    totalFixed[level]++;
  }
}

// Summary
console.log('=== Fixed vocabulary lesson IDs ===');
console.log(`B1: ${totalFixed.B1} items`);
console.log(`B2: ${totalFixed.B2} items`);
console.log(`C1: ${totalFixed.C1} items`);
console.log(`Total: ${totalFixed.B1 + totalFixed.B2 + totalFixed.C1}`);

fs.writeFileSync(path.join(DATA_DIR, 'germanVocabulary.json'), JSON.stringify(vocab, null, 2), 'utf8');
console.log('germanVocabulary.json saved');
