import { useState, useEffect, useMemo } from 'react';
import { getState, getTodayStudyMinutes } from '../utils/store';
import { Target, Calendar, Clock, CheckCircle, AlertTriangle, Edit3, RotateCcw } from 'lucide-react';
import { getGoalEstimate } from '../utils/adaptivePlan';

const STORAGE_KEY = 'deutsch_klinik_study_goal';
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'Medical FSP'];

function getLocalDateString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const HOURS_NEEDED = {
  A1: 75,
  A2: 100,
  B1: 150,
  B2: 200,
  C1: 250,
  'Medical FSP': 120,
};

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'Medical FSP'];

function calcPredictedFinish(dailyMinutes, targetLevel, progressPct) {
  const targetIdx = LEVEL_ORDER.indexOf(targetLevel);
  const selectedLevels = LEVEL_ORDER.slice(0, targetIdx + 1);
  const totalHours = selectedLevels.reduce((sum, level) => sum + (HOURS_NEEDED[level] || 0), 0);
  const remainingHours = totalHours * (1 - Math.min((progressPct || 0) / 100, 0.99));
  const daysNeeded = Math.ceil((remainingHours * 60) / Math.max(1, dailyMinutes));
  const finish = new Date();
  finish.setDate(finish.getDate() + daysNeeded);
  return { finish, daysNeeded };
}

function formatLongDate(date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours} hrs ${rest} min`;
  if (hours) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${minutes} min`;
}

export function getStudyGoal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      targetLevel: parsed.targetLevel || 'B2',
      dailyMinutes: typeof parsed.dailyMinutes === 'number' ? parsed.dailyMinutes : 30,
      planType: parsed.planType || 'exam',
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

const ESTIMATED_MINUTES = {
  grammar: 5,
  vocab: 5,
  reading: 10,
  listening: 10,
  writing: 15,
  speaking: 10,
  lesson: 10,
  exam: 30,
};

function calculateTodayMinutes(state) {
  const today = getLocalDateString();
  let total = 0;

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  for (const level of levels) {
    const prog = state.levels?.[level];
    if (!prog) continue;

    const countToday = (arr, min) => {
      if (!Array.isArray(arr)) return 0;
      return arr.filter(item => {
        if (!item) return false;
        if (typeof item === 'string') return item.startsWith(today);
        const dateVal = item.date || item.completedAt || item.timestamp || item.createdAt;
        return dateVal && String(dateVal).startsWith(today);
      }).length * min;
    };

    total += countToday(prog.grammar, ESTIMATED_MINUTES.grammar);
    total += countToday(prog.vocab, ESTIMATED_MINUTES.vocab);
    total += countToday(prog.reading, ESTIMATED_MINUTES.reading);
    total += countToday(prog.listening, ESTIMATED_MINUTES.listening);

    const todayWritings = (state.writings || []).filter(
      w => w?.level === level && w?.date?.startsWith(today)
    ).length * ESTIMATED_MINUTES.writing;
    total += todayWritings;

    const todaySpeaking = (state.speakingRecordings?.[level] || []).filter(
      r => r?.date?.startsWith(today)
    ).length * ESTIMATED_MINUTES.speaking;
    total += todaySpeaking;

    // Lessons: only count entries with completedAt timestamps
    const todayLessons = (state.completedLessons?.[level] || []).filter(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return item.completedAt && String(item.completedAt).startsWith(today);
      }
      return false;
    }).length * ESTIMATED_MINUTES.lesson;
    total += todayLessons;

    // Exam entries
    const todayExams = (state.exams?.[level] || []).filter(e => {
      if (!e) return false;
      const dateVal = e.date || e.completedAt || e.timestamp;
      return dateVal && String(dateVal).startsWith(today);
    }).length * ESTIMATED_MINUTES.exam;
    total += todayExams;
  }

  return total;
}

function getLocalDateKeysForPast7Days() {
  const keys = [];
  const pad = (n) => String(n).padStart(2, '0');
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }
  return keys;
}

