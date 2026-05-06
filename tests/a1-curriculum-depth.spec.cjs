// @ts-check
const { test, expect } = require('@playwright/test');

const lessons = require('../src/data/germanLessons.json');
const grammar = require('../src/data/grammar.json');
const vocabulary = require('../src/data/germanVocabulary.json');
const curriculum = require('../src/data/curriculumArchitecture.json');

const PREVIEW_URL = 'http://localhost:4175/deutsch-klinik';

async function gotoPreview(page, hash = '/') {
  await page.goto(`${PREVIEW_URL}/#${hash}`, { waitUntil: 'networkidle' });
}

async function seed(page, state = {}) {
  await page.addInitScript((initialState) => {
    localStorage.clear();
    localStorage.setItem('deutsch_klinik_state', JSON.stringify({
      currentLevel: 'A1',
      theme: 'dark',
      levels: {},
      writings: [],
      speakingRecordings: {},
      incorrectAnswers: {},
      mistakeNotebook: {},
      topicWeakness: {},
      vocabularyMastery: {},
      flashcards: {},
      ...initialState,
    }));
  }, state);
}

test.describe('A1 curriculum depth and alignment', () => {
  test('A1 curriculum architecture lists the required grammar and vocabulary modules', () => {
    const requiredModuleIds = [
      'a1_alphabet_pronunciation',
      'a1_noun_gender_basics',
      'a1_articles_definite',
      'a1_accusative_basics',
      'a1_personal_pronouns',
      'a1_present_tense_regular',
      'a1_sein',
      'a1_haben',
      'a1_modal_verbs',
      'a1_word_order_main_clause',
      'a1_yes_no_questions',
      'a1_w_questions',
      'a1_negation_nicht_kein',
      'a1_plural_basics',
      'a1_basic_prepositions',
      'a1_time_numbers_dates',
      'a1_separable_verbs_intro',
      'a1_basic_sentence_building',
      'a1_everyday_vocabulary',
      'a1_medical_starter_phrases',
    ];

    const modules = curriculum.a1CurriculumModules || [];
    const lessonIds = new Set(lessons.filter((lesson) => lesson.level === 'A1').map((lesson) => lesson.id));

    for (const moduleId of requiredModuleIds) {
      const module = modules.find((item) => item.id === moduleId);
      expect(module, `missing module ${moduleId}`).toBeTruthy();
      expect(module.required, `${moduleId} should be required`).toBe(true);
      expect(lessonIds.has(module.lessonId), `${moduleId} should link to an A1 lesson`).toBe(true);
    }
  });

  test('expanded A1 lessons include explanation, examples, common mistakes, and mini drills', () => {
    const requiredLessonIds = Array.from({ length: 17 }, (_, index) => `A1_lesson_${index + 1}`);

    for (const lessonId of requiredLessonIds) {
      const lesson = lessons.find((item) => item.id === lessonId);
      expect(lesson, `missing ${lessonId}`).toBeTruthy();
      expect(lesson.level).toBe('A1');
      expect((lesson.explanation || '').length, `${lessonId} needs a detailed explanation`).toBeGreaterThan(80);
      expect(Array.isArray(lesson.examples) && lesson.examples.length > 0, `${lessonId} needs examples`).toBe(true);
      expect(Array.isArray(lesson.commonMistakes) && lesson.commonMistakes.length > 0, `${lessonId} needs common mistakes`).toBe(true);
      expect(Array.isArray(lesson.miniDrills) && lesson.miniDrills.length > 0, `${lessonId} needs mini drills`).toBe(true);
      expect(Array.isArray(lesson.linkedPracticeConceptTags) && lesson.linkedPracticeConceptTags.length > 0, `${lessonId} needs linked practice tags`).toBe(true);
      expect(Array.isArray(lesson.remediationTags) && lesson.remediationTags.length > 0, `${lessonId} needs remediation tags`).toBe(true);
      expect(typeof lesson.estimatedMinutes, `${lessonId} needs estimated minutes`).toBe('number');
    }
  });

  test('all A1 grammar questions are tagged with taught concept and remediation lesson metadata', () => {
    const lessonIds = new Set(lessons.filter((lesson) => lesson.level === 'A1').map((lesson) => lesson.id));

    for (const question of grammar.A1 || []) {
      expect(question.conceptId, `${question.id} missing conceptId`).toBeTruthy();
      expect(question.taughtInLessonId, `${question.id} missing taughtInLessonId`).toBeTruthy();
      expect(question.remediationLessonId, `${question.id} missing remediationLessonId`).toBeTruthy();
      expect(question.skillType, `${question.id} missing skillType`).toBe('grammar');
      expect(Array.isArray(question.prerequisiteConceptIds), `${question.id} missing prerequisiteConceptIds`).toBe(true);
      expect(lessonIds.has(question.taughtInLessonId), `${question.id} points to missing lesson`).toBe(true);
    }
  });

  test('A1 vocabulary entries include teaching metadata and remain display-safe', () => {
    const lessonIds = new Set(lessons.filter((lesson) => lesson.level === 'A1').map((lesson) => lesson.id));

    for (const word of vocabulary.A1 || []) {
      expect(word.conceptId, `${word.id} missing conceptId`).toBeTruthy();
      expect(word.taughtInLessonId || word.lessonId, `${word.id} missing lesson link`).toBeTruthy();
      expect(word.studyNote, `${word.id} missing study note`).toBeTruthy();
      expect(word.usageNote, `${word.id} missing usage note`).toBeTruthy();
      expect(word.example, `${word.id} missing example`).toBeTruthy();
      expect(lessonIds.has(word.taughtInLessonId || word.lessonId), `${word.id} points to missing A1 lesson`).toBe(true);
      expect(`${word.word} ${word.example}`).not.toMatch(/\b(Tschuss|fuer|heisst|koennen|moechte|muessen)\b/i);
    }
  });

  test('daily A1 grammar practice recommends the prerequisite lesson before tagged practice', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/daily?forceMission=grammar');

    await expect(page.getByText('You should study this lesson first:')).toBeVisible();
    await expect(page.locator('a[href*="/level/A1/lessons/A1_lesson_"]').first()).toBeVisible();
  });
});
