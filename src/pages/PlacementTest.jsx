import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateState, getState } from '../utils/store';
import { setOnboardingState } from '../utils/onboardingState';
import { PageShell, Card, Button, Badge, ProgressRing, LevelBadge } from '../components/ui';

// ===== 6 Vocabulary Questions (mix A1-C1) =====
const vocabQuestions = [
  { level: 'A1', question: 'What is the German word for "doctor" (male)?', options: ['Der Doktor', 'Der Arzt', 'Der Fahrer', 'Der Lehrer'], answer: 'Der Arzt' },
  { level: 'A1', question: 'How do you say "good morning" in German?', options: ['Gute Nacht', 'Guten Morgen', 'Guten Tag', 'Hallo'], answer: 'Guten Morgen' },
  { level: 'A2', question: 'What is the German word for "hospital"?', options: ['Das Krankenhaus', 'Die Apotheke', 'Die Praxis', 'Das Hotel'], answer: 'Das Krankenhaus' },
  { level: 'B1', question: '"Die Besprechung" means:', options: ['The discussion', 'The meeting', 'The presentation', 'The appointment'], answer: 'The meeting' },
  { level: 'B2', question: '"Die Vereinbarung" best translates to:', options: ['The society', 'The agreement', 'The announcement', 'The invitation'], answer: 'The agreement' },
  { level: 'C1', question: '"Die Erörterung" means:', options: ['The exploration', 'The discussion/debate', 'The arrangement', 'The determination'], answer: 'The discussion/debate' },
];

// ===== 6 Grammar Questions =====
const grammarQuestions = [
  { level: 'A1', question: 'Which article is used with "Kind" (child)?', options: ['Der', 'Die', 'Das', 'Den'], answer: 'Das' },
  { level: 'A1', question: 'Ich ___ (to be) ein Student.', options: ['bin', 'bist', 'ist', 'sind'], answer: 'bin' },
  { level: 'A2', question: 'Ich habe ___ gearbeitet. Which auxiliary verb?', options: ['bin', 'habe', 'hat', 'hast'], answer: 'habe' },
  { level: 'A2', question: 'Ich helfe ___ Mann. (dative of der)', options: ['der', 'den', 'dem', 'des'], answer: 'dem' },
  { level: 'B1', question: '___ es regnet, gehe ich spazieren. (although)', options: ['Weil', 'Obwohl', 'Trotzdem', 'Denn'], answer: 'Obwohl' },
  { level: 'B2', question: '___ der fortschreitenden Digitalisierung mussen wir handeln. (in view of)', options: ['Trotz', 'Angesichts', 'Wegen', 'Wahrend'], answer: 'Angesichts' },
];

// ===== 6 Reading Comprehension Questions =====
const readingQuestions = [
  { level: 'A1', question: '"Der Mann trinkt Wasser." What does this mean?', options: ['The man eats bread', 'The man drinks water', 'The man reads a book', 'The man sleeps'], answer: 'The man drinks water' },
  { level: 'A1', question: '"Die Kinder spielen im Garten." Translation:', options: ['The children play in the garden', 'The children study at school', 'The children eat in the kitchen', 'The children sleep in the room'], answer: 'The children play in the garden' },
  { level: 'A2', question: '"Gestern bin ich ins Kino gegangen." Meaning:', options: ['Today I go to the cinema', 'Yesterday I went to the cinema', 'Tomorrow I will go to the cinema', 'I like going to the cinema'], answer: 'Yesterday I went to the cinema' },
  { level: 'B1', question: '"Obwohl er krank war, ist er zur Arbeit gegangen." Translation:', options: ['Because he was sick, he went to work', 'Although he was sick, he went to work', 'He was sick and went to work', 'He went to work and got sick'], answer: 'Although he was sick, he went to work' },
  { level: 'B2', question: '"Die Behörde hat die Genehmigung fur das Bauprojekt erteilt." Meaning:', options: ['The authority has rejected the building project', 'The authority has granted approval for the building project', 'The authority is reviewing the building project', 'The building project is on hold'], answer: 'The authority has granted approval for the building project' },
  { level: 'C1', question: '"In Anbetracht der aktuellen Entwicklung ist eine Neubewertung der Lage erforderlich." Translate:', options: ['The current development requires immediate action', 'A reassessment of the situation is necessary given the current development', 'The development is progressing as expected', 'The situation has been resolved'], answer: 'A reassessment of the situation is necessary given the current development' },
];

