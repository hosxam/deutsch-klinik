import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, completeLesson, recordAnswer, getCompletedLessons } from '../utils/store';
import allLessonsData from '../data/germanLessons.json';
import {
  ArrowLeft, ArrowRight, CheckCircle, Circle, BookOpen, Check, X,
  Volume2, Star, Lightbulb, ChevronRight, Award,
} from 'lucide-react';
import LevelLock from '../components/LevelLock';
import PronunciationGuide from '../components/PronunciationGuide';
import pronunciationGuides from '../data/pronunciationGuides.json' assert { type: 'json' };

const allLessons = allLessonsData;
const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

export default function LessonDetailPage() {
  const { levelId, lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = allLessons.find(l => l.id === lessonId);
  const color = levelColors[levelId] || 'var(--accent)';

  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({});
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const completed = getCompletedLessons(levelId);
  const isDone = completed.includes(lessonId);

  useEffect(() => {
    setUserAnswers({});
    setResults({});
    setShowReview(false);
    setLessonCompleted(isDone);
  }, [lessonId, isDone]);

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

  const levelLessons = allLessons.filter(l => l.level === levelId).sort((a, b) => a.id.localeCompare(b.id));
  const currentIdx = levelLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? levelLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < levelLessons.length - 1 ? levelLessons[currentIdx + 1] : null;

  const handleAnswer = (idx, answer) => {
    setUserAnswers(prev => ({ ...prev, [idx]: answer }));
  };

  const checkAnswer = (idx) => {
    const exercise = lesson.guidedPractice[idx];
    if (!exercise || !userAnswers[idx]) return;
    const isCorrect = userAnswers[idx].toLowerCase().trim() === exercise.answer.toLowerCase().trim();
    setResults(prev => ({ ...prev, [idx]: isCorrect }));
    recordAnswer(levelId, lessonId, exercise.answer, userAnswers[idx], 'guidedPractice');
  };

  const handleComplete = () => {
    completeLesson(levelId, lesson.id);
    setLessonCompleted(true);
    setShowReview(true);
  };

  const isAllCorrect = lesson.guidedPractice
    ? lesson.guidedPractice.every((_, i) => results[i] === true)
    : false;

  // Check if all exercises attempted
  const allAttempted = lesson.guidedPractice
    ? lesson.guidedPractice.every((_, i) => results[i] !== undefined)
    : true;

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
          {isDone && (
            <span style={{ fontSize: '11px', color }}>✓ Completed</span>
          )}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{lesson.objective}</p>
      </div>

      {/* Explanation */}
      {lesson.explanation && (
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        </div>
      )}

      {/* Guided Practice */}
      {lesson.guidedPractice && lesson.guidedPractice.length > 0 && (
        <div style={{
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
            style={{
              padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              color: '#fff', fontSize: '15px', fontWeight: '700',
              display: 'flex', alignItems: 'center', gap: '8px',
              opacity: allAttempted ? 1 : 0.6,
            }}
            disabled={!allAttempted}
          >
            <CheckCircle size={18} />
            {allAttempted ? 'Mark Lesson Complete' : 'Complete all exercises first'}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '8px' }}>
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
        {nextLesson ? (
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
        ) : <div />}
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
            Continue practicing this lesson
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              to={`/level/${levelId}/grammar`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', textDecoration: 'none',
              }}
            >
              Practice Grammar <ArrowRight size={16} />
            </Link>
            <Link
              to={`/level/${levelId}/vocabulary`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', textDecoration: 'none',
              }}
            >
              Review Flashcards <ArrowRight size={16} />
            </Link>
            <Link
              to={`/level/${levelId}/reading`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', textDecoration: 'none',
              }}
            >
              Practice Reading <ArrowRight size={16} />
            </Link>
            <Link
              to={`/level/${levelId}/listening`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', textDecoration: 'none',
              }}
            >
              Practice Listening <ArrowRight size={16} />
            </Link>
            <Link
              to={`/level/${levelId}/writing`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', textDecoration: 'none',
              }}
            >
              Writing Practice <ArrowRight size={16} />
            </Link>
            <Link
              to={`/level/${levelId}/speaking`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', textDecoration: 'none',
              }}
            >
              Speaking Practice <ArrowRight size={16} />
            </Link>
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
