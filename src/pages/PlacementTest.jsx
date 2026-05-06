import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateState, getState } from '../utils/store';

const questions = [
  { level: 'A1', question: 'What is the German word for "doctor" (male)?', options: ['Der Doktor', 'Der Arzt', 'Der Fahrer', 'Der Lehrer'], answer: 'Der Arzt' },
  { level: 'A1', question: 'How do you say "good morning" in German?', options: ['Gute Nacht', 'Guten Morgen', 'Guten Tag', 'Hallo'], answer: 'Guten Morgen' },
  { level: 'A1', question: 'Which article is used with "Kind" (child)?', options: ['Der', 'Die', 'Das', 'Den'], answer: 'Das' },
  { level: 'A2', question: 'Ich habe ___ (have) gearbeitet. Which auxiliary verb?', options: ['bin', 'habe', 'hat', 'hast'], answer: 'habe' },
  { level: 'A2', question: 'Ich helfe ___ Mann. (dative of der)', options: ['der', 'den', 'dem', 'des'], answer: 'dem' },
  { level: 'B1', question: 'Correct connective: "___ es regnet, gehe ich spazieren." (although)', options: ['Weil', 'Obwohl', 'Trotzdem', 'Denn'], answer: 'Obwohl' },
  { level: 'B1', question: 'Der Mann, ___ hier arbeitet, ist Arzt. (who)', options: ['den', 'der', 'dem', 'dessen'], answer: 'der' },
  { level: 'B2', question: '___ der fortschreitenden Digitalisierung müssen wir handeln. (in view of)', options: ['Trotz', 'Angesichts', 'Wegen', 'Während'], answer: 'Angesichts' },
  { level: 'B2', question: 'Der ___ (zu behandeln) Patient wartet. (modal participle)', options: ['behandelnde', 'zu behandelnde', 'behandelte', 'behandelter'], answer: 'zu behandelnde' },
  { level: 'C1', question: 'Noun from "entscheiden": die ___', options: ['Entscheidung', 'Entscheiden', 'Entscheid', 'Entschlossenheit'], answer: 'Entscheidung' },
  { level: 'C1', question: 'Sie behauptet, sie ___ (Konjunktiv I: sein) die Beste.', options: ['ist', 'sei', 'war', 'wäre'], answer: 'sei' },
];



export default function PlacementTest() {
  
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const q = questions[index];

  const handleAnswer = (ans) => {
    const newAnswers = { ...answers, [index]: ans };
    setAnswers(newAnswers);
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (ans) => {
    let levelScores = { A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 }, B1: { correct: 0, total: 0 }, B2: { correct: 0, total: 0 }, C1: { correct: 0, total: 0 } };
    questions.forEach((q, i) => {
      levelScores[q.level].total += 1;
      if (ans[i] === q.answer) levelScores[q.level].correct += 1;
    });

    let recommendedLevel = 'A1';
    for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      if (levelScores[lvl].total > 0 && (levelScores[lvl].correct / levelScores[lvl].total) >= 0.66) {
        recommendedLevel = lvl;
      }
    }

    const state = getState();
    state.placementResult = recommendedLevel;
    state.currentLevel = recommendedLevel;
    updateState(state);
    setResult({ recommendedLevel, scores: levelScores });
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Placement Complete</h2>
        <p className="text-lg mb-6">Recommended Level: <strong style={{ color: 'var(--accent)' }}>{result.recommendedLevel}</strong></p>
        <div className="space-y-2 mb-6">
          {Object.entries(result.scores).map(([lvl, s]) => (
            <div key={lvl} className="flex justify-between p-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <span>{lvl}</span>
              <span style={{ color: s.correct >= s.total * 0.66 ? '#3bff9e' : '#ff3355' }}>{s.correct}/{s.total}</span>
            </div>
          ))}
        </div>
        <Link to={`/level/${result.recommendedLevel}`} className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Start at {result.recommendedLevel}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Placement Test</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{index + 1}/{questions.length}</p>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Testing: Level {q.level}</div>
        <p className="text-lg mb-6">{q.question}</p>
        <div className="grid grid-cols-1 gap-2">
          {q.options.map(opt => (
            <button key={opt} onClick={() => handleAnswer(opt)}
              className="text-left px-4 py-3 rounded-lg text-sm transition-all"
              style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
