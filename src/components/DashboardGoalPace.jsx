import { useState, useEffect, useMemo } from 'react';
import { getState, getCompletedLessons } from '../utils/store';
import { getStudyGoal, saveStudyGoal, clearStudyGoal } from './StudyGoalTracker';
import dashboardSummary from '../data/dashboardSummary.json';
import { Target, Calendar, Clock, AlertTriangle, Save, RotateCcw, X } from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getTodayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getDaysBetween(a, b) {
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  return diff;
}

function getCumulativeCounts(upToLevel) {
  const idx = LEVEL_ORDER[upToLevel];
  if (idx === undefined) return { lessons: 0, vocab: 0, grammar: 0 };

  let lessons = 0;
  let vocab = 0;
  let grammar = 0;

  for (let i = 0; i <= idx; i++) {
    const lvl = LEVELS[i];
    lessons += dashboardSummary.lessonCounts?.[lvl] || 25;
    vocab += dashboardSummary.vocabCounts?.[lvl] || 0;
    grammar += dashboardSummary.grammarCounts?.[lvl] || 0;
  }

  return { lessons, vocab, grammar };
}

function getCurrentCumulativeCompleted(state, upToLevel) {
  const idx = LEVEL_ORDER[upToLevel];
  if (idx === undefined) return { lessons: 0, vocab: 0, grammar: 0 };

  let lessons = 0;
  let vocab = 0;
  let grammar = 0;

  for (let i = 0; i <= idx; i++) {
    const lvl = LEVELS[i];
    lessons += getCompletedLessons(lvl).length;
    const prog = state.levels?.[lvl] || {};
    vocab += Array.isArray(prog.vocab) ? prog.vocab.length : 0;
    grammar += Array.isArray(prog.grammar) ? prog.grammar.length : 0;
  }

  return { lessons, vocab, grammar };
}

