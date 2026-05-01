import React, { useState } from 'react';
import { getReadinessScores, saveReadinessScores, updateStreak } from '../utils/store';
import { AlertTriangle, CheckCircle, Target, BookOpen, Mic, Pen, Headphones, Clock, Award, ChevronRight, ArrowLeft, RotateCcw } from 'lucide-react';

const readinessCategories = [
  {
    id: 'reading',
    icon: BookOpen,
    label: 'Lesen (Reading)',
    description: 'Understand complex texts, implicit meaning, text structure',
    questions: [
      { id: 'r1', text: 'I can understand long, complex factual and literary texts with different writing styles.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'r2', text: 'I can identify implicit meaning, tone, and author intent in German texts.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'r3', text: 'I can follow complex arguments and abstract reasoning in German newspaper articles.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'r4', text: 'I understand literary devices and rhetorical questions in German writing.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'r5', text: 'I can scan lengthy texts (10+ pages) efficiently to find relevant information.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
  {
    id: 'listening',
    icon: Headphones,
    label: 'Hören (Listening)',
    description: 'Follow lectures, interviews, discussions, implicit content',
    questions: [
      { id: 'l1', text: 'I can follow extended speech on complex and abstract topics in German.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'l2', text: 'I can understand TV news, documentaries, and live interviews without much effort.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'l3', text: 'I can identify speaker attitudes, implied criticism, and emotional undertones.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'l4', text: 'I can follow academic lectures and complex discussions with multiple speakers.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'l5', text: 'I understand regional dialects and colloquial expressions in spoken German.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
  {
    id: 'writing',
    icon: Pen,
    label: 'Schreiben (Writing)',
    description: 'Opinion texts, formal messages, structured arguments',
    questions: [
      { id: 'w1', text: 'I can write clear, well-structured texts on complex topics expressing my viewpoint.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'w2', text: 'I can write formal letters and emails using appropriate register and conventions.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'w3', text: 'I can write essays with a clear introduction, argument development, and conclusion.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'w4', text: 'I can write summaries of complex texts, capturing main points and nuances.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'w5', text: 'I can use a wide range of connectors and transition words naturally in writing.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
  {
    id: 'speaking',
    icon: Mic,
    label: 'Sprechen (Speaking)',
    description: 'Fluency, debate, defending opinions, complex topics',
    questions: [
      { id: 's1', text: 'I can present detailed descriptions on complex topics with a clear structure.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 's2', text: 'I can express myself fluently and spontaneously without much searching for words.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 's3', text: 'I can defend my opinions in a debate with well-structured arguments.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 's4', text: 'I can use idiomatic expressions and colloquial phrases appropriately.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 's5', text: 'I can handle difficult questions and react appropriately in formal discussions.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
  {
    id: 'grammar',
    icon: AlertTriangle,
    label: 'Grammatik (Grammar)',
    description: 'C1 connectors, subjunctive, passive, avoiding common errors',
    questions: [
      { id: 'g1', text: 'I use Konjunktiv II and würde-forms naturally for hypothetical situations.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'g2', text: 'I use complex sentence structures with subordinating conjunctions (obwohl, indem, sodass, etc.).', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'g3', text: 'I use the passive voice (Vorgangspassiv and Zustandspassiv) correctly in different tenses.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'g4', text: 'I avoid common A1-B1 errors (wrong article, wrong preposition case, incorrect verb position).', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'g5', text: 'I can use nominalization and extended participial phrases correctly.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
  {
    id: 'vocabulary',
    icon: Target,
    label: 'Wortschatz (Vocabulary)',
    description: 'Formal register, academic vocabulary, idiomatic expressions',
    questions: [
      { id: 'v1', text: 'I have a broad active vocabulary covering academic and professional topics.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'v2', text: 'I can express myself using synonyms and avoid repetition in speech and writing.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'v3', text: 'I understand and use German idioms, proverbs, and fixed expressions.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'v4', text: 'I can use formal register vocabulary (Behörde, Erörterung, Abhandlung, etc.) appropriately.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 'v5', text: 'I understand and use German compound words and can create new ones correctly.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
  {
    id: 'timeManagement',
    icon: Clock,
    label: 'Zeitmanagement (Time Management)',
    description: 'Exam pacing, efficient answering, stress management',
    questions: [
      { id: 't1', text: 'I can write a 250+ word essay within the Goethe C1 exam time limit (60-70 min).', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 't2', text: 'I can complete reading comprehension tasks with time to review answers.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 't3', text: 'I can manage anxiety and maintain focus during timed exam conditions.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 't4', text: 'I can allocate time optimally between different sections of a German exam.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
      { id: 't5', text: 'I can complete listening comprehension tasks while taking effective notes.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    ],
  },
];

const scoreToRating = (score) => {
  if (score >= 85) return { label: 'Exzellent', color: '#22c55e', icon: Award };
  if (score >= 70) return { label: 'Gut', color: '#3b82f6', icon: CheckCircle };
  if (score >= 50) return { label: 'Ausreichend', color: '#eab308', icon: Target };
  return { label: 'Verbesserungsbedürftig', color: '#ef4444', icon: AlertTriangle };
};

const recommendedActions = (categoryId, score) => {
  const actions = {
    reading: [
      'Read one German newspaper article daily (FAZ, SZ, or Spiegel Online)',
      'Practice identifying author intent and tone in opinion pieces',
      'Summarize each paragraph in your own words',
      'Focus on texts about politics, science, and culture',
    ],
    listening: [
      'Listen to Deutsche Welle Langsam gesprochene Nachrichten daily',
      'Watch German documentaries (ZDF, ARTE) with German subtitles',
      'Practice listening to interview podcasts with multiple speakers',
      'Focus on regional dialects via German YouTube channels',
    ],
    writing: [
      'Write one 250-word essay weekly on a current events topic',
      'Practice formal email writing (Beschwerde, Bewerbung, Anfrage)',
      'Learn 5 new transition words and use them in context',
      'Study sample Goethe C1 writing tasks and model answers',
    ],
    speaking: [
      'Practice speaking daily for 5 minutes on a random topic',
      'Record yourself presenting and analyze for fluency',
      'Find a language partner on Tandem or HelloTalk for debates',
      'Learn 10 idiomatic expressions and practice using them',
    ],
    grammar: [
      'Review Konjunktiv II using modal verbs (könnte, sollte, müsste)',
      'Practice passive voice in all tenses with online exercises',
      'Master zwei-/drittgliedrige Konnektoren (obwohl, sodass, indem, ohne dass)',
      'Write 5 complex sentences daily using subordinating conjunctions',
    ],
    vocabulary: [
      'Create flashcards for 10 new academic words daily',
      'Read Fachartikel in your area of interest and note new vocabulary',
      'Practice using synonyms for common words (machen → durchführen, erstellen, anfertigen)',
      'Learn German prefixes and their meanings to decode new words',
    ],
    timeManagement: [
      'Practice timed writing (250 words in 60 minutes) twice a week',
      'Take full mock exams under real conditions',
      'Develop a personal timing strategy for each section',
      'Practice note-taking during listening exercises',
    ],
  };
  if (score >= 70) return actions[categoryId].slice(0, 2);
  return actions[categoryId];
};

const goetheChecklist = [
  { area: 'Leseverstehen (Reading)', items: [
    'Long texts with multiple perspectives',
    'Implicit meaning and author intent',
    'Text structure and coherence',
    'Detailed comprehension of complex arguments',
  ]},
  { area: 'Hörverstehen (Listening)', items: [
    'Interviews and discussions',
    'Academic lectures and presentations',
    'Implicit attitudes and opinions',
    'Distinguishing fact from opinion',
  ]},
  { area: 'Schriftlicher Ausdruck (Writing)', items: [
    'Formal letter (Beschwerde, Bewerbung)',
    'Opinion essay with argumentation',
    'Coherence and cohesion',
    'Register and style appropriateness',
  ]},
  { area: 'Mündlicher Ausdruck (Speaking)', items: [
    'Structured presentation',
    'Discussion and debate',
    'Reacting to counter-arguments',
    'Fluency and natural expression',
  ]},
];

export default function C1ReadinessPage() {
  const [step, setStep] = useState('intro');
  const [currentCat, setCurrentCat] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(getReadinessScores());
  const [showChecklist, setShowChecklist] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateCatScore = (catId) => {
    const cat = readinessCategories.find(c => c.id === catId);
    if (!cat) return 0;
    const catAnswers = cat.questions.map(q => answers[q.id]);
    const valid = catAnswers.filter(a => a !== undefined);
    if (valid.length === 0) return 0;
    const totalPoints = valid.reduce((sum, a) => {
      const idx = cat.questions[0].options.indexOf(a);
      return sum + (idx + 1);
    }, 0);
    return Math.round((totalPoints / (valid.length * 5)) * 100);
  };

  const handleComplete = () => {
    const newScores = {};
    readinessCategories.forEach(cat => {
      newScores[cat.id] = calculateCatScore(cat.id);
    });
    saveReadinessScores(newScores);
    setScores(getReadinessScores());
    updateStreak();
    setStep('results');
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentCat(0);
    setStep('intro');
  };

  const progress = readinessCategories.reduce((sum, cat) => {
    return sum + cat.questions.filter(q => answers[q.id] !== undefined).length;
  }, 0);
  const totalQuestions = readinessCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  // Styles
  const s = {
    page: { minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' },
    card: { background: 'var(--bg-card)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border)', marginBottom: '1.5rem' },
    btnPrimary: { background: 'var(--accent)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' },
    btnSecondary: { background: 'transparent', color: 'var(--text-primary)', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' },
    input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.75rem' },
    progressBar: { height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' },
    progressFill: { height: '100%', background: 'var(--accent)', borderRadius: '4px', transition: 'width 0.3s ease' },
    meter: { height: '12px', background: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden', flex: 1 },
    meterFill: (score) => ({ height: '100%', background: score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444', borderRadius: '6px', width: `${score}%`, transition: 'width 0.5s ease' }),
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' },
    flexRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
    tag: (bg) => ({ background: bg || 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', color: 'var(--text-secondary)' }),
    optionBtn: (selected) => ({
      padding: '0.6rem 1rem', borderRadius: '8px', border: selected ? '2px solid var(--accent)' : '1px solid var(--border)',
      background: selected ? 'rgba(0, 240, 255, 0.1)' : 'var(--bg-secondary)', color: 'var(--text-primary)',
      cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', width: '100%', transition: 'all 0.2s',
    }),
  };

  // Section component
  const Section = ({ title, children, icon }) => (
    <div style={s.card}>
      <div style={s.flexRow}>
        {icon && React.cloneElement(icon, { size: 20, color: 'var(--accent)' })}
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
      </div>
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </div>
  );

  if (step === 'intro') {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <Section title="C1-Prüfungsbereitschaft (Readiness Check)" icon={<Award size={24} />}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Diese Selbsteinschätzung hilft dir, deine Bereitschaft für die Goethe C1-Prüfung zu bewerten.
              Beantworte ehrlich 35 Fragen in 7 Kategorien. Am Ende erhältst du eine detaillierte Analyse
              mit Empfehlungen.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', margin: '1.5rem 0' }}>
              {readinessCategories.map(cat => (
                <div key={cat.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <cat.icon size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.questions.length} Fragen</div>
                </div>
              ))}
            </div>

            {scores.completed && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={s.flexRow}><Award size={18} color="var(--accent)" /><span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Vorheriges Ergebnis: {scores.overall}% Gesamtbewertung</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Zuletzt aktualisiert: {new Date(scores.lastUpdated).toLocaleDateString()}</div>
              </div>
            )}

            <button style={s.btnPrimary} onClick={() => setStep('assessment')}>
              {scores.completed ? 'Assessment wiederholen' : 'Assessment starten'}
            </button>
          </Section>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    const cat = readinessCategories[currentCat];
    const catScore = calculateCatScore(cat.id);

    const canProceed = cat.questions.every(q => answers[q.id] !== undefined);

    return (
      <div style={s.page}>
        <div style={s.container}>
          {/* Progress bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Frage {progress + 1} von {totalQuestions}</span>
              <span>{Math.round((progress / totalQuestions) * 100)}%</span>
            </div>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${(progress / totalQuestions) * 100}%` }} />
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {readinessCategories.map((c, idx) => (
              <button key={c.id} style={{
                ...s.tag(c.id === cat.id ? 'var(--accent)' : 'var(--bg-secondary)'),
                color: c.id === cat.id ? '#000' : 'var(--text-primary)',
                fontWeight: c.id === cat.id ? 600 : 400,
                cursor: 'pointer', border: 'none',
              }} onClick={() => setCurrentCat(idx)}>
                {c.label.split(' (')[0]}
              </button>
            ))}
          </div>

          <div style={s.card}>
            <div style={s.flexRow}>
              <cat.icon size={20} color="var(--accent)" />
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{cat.label}</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>{cat.description}</p>
            
            <div style={{ marginTop: '1.5rem' }}>
              {cat.questions.map((q, qIdx) => (
                <div key={q.id} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {qIdx + 1}. {q.text}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.4rem' }}>
                    {q.options.map(opt => (
                      <button key={opt} style={s.optionBtn(answers[q.id] === opt)} onClick={() => handleAnswer(q.id, opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Live score */}
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={s.flexRow}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kategorie-Score:</span>
                <span style={{ fontWeight: 700, color: catScore >= 70 ? '#22c55e' : catScore >= 50 ? '#eab308' : '#ef4444' }}>{catScore}%</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={s.btnSecondary} onClick={() => { if (currentCat > 0) setCurrentCat(prev => prev - 1); else setStep('intro'); }}>
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Zurück
            </button>
            
            {currentCat < readinessCategories.length - 1 ? (
              <button style={{ ...s.btnPrimary, opacity: canProceed ? 1 : 0.5 }} disabled={!canProceed} onClick={() => { if (canProceed) setCurrentCat(prev => prev + 1); }}>
                Weiter <ChevronRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            ) : (
              <button style={{ ...s.btnPrimary, opacity: canProceed ? 1 : 0.5 }} disabled={!canProceed} onClick={handleComplete}>
                Ergebnisse anzeigen
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    if (!scores || !scores.completed) return null;
    const rating = scoreToRating(scores.overall);

    // Sort categories by score for weakness report
    const sortedCats = [...readinessCategories].sort((a, b) => scores[a.id] - scores[b.id]);

    return (
      <div style={s.page}>
        <div style={s.container}>
          {/* Overall Score */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Gesamtbewertung (Overall Readiness)</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: rating.color }}>{scores.overall}%</div>
            <div style={s.flexRow}><rating.icon size={18} color={rating.color} /><span style={{ color: rating.color, fontWeight: 600 }}>{rating.label}</span></div>
          </div>

          {/* Category Scores */}
          <Section title="Kategorienergebnisse" icon={<Award size={20} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {readinessCategories.map(cat => {
                const score = scores[cat.id] || 0;
                const catRating = scoreToRating(score);
                return (
                  <div key={cat.id}>
                    <div style={s.flexRow}>
                      <cat.icon size={16} color="var(--accent)" />
                      <span style={{ fontSize: '0.9rem', flex: 1 }}>{cat.label}</span>
                      <span style={{ fontWeight: 700, color: catRating.color, fontSize: '0.9rem' }}>{score}%</span>
                    </div>
                    <div style={{ ...s.meter, marginTop: '0.3rem' }}>
                      <div style={s.meterFill(score)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Weakness Report */}
          <Section title="Schwächenanalyse (Weakness Report)" icon={<AlertTriangle size={20} />}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 0 }}>
              Diese Bereiche benötigen die meiste Aufmerksamkeit:
            </p>
            {sortedCats.filter(c => (scores[c.id] || 0) < 70).map(cat => {
              const score = scores[cat.id] || 0;
              return (
                <div key={cat.id} style={{ background: score < 50 ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', border: `1px solid ${score < 50 ? '#ef4444' : '#eab308'}` }}>
                  <div style={s.flexRow}>
                    <cat.icon size={16} color={score < 50 ? '#ef4444' : '#eab308'} />
                    <strong style={{ fontSize: '0.95rem' }}>{cat.label} — {score}%</strong>
                    <span style={{ fontSize: '0.8rem', color: score < 50 ? '#ef4444' : '#eab308', fontWeight: 600 }}>
                      {score < 50 ? 'Dringend' : 'Verbesserung nötig'}
                    </span>
                  </div>
                  <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.8 }}>
                    {recommendedActions(cat.id, score).map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {sortedCats.filter(c => (scores[c.id] || 0) >= 70).length === readinessCategories.length && (
              <div style={{ color: '#22c55e', fontWeight: 500, padding: '1rem', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', border: '1px solid #22c55e' }}>
                Keine nennenswerten Schwächen! Du bist bereit für die C1-Prüfung.
              </div>
            )}
          </Section>

          {/* Recommended Actions */}
          <Section title="Nächste Schritte (Recommended Actions)" icon={<Target size={20} />}>
            <div style={s.grid2}>
              {sortedCats.slice(0, 4).map(cat => {
                const score = scores[cat.id] || 0;
                return (
                  <div key={cat.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={s.flexRow}>
                      <cat.icon size={16} color="var(--accent)" />
                      <strong style={{ fontSize: '0.85rem' }}>{cat.label}</strong>
                    </div>
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {recommendedActions(cat.id, score).slice(0, 2).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Goethe C1 Checklist */}
          <Section title="Goethe C1 Prüfungs-Checkliste" icon={<BookOpen size={20} />}>
            <button style={s.btnSecondary} onClick={() => setShowChecklist(!showChecklist)}>
              {showChecklist ? 'Checkliste ausblenden' : 'Checkliste anzeigen'}
            </button>
            {showChecklist && (
              <div style={s.grid2}>
                {goetheChecklist.map(section => (
                  <div key={section.area} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: 'var(--accent)' }}>{section.area}</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 2, color: 'var(--text-secondary)' }}>
                      {section.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button style={s.btnSecondary} onClick={handleRetake}>
              <RotateCcw size={16} style={{ marginRight: '0.5rem' }} /> Assessment wiederholen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
