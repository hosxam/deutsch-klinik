import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FileText, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { PageShell, SectionHeader, Card, Button, LevelBadge, Badge } from '../components/ui';

export default function FSPReadingPage() {
  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspReading.json');
      setExercises(module.default || module);
    } catch {
      setExercises([]);
    }
  }

  return (
    <PageShell>
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <SectionHeader
        title="Healthcare Reading"
        subtitle={`${exercises.length} FSP reading exercises`}
        action={
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}>
            <FileText size={18} style={{ color: '#10b981' }} />
          </div>
        }
      />

      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading reading data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map(ex => (
            <Card key={ex.id} className="overflow-hidden p-0">
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{ex.title}</span>
                {expanded[ex.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[ex.id] && (
                <div className="p-3 space-y-3">
                  <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    {ex.text}
                  </div>

                  {ex.vocabularyFocus && ex.vocabularyFocus.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ex.vocabularyFocus.map((v, i) => (
                        <Badge key={i} label={v} color="#3b82f6" />
                      ))}
                    </div>
                  )}

                  {ex.questions && ex.questions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>Questions</p>
                      {ex.questions.map((q, i) => (
                        <div key={i} className="mb-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-hover)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>{q}</p>
                          {ex.answers && ex.answers[i] && (
                            <p className="text-[11px]" style={{ color: '#22c55e' }}>Answer: {ex.answers[i]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
