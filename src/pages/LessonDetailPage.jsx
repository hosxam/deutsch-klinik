import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {  completeLesson, recordAnswer, getCompletedLessons } from '../utils/store';
import allLessonsData from '../data/germanLessons.json';
import {
  ArrowLeft, ArrowRight, CheckCircle, BookOpen, Check, X, Star, Lightbulb, ChevronRight, Award, ListChecks,
  RotateCcw, Sparkles, BookMarked, Headphones, MessageSquare, Pencil,
} from 'lucide-react';
import LevelLock from '../components/LevelLock';
import PronunciationGuide from '../components/PronunciationGuide';
import pronunciationGuides from '../data/pronunciationGuides.json';

const allLessons = allLessonsData;
const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

const CHECKLIST_ICONS = {
  explanation: Lightbulb,
  vocabulary: Star,
  grammar: BookOpen,
  examples: BookMarked,
  practice: Pencil,
  listening: Headphones,
  reading: BookMarked,
  writing: Pencil,
  speaking: MessageSquare,
};

function ChecklistItem({ icon: Icon, label, done, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '10px 12px', borderRadius: '8px', border: 'none',
        background: done ? 'rgba(59,255,158,0.08)' : 'var(--bg-hover)',
        color: done ? '#3bff9e' : 'var(--text-secondary)',
        cursor: onClick ? 'pointer' : 'default',
        fontSize: '13px', textAlign: 'left',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      {done
        ? <CheckCircle size={16} color="#3bff9e" />
        : <Icon size={16} style={{ opacity: 0.6 }} />
      }
      <span style={{ flex: 1 }}>{label}</span>
      {done && <span style={{ fontSize: '11px', color: '#3bff9e' }}>Done</span>}
    </button>
  );
}

function PracticeLink({ to, icon: Icon, label, sub, color }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
        backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)',
        textDecoration: 'none', border: '1px solid var(--border)',
        transition: 'background 0.15s',
      }}
    >
      <Icon size={16} style={{ color: color || 'var(--accent)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{sub}</div>}
      </div>
      <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </Link>
  );
}