// ===== 6 Listening-script-based Questions =====
const listeningQuestions = [
  { level: 'A1', question: 'You hear: "Mein Name ist Anna. Ich komme aus Berlin." What does Anna say?', options: ['She is a doctor from Munich', 'Her name is Anna and she comes from Berlin', 'She is 25 years old', 'She works in a hospital'], answer: 'Her name is Anna and she comes from Berlin' },
  { level: 'A1', question: 'You hear: "Die Praxis hat montags bis freitags von 8 bis 12 Uhr geoffnet." When is the practice open?', options: ['Only on Mondays', 'Monday to Friday 8-12', 'Every day 8-12', 'Monday to Friday 8-5'], answer: 'Monday to Friday 8-12' },
  { level: 'A2', question: 'You hear: "Der Patient klagt uber starke Kopfschmerzen und Schwindel." What symptoms does the patient report?', options: ['Fever and cough', 'Stomach pain and nausea', 'Headaches and dizziness', 'Back pain and fatigue'], answer: 'Headaches and dizziness' },
  { level: 'B1', question: 'You hear: "Der Arzt empfiehlt, dreimal taglich eine Tablette nach dem Essen einzunehmen." What is the doctor\'s recommendation?', options: ['Take one pill before bed', 'Take a tablet three times daily after meals', 'Take two tablets in the morning', 'Take medicine only when in pain'], answer: 'Take a tablet three times daily after meals' },
  { level: 'B2', question: 'You hear: "Im Rahmen der klinischen Studie wurden die Probanden in zwei Gruppen eingeteilt und uber sechs Monate beobachtet." What happened in the study?', options: ['Patients were divided into two groups and observed for 6 months', 'The study was cancelled after 6 months', 'Only one group was observed', 'The study was done without dividing groups'], answer: 'Patients were divided into two groups and observed for 6 months' },
  { level: 'C1', question: 'You hear: "Die Diskussion entbrannte angesichts der kontroversen Ergebnisse der Langzeitstudie, deren Methodik von einigen Experten infrage gestellt wurde." What is the situation?', options: ['Everyone agreed with the study results', 'A debate arose about controversial long-term study results that some experts questioned', 'The study was quickly accepted without debate', 'The study methodology was perfect'], answer: 'A debate arose about controversial long-term study results that some experts questioned' },
];

// ===== 6 Self-Assessment Items =====
const selfAssessmentQuestions = [
  { level: null, question: 'How comfortable are you with basic German greetings and introductions?', options: ['Not at all', 'A little', 'Somewhat', 'Very comfortable'], answer: '', isSelfAssessment: true },
  { level: null, question: 'How well can you understand German grammar (cases, articles, sentence structure)?', options: ['Not at all', 'A little', 'Somewhat', 'Very well'], answer: '', isSelfAssessment: true },
  { level: null, question: 'How comfortable are you reading German texts (signs, short articles)?', options: ['Not at all', 'A little', 'Somewhat', 'Very comfortable'], answer: '', isSelfAssessment: true },
  { level: null, question: 'How well can you understand spoken German at normal speed?', options: ['Not at all', 'A little', 'Somewhat', 'Very well'], answer: '', isSelfAssessment: true },
  { level: null, question: 'How confident are you writing in German (emails, short texts)?', options: ['Not at all', 'A little', 'Somewhat', 'Very confident'], answer: '', isSelfAssessment: true },
  { level: null, question: 'How comfortable are you speaking German in conversations?', options: ['Not at all', 'A little', 'Somewhat', 'Very comfortable'], answer: '', isSelfAssessment: true },
];

const selfAssessmentScore = {
  'Not at all': 0,
  'A little': 1,
  'Somewhat': 2,
  'Very comfortable': 3,
  'Very well': 3,
  'Very confident': 3,
};

const allQuestions = [
  ...vocabQuestions,
  ...grammarQuestions,
  ...readingQuestions,
  ...listeningQuestions,
  ...selfAssessmentQuestions,
];

