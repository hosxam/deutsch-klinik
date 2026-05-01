import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, getCompletedLessons } from '../utils/store';
import allLessonsData from '../data/germanLessonsNew.json';
import unitsData from '../data/germanUnits.json';
import { BookOpen, CheckCircle, Circle, ArrowLeft, BarChart3 } from 'lucide-react';

const allLessons = allLessonsData;
const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

export default function LessonsPage() {
  const { levelId } = useParams();
  const [state, setState] = useState(getState());
  const completed = getCompletedLessons(levelId);
  const color = levelColors[levelId] || 'var(--accent)';

  useEffect(() => {
    const i = setInterval(() => setState({ ...getState() }), 1000);
    return () => clearInterval(i);
  }, []);

  const levelLessons = allLessons.filter(l => l.level === levelId);
  const unitInfo = unitsData.find(u => u.level === levelId);
  const total = levelLessons.length;
  const done = completed.filter(c => c.startsWith(levelId + '_lesson')).length;

  if (!levelLessons.length) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0' }}>
        No lessons found for level {levelId}.
      </div>
    );
  }

  // Group lessons by unit
  const unitMap = {};
  levelLessons.forEach(l => {
    if (!unitMap[l.unit]) unitMap[l.unit] = [];
    unitMap[l.unit].push(l);
  });

  return (
    <div>
      <Link
        to={`/level/${levelId}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}
      >
        <ArrowLeft size={14} /> Back to Level {levelId}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '8px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
          backgroundColor: color + '20', color,
        }}>{levelId}</div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>Structured Lessons</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {unitInfo?.units?.length || 0} units &middot; {done}/{total} completed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-hover)',
        marginBottom: '24px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '4px', backgroundColor: color,
          width: total > 0 ? Math.round((done / total) * 100) + '%' : '0%',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Lessons grouped by unit */}
      {unitInfo?.units?.map(unit => {
        const unitLessons = unitMap[unit.id] || [];
        if (!unitLessons.length) return null;
        const unitDone = unitLessons.filter(l => completed.includes(l.id)).length;

        return (
          <div key={unit.id} style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
            }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '3px',
                backgroundColor: unit.color || color,
              }} />
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {unit.title}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {unitDone}/{unitLessons.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {unitLessons.map(lesson => {
                const isDone = completed.includes(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    to={`/level/${levelId}/lessons/${lesson.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '10px', textDecoration: 'none',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid ' + (isDone ? color + '40' : 'var(--border)'),
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      {isDone ? (
                        <CheckCircle size={20} style={{ color }} />
                      ) : (
                        <Circle size={20} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {lesson.objective}
                      </div>
                    </div>
                    <BookOpen size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