export default function LessonDetailPage() {
  const { levelId, lessonId } = useParams();
  
  const lesson = allLessons.find(l => l.id === lessonId);
  const color = levelColors[levelId] || 'var(--accent)';

  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({});
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Checklist state - UI-only, tracks what user has interacted with
  const [checklist, setChecklist] = useState(() => {
    try {
      const raw = localStorage.getItem('dk_lesson_checklist_' + lessonId);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  const completed = getCompletedLessons(levelId);
  const isDone = completed.includes(lessonId);

  useEffect(() => {
    setUserAnswers({});
    setResults({});
    setShowReview(false);
    setLessonCompleted(isDone);
  }, [lessonId, isDone]);

  // Persist checklist
  useEffect(() => {
    try {
      localStorage.setItem('dk_lesson_checklist_' + lessonId, JSON.stringify(checklist));
    } catch { /* empty */ }
  }, [checklist, lessonId]);

  const levelLessons = useMemo(() =>
    allLessons.filter(l => l.level === levelId).sort((a, b) => {
      const numA = parseInt(a.id.match(/(\d+)$/)?.[1] || '0', 10);
      const numB = parseInt(b.id.match(/(\d+)$/)?.[1] || '0', 10);
      return numA - numB;
    }),
    [levelId]
  );
  const currentIdx = levelLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? levelLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < levelLessons.length - 1 ? levelLessons[currentIdx + 1] : null;

  const hasExercises = lesson?.guidedPractice?.length > 0;
  const allAttempted = hasExercises
    ? lesson.guidedPractice.every((_, i) => results[i] !== undefined)
    : true;
  const isAllCorrect = hasExercises
    ? lesson.guidedPractice.every((_, i) => results[i] === true)
    : false;

  const toggleChecklist = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecklistItems = (() => {
    let count = 0;
    if (lesson.explanation) count++;
    if (lesson.vocabulary?.length > 0) count++;
    if (lesson.grammarFocus) count++;
    if (lesson.examples?.length > 0) count++;
    if (lesson.guidedPractice?.length > 0) count++;
    return count;
  })();
  const doneChecklistItems = (() => {
    let count = 0;
    if (lesson.explanation && checklist.explanation) count++;
    if (lesson.vocabulary?.length > 0 && checklist.vocabulary) count++;
    if (lesson.grammarFocus && checklist.grammar) count++;
    if (lesson.examples?.length > 0 && checklist.examples) count++;
    if (lesson.guidedPractice?.length > 0 && checklist.practice) count++;
    return count;
  })();
  const checklistProgress = totalChecklistItems > 0 ? Math.round(doneChecklistItems / totalChecklistItems * 100) : 0;

  if (!lesson) {
    return (
      <LevelLock levelId={levelId}>
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0' }}>
        Lesson not found.
        <br />
        <Link to={`/level/${levelId}/lessons`} style={{ color: 'var(--accent)', fontSize: '14px' }}>
          Back to lessons
        </Link>
      </div>
      </LevelLock>
    );
  }

  const handleAnswer = (idx, answer) => {
    setUserAnswers(prev => ({ ...prev, [idx]: answer }));
  };

  const checkAnswer = (idx) => {
    const exercise = lesson.guidedPractice[idx];
    if (!exercise || !userAnswers[idx]) return;
    const isCorrect = userAnswers[idx].toLowerCase().trim() === exercise.answer.toLowerCase().trim();
    setResults(prev => ({ ...prev, [idx]: isCorrect }));
    recordAnswer(levelId, lessonId, exercise.answer, userAnswers[idx], 'guidedPractice');
    // Auto-check practice checklist item
    if (!checklist.practice) toggleChecklist('practice');
  };

  const handleComplete = () => {
    completeLesson(levelId, lesson.id);
    setLessonCompleted(true);
    setShowReview(true);
  };

  const handleReviewLesson = () => {
    setLessonCompleted(false);
    setShowReview(false);
    setUserAnswers({});
    setResults({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!lesson) return null;

  return (
    <LevelLock levelId={levelId}>
    <div>
      <Link
        to={`/level/${levelId}/lessons`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}
      >
        <ArrowLeft size={14} /> Back to Lessons
      </Link>

      {/* Header */}
      <div style={{
        borderRadius: '12px', padding: '20px 24px', marginBottom: '20px',
        background: `linear-gradient(135deg, ${color}15, transparent)`,
        border: `1px solid ${color}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
            backgroundColor: color + '20', color,
          }}>{levelId}</span>
          {lessonCompleted && (
            <span style={{
              fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px',
              color: '#3bff9e', background: 'rgba(59,255,158,0.1)', padding: '2px 8px',
              borderRadius: '4px', fontWeight: '600',
            }}>
              <CheckCircle size={12} /> Completed
            </span>
          )}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{lesson.objective}</p>
      </div>

      {/* Completed Banner */}
      {lessonCompleted && (
        <div style={{
          borderRadius: '12px', padding: '20px 24px', marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(59,255,158,0.12), rgba(59,255,158,0.04))',
          border: '1px solid rgba(59,255,158,0.3)',
          textAlign: 'center',
        }}>
          <Sparkles size={28} color="#3bff9e" style={{ marginBottom: '8px' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#3bff9e', marginBottom: '4px' }}>
            Lesson completed!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Great work on {lesson.title}. Here is what to do next.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={handleReviewLesson}
              style={{
                padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(59,255,158,0.3)',
                background: 'rgba(59,255,158,0.08)', color: '#3bff9e',
                cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}
            >
              <RotateCcw size={14} /> Review this lesson
            </button>
            {nextLesson && (
              <Link
                to={`/level/${levelId}/lessons/${nextLesson.id}`}
                style={{
                  padding: '9px 18px', borderRadius: '8px', border: 'none',
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                Next: {nextLesson.title} <ArrowRight size={14} />
              </Link>
            )}
            {!nextLesson && (
              <Link
                to={`/level/${levelId}/exam`}
                style={{
                  padding: '9px 18px', borderRadius: '8px', border: 'none',
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                Take {levelId} Exam <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Lesson Checklist */}
      <div style={{
        borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
        backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ListChecks size={15} /> Lesson Checklist
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {doneChecklistItems}/{totalChecklistItems}
          </span>
        </div>
        {totalChecklistItems > 0 && (
          <div style={{
            width: '100%', height: '4px', borderRadius: '2px',
            background: 'var(--bg-hover)', marginBottom: '10px', overflow: 'hidden',
          }}>
            <div style={{
              width: checklistProgress + '%', height: '100%',
              borderRadius: '2px', background: `linear-gradient(90deg, ${color}, #3bff9e)`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {lesson.explanation && (
            <ChecklistItem
              icon={CHECKLIST_ICONS.explanation} label="Read the explanation"
              done={checklist.explanation} color={color}
              onClick={() => {
                toggleChecklist('explanation');
                setTimeout(() => document.getElementById('section-explanation')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
              }}
            />
          )}
          {lesson.vocabulary?.length > 0 && (
            <ChecklistItem
              icon={CHECKLIST_ICONS.vocabulary} label="Study the vocabulary"
              done={checklist.vocabulary} color={color}
              onClick={() => toggleChecklist('vocabulary')}
            />
          )}
          {lesson.grammarFocus && (
            <ChecklistItem
              icon={CHECKLIST_ICONS.grammar} label="Review grammar focus"
              done={checklist.grammar} color={color}
              onClick={() => toggleChecklist('grammar')}
            />
          )}
          {lesson.examples?.length > 0 && (
            <ChecklistItem
              icon={CHECKLIST_ICONS.examples} label="Read the examples"
              done={checklist.examples} color={color}
              onClick={() => toggleChecklist('examples')}
            />
          )}
          {lesson.guidedPractice?.length > 0 && (
            <ChecklistItem
              icon={CHECKLIST_ICONS.practice} label="Complete guided practice"
              done={results !== undefined && hasExercises
                ? lesson.guidedPractice.every((_, i) => results[i] !== undefined)
                : checklist.practice}
              color={color}
              onClick={() => {
                if (!checklist.practice) toggleChecklist('practice');
                setTimeout(() => document.getElementById('section-guided-practice')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
              }}
            />
          )}
        </div>
      </div>

      {/* Explanation */}
      {lesson.explanation && (
        <div id="section-explanation" style={{
          borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} /> Explanation
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{lesson.explanation}</p>
        </div>
      )}

      {/* Examples */}
      {lesson.examples && lesson.examples.length > 0 && (
        <div id="section-examples" style={{
          borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>Examples</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {lesson.examples.map((ex, i) => (
              <li key={i} style={{
                padding: '8px 0', borderBottom: i < lesson.examples.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic',
              }}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Grammar Focus */}
      {lesson.grammarFocus && (
        <div id="section-grammar" style={{
          borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} /> Grammar Focus
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{lesson.grammarFocus}</p>
        </div>
      )}

      {/* Vocabulary */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <div id="section-vocabulary" style={{
          borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} /> Vocabulary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {lesson.vocabulary.map((v, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: '8px',
                backgroundColor: 'var(--bg-hover)', fontSize: '13px',
              }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{v.word}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{v.translation}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>{v.example}</div>
              </div>
            ))}
          </div>
          <Link
            to={`/level/${levelId}/vocabulary`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px',
              fontSize: '13px', color: 'var(--accent)', textDecoration: 'none',
            }}
          >
            Practice these words <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Guided Practice */}
      {lesson.guidedPractice && lesson.guidedPractice.length > 0 && (
        <div id="section-guided-practice" style={{
          borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '12px' }}>
            Guided Practice
          </h3>
          {lesson.guidedPractice.map((ex, idx) => (
            <div key={idx} style={{
              padding: '12px', marginBottom: '10px', borderRadius: '8px',
              backgroundColor: 'var(--bg-hover)',
              border: results[idx] !== undefined
                ? `1px solid ${results[idx] ? '#3bff9e' : '#ff3355'}40`
                : '1px solid transparent',
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                <strong>{idx + 1}.</strong> {ex.prompt}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={userAnswers[idx] || ''}
                  onChange={e => handleAnswer(idx, e.target.value)}
                  placeholder="Type your answer..."
                  disabled={results[idx] !== undefined}
                  style={{
                    flex: 1, minWidth: '150px', padding: '8px 12px', borderRadius: '6px',
                    border: '1px solid var(--border)', fontSize: '14px', outline: 'none',
                    backgroundColor: results[idx] !== undefined ? 'var(--bg-hover)' : 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                {results[idx] === undefined && (
                  <button
                    onClick={() => checkAnswer(idx)}
                    disabled={!userAnswers[idx]}
                    style={{
                      padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      backgroundColor: color, color: '#fff', fontSize: '13px', fontWeight: '600',
                      opacity: userAnswers[idx] ? 1 : 0.5,
                    }}
                  >
                    Check
                  </button>
                )}
              </div>
              {results[idx] !== undefined && (
                <div style={{
                  marginTop: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
                  color: results[idx] ? '#3bff9e' : '#ff3355',
                }}>
                  {results[idx] ? <Check size={14} /> : <X size={14} />}
                  {results[idx] ? 'Correct!' : `Correct answer: ${ex.answer}`}
                </div>
              )}
            </div>
          ))}
          {showReview && (
            <div style={{
              marginTop: '12px', padding: '12px', borderRadius: '8px',
              backgroundColor: isAllCorrect ? 'rgba(59,255,158,0.1)' : 'rgba(255,51,85,0.1)',
              border: `1px solid ${isAllCorrect ? '#3bff9e' : '#ff3355'}40`,
              color: isAllCorrect ? '#3bff9e' : '#ff3355',
              fontSize: '14px', fontWeight: '600',
            }}>
              {isAllCorrect
                ? 'All answers correct! Excellent work!'
                : 'Some answers need review. Check the correct answers above.'
              }
            </div>
          )}
        </div>
      )}

      {/* Review Summary */}
      {lesson.reviewSummary && (
        <div style={{
          borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} /> Review Summary
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{lesson.reviewSummary}</p>
        </div>
      )}

      {/* Complete Button */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px', marginBottom: '16px' }}>
        {!lessonCompleted && (
          <button
            onClick={handleComplete}
            disabled={!allAttempted}
            style={{
              padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: allAttempted ? 'pointer' : 'not-allowed',
              background: allAttempted ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'var(--bg-hover)',
              color: allAttempted ? '#fff' : 'var(--text-muted)',
              fontSize: '15px', fontWeight: '700',
              display: 'flex', alignItems: 'center', gap: '8px',
              opacity: allAttempted ? 1 : 0.6,
            }}
          >
            <CheckCircle size={18} />
            {allAttempted ? 'Mark Lesson Complete' : hasExercises ? 'Complete all exercises first' : 'Mark Lesson Complete'}
          </button>
        )}
        {lessonCompleted && (
          <div style={{
            padding: '12px 32px', borderRadius: '8px',
            backgroundColor: 'rgba(59,255,158,0.1)', border: '1px solid #3bff9e40',
            color: '#3bff9e', fontSize: '14px', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Award size={18} /> Lesson Completed!
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
        {prevLesson ? (
          <Link
            to={`/level/${levelId}/lessons/${prevLesson.id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              borderRadius: '8px', fontSize: '13px', fontWeight: '600',
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> {prevLesson.title}
          </Link>
        ) : <div />}
        {nextLesson && !lessonCompleted ? (
          <Link
            to={`/level/${levelId}/lessons/${nextLesson.id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              borderRadius: '8px', fontSize: '13px', fontWeight: '600',
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', textDecoration: 'none',
            }}
          >
            {nextLesson.title} <ArrowRight size={16} />
          </Link>
        ) : !nextLesson ? <div /> : null}
      </div>

      {/* Pronunciation Guide - A1/A2 only */}
      {(levelId === 'A1' || levelId === 'A2') && (
        <div className="mt-4 mb-2">
          <PronunciationGuide
            guide={pronunciationGuides[lessonId]}
            accentColor={color}
            fallbackText="Pronunciation guide coming soon for this lesson."
          />
        </div>
      )}

      {/* Continue practicing this lesson */}
      {levelId && (
        <div style={{
          borderRadius: '10px', padding: '16px 20px', marginTop: '20px', marginBottom: '16px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '12px' }}>
            {lessonCompleted ? 'Recommended next steps' : 'Continue practicing this lesson'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PracticeLink
              to={`/level/${levelId}/grammar`}
              icon={BookOpen} label="Practice Grammar"
              sub="Reinforce grammar concepts from this lesson"
              color={color}
            />
            <PracticeLink
              to={`/level/${levelId}/vocabulary`}
              icon={BookMarked} label="Review Flashcards"
              sub="Study vocabulary with spaced repetition"
              color={color}
            />
            <PracticeLink
              to={`/level/${levelId}/reading`}
              icon={BookOpen} label="Practice Reading"
              sub="Build comprehension with level-appropriate texts"
              color={color}
            />
            <PracticeLink
              to={`/level/${levelId}/listening`}
              icon={Headphones} label="Practice Listening"
              sub="Improve listening comprehension"
              color={color}
            />
            <PracticeLink
              to={`/level/${levelId}/writing`}
              icon={Pencil} label="Writing Practice"
              sub="Practice written expression"
              color={color}
            />
            <PracticeLink
              to={`/level/${levelId}/speaking`}
              icon={MessageSquare} label="Speaking Practice"
              sub="Practice spoken communication"
              color={color}
            />
          </div>
        </div>
      )}

      {/* Back to all lessons */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link
          to={`/level/${levelId}/lessons`}
          style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}
        >
          &larr; All Lessons for {levelId}
        </Link>
      </div>
    </div>
    </LevelLock>
  );
}