export default function DashboardGoalPace() {
  const [state, setState] = useState(null);
  const [goal, setGoal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ targetLevel: 'B2', targetDate: '' });

  useEffect(() => {
    setState(getState());
    const saved = getStudyGoal();
    if (saved && saved.targetLevel !== 'Medical FSP') {
      setGoal(saved);
      setForm({ targetLevel: saved.targetLevel || 'B2', targetDate: saved.targetDate || '' });
    }
  }, []);

  const paceData = useMemo(() => {
    if (!goal || !goal.targetDate || !goal.targetLevel || goal.targetLevel === 'Medical FSP') return null;
    if (!state) return null;

    const targetLevel = goal.targetLevel;
    const targetDate = goal.targetDate;
    const currentLevel = state.currentLevel || 'A1';

    const targetTotal = getCumulativeCounts(targetLevel);
    const completed = getCurrentCumulativeCompleted(state, targetLevel);

    const today = parseLocalDate(getTodayStr());
    const target = parseLocalDate(targetDate);
    const daysRemaining = getDaysBetween(today, target);
    const totalDays = getDaysBetween(parseLocalDate(targetDate), target);
    const daysElapsed = totalDays - daysRemaining;
    const elapsedDays = Math.max(1, daysElapsed);

    const lessonsRemaining = Math.max(0, targetTotal.lessons - completed.lessons);
    const vocabRemaining = Math.max(0, targetTotal.vocab - completed.vocab);
    const grammarRemaining = Math.max(0, targetTotal.grammar - completed.grammar);

    const lessonsPerDay = daysRemaining > 0 ? (lessonsRemaining / daysRemaining) : 0;
    const vocabPerDay = daysRemaining > 0 ? (vocabRemaining / daysRemaining) : 0;
    const grammarPerDay = daysRemaining > 0 ? (grammarRemaining / daysRemaining) : 0;

    // Current pace: what we've actually done per elapsed day
    const lessonsPace = completed.lessons / elapsedDays;
    const vocabPace = completed.vocab / elapsedDays;
    const grammarPace = completed.grammar / elapsedDays;

    return {
      targetLevel,
      targetDate,
      daysRemaining,
      currentLevel,
      completed,
      targetTotal,
      lessonsRemaining,
      vocabRemaining,
      grammarRemaining,
      lessonsPerDay: Math.round(lessonsPerDay * 10) / 10,
      vocabPerDay: Math.round(vocabPerDay * 10) / 10,
      grammarPerDay: Math.round(grammarPerDay * 10) / 10,
      lessonsPace: Math.round(lessonsPace * 10) / 10,
      vocabPace: Math.round(vocabPace * 10) / 10,
      grammarPace: Math.round(grammarPace * 10) / 10,
      totalDays: Math.max(1, totalDays),
      elapsedDays,
    };
  }, [goal, state]);

  const isOverdue = paceData && paceData.daysRemaining < 0;
  const isToday = paceData && paceData.daysRemaining === 0;

  const handleSaveGoal = () => {
    if (!form.targetDate) return;
    const newGoal = { targetLevel: form.targetLevel, targetDate: form.targetDate, dailyMinutes: goal?.dailyMinutes || 30 };
    saveStudyGoal(newGoal);
    setGoal(newGoal);
    setEditing(false);
    setState(getState());
  };

  const handleClearGoal = () => {
    clearStudyGoal();
    setGoal(null);
    setEditing(false);
    setForm({ targetLevel: 'B2', targetDate: '' });
  };

  const handleEdit = () => {
    if (goal) {
      setForm({ targetLevel: goal.targetLevel, targetDate: goal.targetDate || '' });
    }
    setEditing(true);
  };

  return (
    <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
        <Target size={18} /> Goal Pace Tracker
      </h2>

      {!goal && !editing ? (
        <div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Set a target date to track your German progress.
          </p>
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
          >
            Set Goal
          </button>
        </div>
      ) : editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Target Level</label>
            <select
              value={form.targetLevel}
              onChange={(e) => setForm({ ...form, targetLevel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-hover)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              {LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Target Exam Date</label>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--bg-hover)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveGoal}
              disabled={!form.targetDate}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
              style={{ backgroundColor: 'var(--accent)', color: '#000' }}
            >
              <Save size={14} /> Save Goal
            </button>
            {goal && (
              <button
                onClick={handleClearGoal}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'rgba(255,51,85,0.15)', color: '#ff3355', border: '1px solid rgba(255,51,85,0.3)' }}
              >
                <X size={14} /> Clear Goal
              </button>
            )}
          </div>
          {!goal && (
            <button
              onClick={() => setEditing(false)}
              className="w-full py-1.5 rounded-lg text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          )}
        </div>
      ) : paceData ? (
        <div className="space-y-3">
          {/* Overdue warning */}
          {(isOverdue || isToday) && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg text-xs"
              style={{
                backgroundColor: 'rgba(255,51,85,0.08)',
                border: '1px solid rgba(255,51,85,0.25)',
                color: isOverdue ? '#ff3355' : '#ffd700',
              }}
            >
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <div>
                <strong>{isOverdue ? 'Target date has passed!' : 'Target date is today!'}</strong>
                {isOverdue && (
                  <span className="block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    You have {Math.abs(paceData.daysRemaining)} day(s) overdue. {paceData.lessonsRemaining > 0 ? `Still need ${paceData.lessonsRemaining} lessons.` : ''}
                  </span>
                )}
                {isToday && (
                  <span className="block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {paceData.lessonsRemaining > 0 || paceData.vocabRemaining > 0 || paceData.grammarRemaining > 0
                      ? `${paceData.lessonsRemaining} lessons, ${paceData.vocabRemaining} vocab, ${paceData.grammarRemaining} grammar remaining.`
                      : 'Great, everything is done!'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Goal summary grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <MetricBox label="Plan" value={goal.planType === 'full' ? 'Full Mastery' : 'Exam Unlock'} color="#8b5cf6" />
            <MetricBox label="Target Level" value={paceData.targetLevel} color={levelColors[paceData.targetLevel] || 'var(--accent)'} />
            <MetricBox label="Current Level" value={paceData.currentLevel} color={levelColors[paceData.currentLevel] || 'var(--accent)'} />
            <MetricBox label="Target Date" value={paceData.targetDate} color="var(--accent)" />
            <MetricBox
              label="Days Remaining"
              value={isOverdue ? 'Overdue' : `${paceData.daysRemaining}`}
              color={isOverdue ? '#ff3355' : paceData.daysRemaining <= 7 ? '#ffd700' : '#3bff9e'}
            />
          </div>

          {/* Daily mission limits & pace label */}
          {goal && goal.targetDate && (
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Daily Mission Targets</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                  backgroundColor: (() => {
                    const maxPerDay = Math.max(paceData.grammarPerDay || 0, paceData.vocabPerDay || 0, paceData.lessonsPerDay || 0);
                    if (maxPerDay < 5) return 'rgba(59,255,158,0.15)';
                    if (maxPerDay < 20) return 'rgba(255,215,0,0.15)';
                    return 'rgba(255,51,85,0.15)';
                  })(),
                  color: (() => {
                    const maxPerDay = Math.max(paceData.grammarPerDay || 0, paceData.vocabPerDay || 0, paceData.lessonsPerDay || 0);
                    if (maxPerDay < 5) return '#3bff9e';
                    if (maxPerDay < 20) return '#ffd700';
                    return '#ff3355';
                  })(),
                }}>
                  {(() => {
                    const maxPerDay = Math.max(paceData.grammarPerDay || 0, paceData.vocabPerDay || 0, paceData.lessonsPerDay || 0);
                    if (maxPerDay < 5) return 'Light';
                    if (maxPerDay < 20) return 'Moderate';
                    return 'Intense';
                  })()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold" style={{ color: '#06b6d4' }}>{Math.ceil(paceData.lessonsPerDay)}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Lessons/day</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#3bff9e' }}>{Math.ceil(paceData.vocabPerDay)}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Vocab/day</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>{Math.ceil(paceData.grammarPerDay)}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Grammar/day</div>
                </div>
              </div>
              <div className="text-[10px] mt-1 text-center" style={{ color: 'var(--text-muted)' }}>
                Dashboard mission links use these limits
              </div>
            </div>
          )}

          {/* Progress section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Progress Toward Target</div>
            <PaceBar
              label="Lessons"
              done={paceData.completed.lessons}
              total={paceData.targetTotal.lessons}
              color="#06b6d4"
              perDay={paceData.lessonsPerDay}
              pace={paceData.lessonsPace}
              remaining={paceData.lessonsRemaining}
            />
            <PaceBar
              label="Vocabulary"
              done={paceData.completed.vocab}
              total={paceData.targetTotal.vocab}
              color="#3bff9e"
              perDay={paceData.vocabPerDay}
              pace={paceData.vocabPace}
              remaining={paceData.vocabRemaining}
            />
            <PaceBar
              label="Grammar"
              done={paceData.completed.grammar}
              total={paceData.targetTotal.grammar}
              color="#f59e0b"
              perDay={paceData.grammarPerDay}
              pace={paceData.grammarPace}
              remaining={paceData.grammarRemaining}
            />
          </div>

          {/* Per-day summary */}
          {paceData.daysRemaining > 0 && (
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Pace Required</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold" style={{ color: '#06b6d4' }}>{paceData.lessonsPerDay}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Lessons/day</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#3bff9e' }}>{paceData.vocabPerDay}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Words/day</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>{paceData.grammarPerDay}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Grammar/day</div>
                </div>
              </div>
            </div>
          )}

          {/* Edit/Clear buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: '#000' }}
            >
              Edit Goal
            </button>
            <button
              onClick={handleClearGoal}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355', border: '1px solid rgba(255,51,85,0.2)' }}
            >
              <RotateCcw size={14} /> Clear
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Set a target date to track your German progress.
          </p>
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
          >
            Set Goal
          </button>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, color }) {
  return (
    <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-sm font-bold mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}

function PaceBar({ label, done, total, color, perDay, pace, remaining }) {
  const pct = total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 0;
  const onTrack = perDay <= pace || pace === 0 || remaining === 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span style={{ color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)' }}>
          {done}/{total} ({pct}%)
        </span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.8 }}
        />
      </div>
      <div className="flex justify-between text-xs mt-0.5">
        <span style={{ color: remaining === 0 ? '#3bff9e' : 'var(--text-muted)' }}>
          Remaining: {remaining}
        </span>
        <span style={{ color: onTrack ? '#3bff9e' : '#ffd700' }}>
          {remaining === 0 ? 'Complete!' : `Need ${perDay}/day`}
        </span>
      </div>
    </div>
  );
}