function calculateWeekMinutes(state) {
  const weekKeys = getLocalDateKeysForPast7Days();
  let total = 0;
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  for (const level of levels) {
    const prog = state.levels?.[level];
    if (!prog) continue;

    const countForWeek = (arr, min) => {
      if (!Array.isArray(arr)) return 0;
      return arr.filter(item => {
        if (!item) return false;
        let dateStr = '';
        if (typeof item === 'string') {
          dateStr = item;
        } else {
          const dateVal = item.date || item.completedAt || item.timestamp || item.createdAt;
          if (!dateVal) return false;
          dateStr = String(dateVal).slice(0, 10);
        }
        return weekKeys.includes(dateStr);
      }).length * min;
    };

    total += countForWeek(prog.grammar, ESTIMATED_MINUTES.grammar);
    total += countForWeek(prog.vocab, ESTIMATED_MINUTES.vocab);
    total += countForWeek(prog.reading, ESTIMATED_MINUTES.reading);
    total += countForWeek(prog.listening, ESTIMATED_MINUTES.listening);

    const weekWritings = (state.writings || []).filter(
      w => w?.level === level && w?.date && weekKeys.includes(String(w.date).slice(0, 10))
    ).length * ESTIMATED_MINUTES.writing;
    total += weekWritings;

    const weekSpeaking = (state.speakingRecordings?.[level] || []).filter(
      r => r?.date && weekKeys.includes(String(r.date).slice(0, 10))
    ).length * ESTIMATED_MINUTES.speaking;
    total += weekSpeaking;

    const weekLessons = (state.completedLessons?.[level] || []).filter(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return item.completedAt && weekKeys.includes(String(item.completedAt).slice(0, 10));
      }
      return false;
    }).length * ESTIMATED_MINUTES.lesson;
    total += weekLessons;

    const weekExams = (state.exams?.[level] || []).filter(e => {
      if (!e) return false;
      const dateVal = e.date || e.completedAt || e.timestamp;
      return dateVal && weekKeys.includes(String(dateVal).slice(0, 10));
    }).length * ESTIMATED_MINUTES.exam;
    total += weekExams;
  }

  return total;
}

function calculateWeekActiveDays(state) {
  const weekKeys = getLocalDateKeysForPast7Days();
  const activeDays = new Set();
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const addDate = (val) => {
    if (!val) return;
    const s = String(val).slice(0, 10);
    if (weekKeys.includes(s)) activeDays.add(s);
  };

  for (const level of levels) {
    const prog = state.levels?.[level];
    if (!prog) continue;

    const scanDates = (arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(item => {
        if (!item) return;
        if (typeof item === 'string') return; // skip old plain-string entries (not dates)
        const dateVal = item.date || item.completedAt || item.timestamp || item.createdAt;
        if (dateVal) addDate(dateVal);
      });
    };

    scanDates(prog.grammar);
    scanDates(prog.vocab);
    scanDates(prog.reading);
    scanDates(prog.listening);

    (state.writings || []).forEach(w => addDate(w?.date));
    (state.speakingRecordings?.[level] || []).forEach(r => addDate(r?.date));

    (state.completedLessons?.[level] || []).forEach(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        addDate(item.completedAt);
      }
    });

    (state.exams?.[level] || []).forEach(e => addDate(e?.date || e?.completedAt || e?.timestamp));
  }

  return activeDays.size;
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

    const todayLessons = (state.completedLessons?.[level] || []).filter(item => {
      // Object entries: check completedAt
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return item.completedAt && String(item.completedAt).startsWith(today);
      }
      // String entries: old format with no dates, do not count for today
      return false;
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
  const todayTasks = calculateTodayCompletedTasks(state);
  const progress = calculateOverallProgress(state);
  if (!goal || progress === null) return 'unknown';
  if (todayTasks > 0 && progress > 0) return 'on_track';
  if (todayTasks > 0) return 'needs_work';
  return 'behind';
}

