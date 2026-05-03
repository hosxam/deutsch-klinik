import { useState, useEffect, useMemo } from 'react';
import { getState } from '../utils/store';
import { Target, Calendar, Clock, CheckCircle, AlertTriangle, Edit3, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'deutsch_klinik_study_goal';
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'Medical FSP'];

function getLocalDateString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getStudyGoal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      targetLevel: parsed.targetLevel || 'B2',
      targetDate: parsed.targetDate || '',
      dailyMinutes: typeof parsed.dailyMinutes === 'number' ? parsed.dailyMinutes : 30,
    };
  } catch {
    return null;
  }
}

export function saveStudyGoal(goal) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
  } catch (e) {
    console.warn('Failed to save study goal.', e);
  }
}

export function clearStudyGoal() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear study goal.', e);
  }
}

function calculateDaysRemaining(targetDate) {
  if (!targetDate) return null;
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const target = parseLocalDate(targetDate);
  const todayLocal = parseLocalDate(todayStr);
  const diff = Math.ceil((target - todayLocal) / (1000 * 60 * 60 * 24));
  return diff;
}

function calculateTodayCompletedTasks(state) {
  const today = getLocalDateString();
  let count = 0;

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  for (const level of levels) {
    const prog = state.levels?.[level];
    if (!prog) continue;

    const checkHasToday = (arr) => {
      if (!Array.isArray(arr)) return false;
      return arr.some(item => {
        if (!item) return false;
        if (typeof item === 'string') return item.startsWith(today);
        const dateVal = item.date || item.completedAt || item.timestamp || item.createdAt;
        return dateVal && String(dateVal).startsWith(today);
      });
    };

    if (checkHasToday(prog.grammar)) count++;
    if (checkHasToday(prog.vocab)) count++;
    if (checkHasToday(prog.reading)) count++;
    if (checkHasToday(prog.listening)) count++;

    const todayWritings = (state.writings || []).filter(
      w => w?.level === level && w?.date?.startsWith(today)
    ).length;
    count += todayWritings > 0 ? 1 : 0;

    const todaySpeaking = (state.speakingRecordings?.[level] || []).filter(
      r => r?.date?.startsWith(today)
    ).length;
    count += todaySpeaking > 0 ? 1 : 0;

    const todayLessons = (state.completedLessons?.[level] || []).filter(id => {
      return typeof id === 'string' && id.startsWith(today);
    }).length;
    count += todayLessons > 0 ? 1 : 0;
  }

  return count;
}

function calculateOverallProgress(state) {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let totalExercises = 0;
  let totalPossible = 0;

  for (const level of levels) {
    const prog = state.levels?.[level];
    const grammarCount = Array.isArray(prog?.grammar) ? prog.grammar.length : 0;
    const vocabCount = Array.isArray(prog?.vocab) ? prog.vocab.length : 0;
    const readingCount = Array.isArray(prog?.reading) ? prog.reading.length : 0;
    const listeningCount = Array.isArray(prog?.listening) ? prog.listening.length : 0;
    const writingCount = (state.writings || []).filter(w => w?.level === level).length;
    const speakingCount = (state.speakingRecordings?.[level] || []).length;
    const lessonCount = (state.completedLessons?.[level] || []).length;

    totalExercises += grammarCount + vocabCount + readingCount + listeningCount + writingCount + speakingCount + lessonCount;
    totalPossible += 500;
  }

  if (totalPossible === 0) return null;
  const pct = Math.round((totalExercises / totalPossible) * 100);
  return Math.min(pct, 100);
}

function estimateGoalStatus(state, goal) {
  if (!goal || !goal.targetDate) return 'unknown';

  const daysRemaining = calculateDaysRemaining(goal.targetDate);
  if (daysRemaining === null) return 'unknown';

  const todayTasks = calculateTodayCompletedTasks(state);
  const goalDaily = goal.dailyMinutes || 30;

  if (daysRemaining < 0) return 'behind';

  const progress = calculateOverallProgress(state);
  if (progress === null) return 'unknown';

  const expectedProgress = Math.min(100, Math.round((1 - daysRemaining / 365) * 100));
  const buffer = 10;

  if (progress >= expectedProgress - buffer && todayTasks > 0) return 'on_track';
  if (progress >= expectedProgress - buffer - 15) return 'needs_work';
  return 'behind';
}

