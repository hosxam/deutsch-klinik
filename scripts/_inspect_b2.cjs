const l = require('../src/data/germanLessons.json');
const b2 = l.filter(x => x.level === 'B2');
console.log('B2 lessons count:', b2.length);
console.log('B2 lesson IDs:', b2.map(x => x.id).join(', '));
b2.forEach(x => {
  console.log(x.id + ': conceptId=' + x.conceptId +
    ' estimatedMinutes=' + x.estimatedMinutes +
    ' prereqs=' + JSON.stringify(x.prerequisiteConceptIds) +
    ' conceptsTaught=' + JSON.stringify(x.conceptsTaught) +
    ' miniDrills=' + (x.miniDrills || []).length +
    ' commonMistakes=' + (x.commonMistakes || []).length +
    ' formsTables=' + (x.formsTables || []).length +
    ' trackTags=' + JSON.stringify(x.trackTags) +
    ' version=' + x.lessonDepthVersion +
    ' examples=' + (x.examples || []).length +
    ' linkedQuestions=' + JSON.stringify(x.linkedQuestionIds)
  );
});
