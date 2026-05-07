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

async function selectedDailyIds(page, skill) {
  return page.evaluate((name) => {
    const raw = localStorage.getItem('deutsch_klinik_daily_session');
    if (!raw) return [];
    return JSON.parse(raw).selectedExerciseIds?.[name] || [];
  }, skill);
}

async function completeNextLessonMission(page) {
  if (await page.getByText('Lesson Complete!').count()) {
    await page.getByRole('button', { name: /Next Mission/i }).click();
    return;
  }
  await page.getByRole('button', { name: /Study Lesson/i }).click();
  await page.getByRole('button', { name: /Mark Lesson Complete/i }).click();
  await page.getByRole('button', { name: /Next Mission/i }).click();
}

async function skipGrammarLessonIfShown(page) {
  const skip = page.getByRole('button', { name: /Skip for now/i });
  if (await skip.count()) await skip.click();
}

async function answerGrammarMission(page) {
  let ids = await selectedDailyIds(page, 'grammar');
  for (const id of ids) {
    const question = (grammar.A1 || []).find(item => item.id === id);
    if (!question) continue;
    if (Array.isArray(question.options) && question.options.length > 0) {
      await page.getByRole('button', { name: question.answer }).click();
    } else {
      await page.getByPlaceholder('Type your answer...').fill(question.answer);
      await page.getByRole('button', { name: /Check/i }).click();
    }
    const next = page.getByRole('button', { name: /Next Question|See Results/i });
    if (await next.count()) await next.click();
  }
  await page.getByRole('button', { name: /Next Mission/i }).click();
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

  test('A1 lesson 2 renders expanded number curriculum content', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/lessons/A1_lesson_2');

    await expect(page.getByRole('heading', { name: /Das Alphabet, Aussprache und Zahlen/i })).toBeVisible();
    await expect(page.getByText('zweiundzwanzig').first()).toBeVisible();
    await expect(page.getByText('dreiunddreißig').first()).toBeVisible();
    await expect(page.getByText('siebenundvierzig').first()).toBeVisible();
    await expect(page.getByText('Pronunciation Guide').first()).toBeVisible();
    await expect(page.getByText(/Mini Drills|Controlled Practice/i).first()).toBeVisible();
    await expect(page.getByText('Common Mistakes').first()).toBeVisible();
    await expect(page.getByText('Forms and Tables').first()).toBeVisible();
  });

  test('A1 lesson 1 renders expanded pronunciation and umlaut guidance', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/lessons/A1_lesson_1');

    await expect(page.getByText(/ä sounds close to e/i).first()).toBeVisible();
    await expect(page.getByText(/ö and ü need rounded lips/i).first()).toBeVisible();
    await expect(page.getByText(/ß sounds like a clear s/i).first()).toBeVisible();
    await expect(page.getByText(/German nouns and names are capitalized/i).first()).toBeVisible();
    await expect(page.getByText('Common Mistakes').first()).toBeVisible();
  });

  test('daily grammar lesson uses linked expanded lesson content when available', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/daily');

    await completeNextLessonMission(page);
    await completeNextLessonMission(page);
    await expect(page.getByRole('heading', { name: /Grammar Lesson/i })).toBeVisible();
    await page.getByRole('button', { name: /Study Grammar Lesson/i }).click();

    await expect(page.getByRole('heading', { name: /Das Alphabet, Aussprache und Zahlen/i })).toBeVisible();
    await expect(page.getByText('zweiundzwanzig').first()).toBeVisible();
    await expect(page.getByText('Pronunciation Guide').first()).toBeVisible();
    await expect(page.getByText('Common Mistakes').first()).toBeVisible();
  });

  test('consecutive daily lesson missions show full lesson content before completion banner', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/daily');

    await page.getByRole('button', { name: /Study Lesson/i }).click();
    await page.getByRole('button', { name: /Mark Lesson Complete/i }).click();
    await page.getByRole('button', { name: /Next Mission/i }).click();

    await expect(page.getByText('Study lesson 2 of 2', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Study Lesson/i })).toBeVisible();
    await expect(page.getByText('Lesson Complete!')).toHaveCount(0);

    await page.getByRole('button', { name: /Study Lesson/i }).click();
    await expect(page.getByRole('heading', { name: /Das Alphabet und die Zahlen|Das Alphabet, Aussprache und Zahlen/i })).toBeVisible();
    await expect(page.getByText('Explanation:')).toBeVisible();
    await expect(page.getByRole('button', { name: /Mark Lesson Complete/i })).toBeVisible();
  });

  test('A1 lessons 3 through 17 render visible depth sections', async ({ page }) => {
    await seed(page);

    for (let lessonNumber = 3; lessonNumber <= 17; lessonNumber += 1) {
      await gotoPreview(page, `/level/A1/lessons/A1_lesson_${lessonNumber}`);
      await expect(page.getByRole('heading', { name: 'Explanation' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Examples' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Common Mistakes' })).toBeVisible();
      await expect(page.getByText(/Mini Drills|Controlled Practice/i).first()).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Linked Practice and Remediation' })).toBeVisible();
    }
  });

  test('A1 lesson 4 visibly teaches masculine accusative changes and object verbs', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/lessons/A1_lesson_4');

    await expect(page.getByText(/only masculine articles visibly change/i)).toBeVisible();
    await expect(page.getByText('den/einen').first()).toBeVisible();
    await expect(page.getByText('Ich sehe den Mann.').first()).toBeVisible();
    await expect(page.getByText(/sehen, haben, kaufen, essen, trinken, besuchen/i)).toBeVisible();
  });

  test('A1 lesson 8 visibly teaches modal verb forms and final infinitive pattern', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/lessons/A1_lesson_8');

    await expect(page.getByText(/second verb stays in the infinitive at the end/i)).toBeVisible();
    await expect(page.getByText('ich kann, du kannst, er kann, wir können').first()).toBeVisible();
    await expect(page.getByText('Ich kann schwimmen.').first()).toBeVisible();
    await expect(page.getByText('Ich kann gut singen.').first()).toBeVisible();
  });

  test('A1 lesson 16 visibly teaches medical haben phrases and imperative forms', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/lessons/A1_lesson_16');

    await expect(page.getByText(/For symptoms, A1 uses haben/i)).toBeVisible();
    await expect(page.getByText('Ich habe Schmerzen.').first()).toBeVisible();
    await expect(page.getByText('Gehen Sie nach links. Nehmen Sie Platz.').first()).toBeVisible();
    await expect(page.getByText('Sei leise!').first()).toBeVisible();
    await expect(page.getByText('Seid leise!').first()).toBeVisible();
  });

  test('daily A1 grammar practice recommends the prerequisite lesson before tagged practice', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/daily?forceMission=grammar');

    await expect(page.getByText('You should study this lesson first:')).toBeVisible();
    await expect(page.locator('a[href*="/level/A1/lessons/A1_lesson_"]').first()).toBeVisible();
  });

  test('fresh A1 daily plan practices only concepts from lessons completed earlier today', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/daily');

    await expect(page.getByText('Study lesson 1 of 2', { exact: true })).toBeVisible();
    await expect(page.getByText('Study lesson 2 of 2', { exact: true })).toBeVisible();
    await completeNextLessonMission(page);
    await completeNextLessonMission(page);
    await skipGrammarLessonIfShown(page);

    await expect(page.getByRole('heading', { name: 'Grammar Practice' })).toBeVisible();
    await expect(page.getByText('You should study this lesson first:')).toHaveCount(0);
    const ids = await selectedDailyIds(page, 'grammar');
    expect(ids.length).toBeGreaterThan(0);
    const lessonIds = new Set(ids.map(id => (grammar.A1 || []).find(q => q.id === id)?.taughtInLessonId));
    expect([...lessonIds].every(id => ['A1_lesson_1', 'A1_lesson_2'].includes(id))).toBe(true);
  });

  test('completed A1 lesson review does not jump ahead to lesson 5 concepts', async ({ page }) => {
    await seed(page, {
      completedLessons: {
        A1: [
          { id: 'A1_lesson_1', completedAt: '2026-05-06T08:00:00.000Z' },
          { id: 'A1_lesson_2', completedAt: '2026-05-06T08:05:00.000Z' },
        ],
      },
    });
    await gotoPreview(page, '/level/A1/daily');

    await page.getByRole('button', { name: /Skip for now/i }).click();
    await page.getByRole('button', { name: /Skip for now/i }).click();
    await skipGrammarLessonIfShown(page);

    const ids = await selectedDailyIds(page, 'grammar');
    expect(ids.length).toBeGreaterThan(0);
    const lessonIds = new Set(ids.map(id => (grammar.A1 || []).find(q => q.id === id)?.taughtInLessonId));
    expect(lessonIds.has('A1_lesson_5')).toBe(false);
    expect([...lessonIds].every(id => ['A1_lesson_1', 'A1_lesson_2'].includes(id))).toBe(true);
  });

  test('vocabulary daily plan uses introduced lesson vocabulary before full-level vocabulary', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/level/A1/daily');

    await completeNextLessonMission(page);
    await completeNextLessonMission(page);
    await skipGrammarLessonIfShown(page);
    await answerGrammarMission(page);

    await expect(page.getByRole('heading', { name: 'Vocabulary Quiz' })).toBeVisible();
    const ids = await selectedDailyIds(page, 'vocab');
    expect(ids.length).toBeGreaterThan(0);
    const lessonIds = new Set(ids.map(id => (vocabulary.A1 || []).find(w => w.id === id)?.taughtInLessonId));
    expect([...lessonIds].every(id => ['A1_lesson_1', 'A1_lesson_2'].includes(id))).toBe(true);
  });

  test('aligned daily grammar uses available review instead of untaught fallback when the pool is short', async ({ page }) => {
    await seed(page, {
      completedLessons: {
        A1: [{ id: 'A1_lesson_2', completedAt: '2026-05-06T08:00:00.000Z' }],
      },
    });
    await gotoPreview(page, '/level/A1/daily');

    await page.getByRole('button', { name: /Skip for now/i }).click();
    await page.getByRole('button', { name: /Skip for now/i }).click();
    await skipGrammarLessonIfShown(page);

    const ids = await selectedDailyIds(page, 'grammar');
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.length).toBeLessThanOrEqual(6);
    const lessonIds = new Set(ids.map(id => (grammar.A1 || []).find(q => q.id === id)?.taughtInLessonId));
    expect([...lessonIds].every(id => id === 'A1_lesson_2')).toBe(true);
  });

  test('A1 coverage report documents reviewed pilot lessons and expansions', () => {
    const fs = require('fs');
    const report = fs.readFileSync('docs/A1_LESSON_QUESTION_COVERAGE_REPORT.md', 'utf8').toLowerCase();
    expect(report).toContain('a1_lesson_1');
    expect(report).toContain('a1_lesson_2');
    expect(report).toContain('linked questions reviewed');
    expect(report).toContain('lesson expansions made');
  });
});