export default function StudyGoalTracker() {
  const [goal, setGoal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ targetLevel: 'B2', targetDate: '', dailyMinutes: 30 });
  const [showForm, setShowForm] = useState(false);

  const state = getState();
  const daysRemaining = useMemo(() => calculateDaysRemaining(goal?.targetDate), [goal]);
  const todayTasks = useMemo(() => calculateTodayCompletedTasks(state), [state]);
  const progressPct = useMemo(() => calculateOverallProgress(state), [state]);
  const status = useMemo(() => estimateGoalStatus(state, goal), [state, goal]);

  useEffect(() => {
    const saved = getStudyGoal();
    if (saved) {
      setGoal(saved);
      setForm({
        targetLevel: saved.targetLevel || 'B2',
        targetDate: saved.targetDate || '',
        dailyMinutes: saved.dailyMinutes || 30,
      });
    }
  }, []);

  const handleSave = () => {
    const newGoal = {
      targetLevel: form.targetLevel || 'B2',
      targetDate: form.targetDate || '',
      dailyMinutes: Math.max(1, Number(form.dailyMinutes) || 30),
    };
    saveStudyGoal(newGoal);
    setGoal(newGoal);
    setEditing(false);
    setShowForm(false);
  };

  const handleReset = () => {
    clearStudyGoal();
    setGoal(null);
    setEditing(false);
    setShowForm(true);
    setForm({ targetLevel: 'B2', targetDate: '', dailyMinutes: 30 });
  };

  const handleEdit = () => {
    if (goal) {
      setForm({
        targetLevel: goal.targetLevel || 'B2',
        targetDate: goal.targetDate || '',
        dailyMinutes: goal.dailyMinutes || 30,
      });
    }
    setEditing(true);
    setShowForm(true);
  };

  const statusConfig = {
    on_track: { label: 'On track', color: '#3bff9e', bg: 'rgba(59,255,158,0.1)' },
    needs_work: { label: 'Needs more work', color: '#ffd700', bg: 'rgba(255,215,0,0.1)' },
    behind: { label: 'Behind', color: '#ff3355', bg: 'rgba(255,51,85,0.1)' },
    unknown: { label: 'Pending', color: 'var(--text-muted)', bg: 'transparent' },
  };

  const sc = statusConfig[status] || statusConfig.unknown;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <Target size={16} /> Study Goal Tracker
        </h2>
        {goal && !editing && (
          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg transition-colors hover:scale-105"
              style={{ color: 'var(--text-muted)' }}
              title="Edit goal"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg transition-colors hover:scale-105"
              style={{ color: 'var(--text-muted)' }}
              title="Reset goal"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      {!goal || editing ? (
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
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Daily Study Goal (minutes)</label>
            <input
              type="number"
              min="1"
              max="480"
              value={form.dailyMinutes}
              onChange={(e) => setForm({ ...form, dailyMinutes: Number(e.target.value) || 30 })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--bg-hover)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
          >
            {goal ? 'Update Goal' : 'Set Goal'}
          </button>
          {goal && (
            <button
              onClick={() => { setEditing(false); setShowForm(false); }}
              className="w-full py-1.5 rounded-lg text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.color}44` }}
          >
            {status === 'on_track' && <CheckCircle size={12} />}
            {status === 'needs_work' && <AlertTriangle size={12} />}
            {status === 'behind' && <AlertTriangle size={12} />}
            {status === 'unknown' && <Clock size={12} />}
            {sc.label}
          </div>

          {/* Goal info grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Target</div>
              <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{goal.targetLevel}</div>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={11} className="inline mr-1" />
                Days left
              </div>
              <div className="text-sm font-bold" style={{
                color: daysRemaining !== null && daysRemaining < 0 ? '#ff3355' :
                       daysRemaining !== null && daysRemaining < 30 ? '#ffd700' : 'var(--accent)'
              }}>
                {daysRemaining !== null ? (daysRemaining >= 0 ? daysRemaining : 'Overdue') : 'No date'}
              </div>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock size={11} className="inline mr-1" />
                Daily goal
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{goal.dailyMinutes} min</div>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <CheckCircle size={11} className="inline mr-1" />
                Today done
              </div>
              <div className="text-sm font-bold" style={{ color: todayTasks > 0 ? '#3bff9e' : 'var(--text-muted)' }}>
                {todayTasks} tasks
              </div>
            </div>
          </div>

          {/* Progress */}

          {progressPct !== null ? (
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>Overall progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor: sc.color,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-xs py-1.5 px-2 rounded-lg" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)' }}>
              Progress estimate unavailable until more activities are completed.
            </div>
          )}

          {/* Target date display */}
          {goal.targetDate && (
            <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Target date: {goal.targetDate}
            </div>
          )}
        </div>
      )}

      {/* Initial setup prompt */}
      {!goal && !showForm && (
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Set a study goal to track your progress toward a target level and exam date.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
          >
            Set Your Goal
          </button>
        </div>
      )}
    </div>
  );
}
