import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PenTool, ChevronLeft, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { PageShell, SectionHeader, Card, Button, LevelBadge, Badge } from '../components/ui';

export default function FSPWritingPage() {
  const [tasks, setTasks] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspWriting.json');
      setTasks(module.default || module);
    } catch {
      setTasks([]);
    }
  }

  return (
    <PageShell>
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <SectionHeader
        title="Arztbrief / Writing Practice"
        subtitle={`${tasks.length} structured medical writing tasks`}
        action={
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,107,0,0.15)' }}>
            <PenTool size={18} style={{ color: '#ff6b00' }} />
          </div>
        }
      />

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading writing data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(t => (
            <Card key={t.id} className="overflow-hidden p-0">
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{t.caseTitle}</span>
                {expanded[t.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[t.id] && (
                <div className="p-3 space-y-3">
                  <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>{t.task}</p>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {t.patientData && <div><span style={{ color: 'var(--text-muted)' }}>Patient data:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.patientData}</span></div>}
                    {t.history && <div><span style={{ color: 'var(--text-muted)' }}>History:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.history}</span></div>}
                    {t.examFindings && <div><span style={{ color: 'var(--text-muted)' }}>Exam findings:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.examFindings}</span></div>}
                    {t.diagnostics && <div><span style={{ color: 'var(--text-muted)' }}>Diagnostics:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.diagnostics}</span></div>}
                    {t.assessment && <div><span style={{ color: 'var(--text-muted)' }}>Assessment:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.assessment}</span></div>}
                    {t.treatment && <div><span style={{ color: 'var(--text-muted)' }}>Treatment:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.treatment}</span></div>}
                    {t.dischargePlan && <div><span style={{ color: 'var(--text-muted)' }}>Discharge plan:</span> <span style={{ color: 'var(--text-secondary)' }}>{t.dischargePlan}</span></div>}
                  </div>

                  {t.expectedStructure && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#06b6d4' }}>Expected structure</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {t.expectedStructure.map((s, i) => (
                          <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {t.usefulPhrases && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#22c55e' }}>Useful phrases</p>
                      <div className="flex flex-wrap gap-1">
                        {t.usefulPhrases.map((phrase, i) => (
                          <Badge key={i} label={phrase} color="#22c55e" />
                        ))}
                      </div>
                    </div>
                  )}

                  {t.modelAnswer && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,107,0,0.06)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#ff6b00' }}>Model answer</p>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{t.modelAnswer}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      const prompt = `You are an FSP examiner. Evaluate my Arztbrief for:
Case: ${t.caseTitle}
Task: ${t.task}

Assess:
1. Structure - are all sections present?
2. Missing information
3. Medical terminology
4. Grammar and formal style
5. Clarity

Give a corrected version.`;
                      navigator.clipboard.writeText(prompt);
                    }}
                    variant="secondary"
                    size="sm"
                    style={{ backgroundColor: 'rgba(255,107,0,0.1)', color: '#ff6b00', border: '1px solid rgba(255,107,0,0.2)', width: '100%' }}
                  >
                    <Copy size={12} /> Copy AI Feedback Prompt
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