export default function StudyGoalTracker() {
  const [goal, setGoal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ targetLevel: 'B2', dailyMinutes: 30 });
  const [showForm, setShowForm] = useState(false);

  const state = getState();
  const todayTasks = useMemo(() => calculateTodayCompletedTasks(state), [state]);
  const goalEstimate = useMemo(() => getGoalEstimate(state, goal), [state, goal]);
  const todayMinutes = useMemo(() => getTodayStudyMinutes(), [state]);
  const weekMinutes = useMemo(() => calculateWeekMinutes(state), [state]);
  const weekActiveDays = useMemo(() => calculateWeekActiveDays(state), [state]);
  const progressPct = useMemo(() => calculateOverallProgress(state), [state]);
  const predicted = useMemo(() => goal
    ? calcPredictedFinish(goal.dailyMinutes, goal.targetLevel, progressPct || 0)
    : null, [goal, progressPct]);
  const status = useMemo(() => estimateGoalStatus(state, goal), [state, goal]);

  useEffect(() => {
    const saved = getStudyGoal();
    if (saved) {
      setGoal(saved);
      setForm({
        targetLevel: saved.targetLevel || 'B2',
        dailyMinutes: saved.dailyMinutes || 30,
      });
    }
  }, []);

  const handleSave = () => {
    const newGoal = {
      targetLevel: form.targetLevel || 'B2',
      targetDate: '',
      dailyMinutes: Math.min(90, Math.max(15, Number(form.dailyMinutes) || 30)),
      planType: 'exam',
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
    setForm({ targetLevel: 'B2', dailyMinutes: 30 });
  };

  const handleEdit = () => {
    if (goal) {
      setForm({
        targetLevel: goal.targetLevel || 'B2',
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
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Daily Study Goal: {formatMinutes(form.dailyMinutes)}
            </label>
            <input
              type="range"
              min="15"
              max="90"
              step="15"
              value={form.dailyMinutes}
              onChange={(e) => setForm({ ...form, dailyMinutes: Number(e.target.value) || 30 })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>15 min</span>
              <span>30 min</span>
              <span>60 min</span>
              <span>90 min</span>
            </div>
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

          {/* Today's Target */}
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Target</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{todayMinutes} / {goal.dailyMinutes} min</span>
            </div>
            <div className="h-2 rounded-full mb-1" style={{ backgroundColor: 'var(--bg-page)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(Math.round((todayMinutes / goal.dailyMinutes) * 100), 100)}%`,
                  backgroundColor: todayMinutes >= goal.dailyMinutes ? '#3bff9e' : todayMinutes > 0 ? '#ffd700' : 'var(--text-muted)',
                }}
              />
            </div>
            <div className="text-xs" style={{
              color: todayMinutes >= goal.dailyMinutes ? '#3bff9e' : todayMinutes > 0 ? '#ffd700' : 'var(--text-muted)',
            }}>
              {todayMinutes >= goal.dailyMinutes
                ? 'Daily goal reached!'
                : todayMinutes > 0
                  ? `In progress (${goal.dailyMinutes - todayMinutes} min remaining)`
                  : 'Not started yet'}
            </div>
          </div>

          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Current track</div>
                <div className="text-sm font-bold" style={{ color: '#8b5cf6' }}>{goalEstimate.track}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Intensity</div>
                <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{goalEstimate.intensity}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Estimated finish</div>
                <div className="text-sm font-bold" style={{ color: '#3bff9e' }}>
                  {predicted ? formatLongDate(predicted.finish) : goalEstimate.predictedFinishDate}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Remaining today</div>
                <div className="text-sm font-bold" style={{ color: todayMinutes >= goal.dailyMinutes ? '#3bff9e' : '#ffd700' }}>
                  {Math.max(0, goal.dailyMinutes - todayMinutes)} min
                </div>
              </div>
            </div>
            {goalEstimate.notEnoughContent && (
              <p className="text-xs mt-2" style={{ color: '#ffd700' }}>
                Some selected curriculum areas do not yet have enough structured content. The plan will use available review and remediation work until those modules are expanded.
              </p>
            )}
          </div>

          {/* This Week */}
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>This Week</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{weekMinutes} / {goal.dailyMinutes * 7} min</span>
            </div>
            <div className="h-2 rounded-full mb-1" style={{ backgroundColor: 'var(--bg-page)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(Math.round((weekMinutes / (goal.dailyMinutes * 7)) * 100), 100)}%`,
                  backgroundColor: weekMinutes >= goal.dailyMinutes * 7 ? '#3bff9e' : weekMinutes > 0 ? '#06b6d4' : 'var(--text-muted)',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: weekActiveDays > 0 ? '#06b6d4' : 'var(--text-muted)' }}>
                {weekActiveDays}/7 active days
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                {weekMinutes >= goal.dailyMinutes * 7 ? 'Weekly goal reached!' : `${Math.round((goal.dailyMinutes * 7) - weekMinutes)} min left`}
              </span>
            </div>
          </div>

          {/* Goal info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Target</div>
              <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{goal.targetLevel}</div>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Plan</div>
              <div className="text-sm font-bold" style={{ color: '#8b5cf6' }}>Auto-Predicted</div>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={11} className="inline mr-1" />
                Predicted finish
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                {predicted ? `${predicted.daysNeeded} days` : 'Pending'}
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

          {predicted && (
            <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Predicted finish: <strong style={{ color: 'var(--accent)' }}>{formatLongDate(predicted.finish)}</strong> at {goal.dailyMinutes} min/day.
            </div>
          )}
        </div>
      )}

      {/* Initial setup prompt */}
      {!goal && !showForm && (
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              Set a study goal to predict a finish date and scale your daily plan.
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
