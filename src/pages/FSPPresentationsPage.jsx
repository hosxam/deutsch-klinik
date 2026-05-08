import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Network, ChevronLeft, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { PageShell, SectionHeader, Card, Button, LevelBadge, Badge } from '../components/ui';

export default function FSPPresentationsPage() {
  const [presentations, setPresentations] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspPresentations.json');
      setPresentations(module.default || module);
    } catch {
      setPresentations([]);
    }
  }

  return (
    <PageShell>
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <SectionHeader
        title="Case Presentations (Arzt-Arzt)"
        subtitle={`${presentations.length} doctor-to-doctor presentation prompts`}
        action={
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
            <Network size={18} style={{ color: '#f59e0b' }} />
          </div>
        }
      />

      {presentations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading presentation data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {presentations.map(p => (
            <Card key={p.id} className="overflow-hidden p-0">
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{p.caseTitle}</span>
                {expanded[p.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[p.id] && (
                <div className="p-3 space-y-3">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.rawPatientInfo}</p>
                  <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>{p.task}</p>

                  {p.expectedPresentationOrder && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#06b6d4' }}>Expected structure</p>
                      <ol className="list-decimal pl-4 space-y-0.5">
                        {p.expectedPresentationOrder.map((step, i) => (
                          <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {p.usefulPhrases && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#22c55e' }}>Useful phrases</p>
                      <div className="flex flex-wrap gap-1">
                        {p.usefulPhrases.map((phrase, i) => (
                          <Badge key={i} label={phrase} color="#22c55e" />
                        ))}
                      </div>
                    </div>
                  )}

                  {p.commonMistakes && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#ff3355' }}>Common mistakes</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {p.commonMistakes.map((m, i) => (
                          <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.modelPresentation && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.06)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>Model presentation</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.modelPresentation}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      const prompt = `You are an FSP examiner evaluating a case presentation.
Case: ${p.caseTitle}

Task: ${p.task}

Expected structure: ${p.expectedPresentationOrder?.join(', ')}

Assess my presentation on:
1. Structure and completeness
2. Conciseness and medical logic
3. German phrasing and terminology
4. Doctor-to-doctor tone
5. Red flags mentioned

Give specific improvement suggestions.`;
                      navigator.clipboard.writeText(prompt);
                    }}
                    variant="secondary"
                    size="sm"
                    style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', width: '100%' }}
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
