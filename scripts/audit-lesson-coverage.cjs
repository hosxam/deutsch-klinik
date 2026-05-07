const fs = require('fs');

const grammar = JSON.parse(fs.readFileSync('./src/data/grammar.json', 'utf8'));
const lessons = JSON.parse(fs.readFileSync('./src/data/germanLessons.json', 'utf8'));
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const orphaned = [];

for (const [level, exercises] of Object.entries(grammar)) {
  if (!Array.isArray(exercises)) continue;

  for (const exercise of exercises) {
    const references = [
      ['lessonId', exercise.lessonId],
      ['taughtInLessonId', exercise.taughtInLessonId],
      ['remediationLessonId', exercise.remediationLessonId],
      ...((exercise.prerequisiteLessonIds || []).map((id, index) => [`prerequisiteLessonIds[${index}]`, id])),
    ];

    for (const [field, lessonId] of references) {
      if (lessonId && !lessonIds.has(lessonId)) {
        orphaned.push({
          level,
          id: exercise.id,
          field,
          missing: lessonId,
          prompt: exercise.prompt,
        });
      }
    }
  }
}

fs.writeFileSync('./audit-lesson-gaps.json', JSON.stringify(orphaned, null, 2));
console.log(`${orphaned.length} exercises reference missing lessons. See audit-lesson-gaps.json`);

if (orphaned.length > 0) {
  process.exitCode = 1;
}