export default function PlacementTest() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const q = allQuestions[index];
  const isSelfAssessment = q?.isSelfAssessment;
  const progressPct = ((index + 1) / allQuestions.length) * 100;

  const handleAnswer = (ans) => {
    const newAnswers = { ...answers, [index]: ans };
    setAnswers(newAnswers);
    if (index < allQuestions.length - 1) {
      setIndex(index + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (ans) => {
    let levelScores = { A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 }, B1: { correct: 0, total: 0 }, B2: { correct: 0, total: 0 }, C1: { correct: 0, total: 0 } };

    const knowledgeQuestions = allQuestions.filter(q => !q.isSelfAssessment);
    knowledgeQuestions.forEach((q, i) => {
      const realIndex = allQuestions.indexOf(q);
      levelScores[q.level].total += 1;
      if (ans[realIndex] === q.answer) levelScores[q.level].correct += 1;
    });

    let selfSum = 0;
    let selfCount = 0;
    const saQuestions = allQuestions.filter(q => q.isSelfAssessment);
    saQuestions.forEach((q, i) => {
      const realIndex = allQuestions.indexOf(q);
      const selected = ans[realIndex];
      if (selected && selfAssessmentScore[selected] !== undefined) {
        selfSum += selfAssessmentScore[selected];
        selfCount++;
      }
    });
    const selfAvg = selfCount > 0 ? selfSum / selfCount : 0;

    let recommendedLevel = 'A1';
    for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      if (levelScores[lvl].total > 0 && (levelScores[lvl].correct / levelScores[lvl].total) >= 0.66) {
        recommendedLevel = lvl;
      }
    }

    if (selfAvg >= 3) {
      const lvlOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];
      const currentIdx = lvlOrder.indexOf(recommendedLevel);
      if (currentIdx < 4) {
        recommendedLevel = lvlOrder[currentIdx + 1];
      }
    } else if (selfAvg >= 2 && recommendedLevel === 'A1') {
      recommendedLevel = 'A2';
    }

    const state = getState();
    state.placementResult = recommendedLevel;
    state.startLevel = recommendedLevel;
    state.currentLevel = recommendedLevel;
    updateState(state);

    setOnboardingState({
      startLevel: recommendedLevel,
      targetLevel: recommendedLevel === 'C1' ? 'C1' : (['A1','A2','B1','B2','C1'][['A1','A2','B1','B2','C1'].indexOf(recommendedLevel) + 1] || 'C1'),
      onboardingStarted: true,
    });

    setResult({ recommendedLevel, scores: levelScores, selfAvg });
  };

  const handleContinue = () => {
    navigate('/goal-setup');
  };

  if (result) {
    const lvlOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const targetLevel = result.recommendedLevel === 'C1' ? 'C1' : (lvlOrder[lvlOrder.indexOf(result.recommendedLevel) + 1] || 'C1');

    return (
      <PageShell maxWidth="max-w-lg">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Placement Complete</h2>
          <p className="text-lg mb-2">
            Recommended Level: <LevelBadge level={result.recommendedLevel} size="lg" />
          </p>
          {result.selfAvg > 0 && (
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Self-assessment: {result.selfAvg.toFixed(1)}/3 average
            </p>
          )}
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Your suggested journey: <strong>{result.recommendedLevel}</strong> to <strong>{targetLevel}</strong>
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {Object.entries(result.scores).map(([lvl, s]) => {
            const passed = s.correct >= s.total * 0.66;
            return (
              <div key={lvl} className="flex items-center justify-between p-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>
                <LevelBadge level={lvl} size="sm" />
                <span style={{ color: passed ? '#3bff9e' : '#ff3355' }}>
                  {s.correct}/{s.total}
                </span>
              </div>
            );
          })}
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={handleContinue}>
          Set Your Study Goals
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            {isSelfAssessment ? 'Self-Assessment' : 'Placement Test'}
          </h2>
          {isSelfAssessment ? (
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Tell us about your comfort level with German. This helps us fine-tune your starting point.
            </p>
          ) : (
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Answer all {allQuestions.length} questions to find your recommended starting level.
            </p>
          )}
        </div>
        <ProgressRing pct={progressPct} size={56} strokeWidth={5} />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge label={`${index + 1}/${allQuestions.length}`} color="var(--accent)" />
        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${progressPct}%`,
            backgroundColor: 'var(--accent)',
          }} />
        </div>
      </div>

      <Card className="mb-6">
        {!isSelfAssessment && q.level && (
          <div className="mb-3">
            <LevelBadge level={q.level} size="sm" />
          </div>
        )}
        {isSelfAssessment && (
          <div className="mb-3">
            <Badge label="Self-Assessment" color="#8b5cf6" />
          </div>
        )}

        <p className="text-base mb-6">{q.question}</p>

        <div className="grid grid-cols-1 gap-2">
          {q.options.map(opt => (
            <Button
              key={opt}
              variant="secondary"
              className="w-full text-left"
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
