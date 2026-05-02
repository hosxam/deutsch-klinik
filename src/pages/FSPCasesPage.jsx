import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mic, ChevronLeft, ChevronDown, ChevronUp, Clock, AlertTriangle, Copy } from 'lucide-react';

export default function FSPCasesPage() {
  const [cases, setCases] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspCases.json');
      setCases(module.default || module);
    } catch {
      setCases([]);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
          <Mic size={18} style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>FSP Speaking Cases</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cases.length} case-based speaking scenarios</p>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading case data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map(c => (
            <div key={c.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
                    {c.setting || 'General'}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{c.title}</span>
                </div>
                {expanded[c.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[c.id] && (
                <div className="p-3 space-y-3">
                  {/* Patient info */}
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>Patient Information</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span style={{ color: 'var(--text-muted)' }}>Age:</span> <span style={{ color: 'var(--text-secondary)' }}>{c.patientRole?.age}</span></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Gender:</span> <span style={{ color: 'var(--text-secondary)' }}>{c.patientRole?.gender}</span></div>
                      <div className="col-span-2"><span style={{ color: 'var(--text-muted)' }}>Chief complaint:</span> <span style={{ color: 'var(--text-secondary)' }}>{c.patientRole?.chiefComplaint}</span></div>
                      {c.patientRole?.history && <div className="col-span-2"><span style={{ color: 'var(--text-muted)' }}>History:</span> <span style={{ color: 'var(--text-secondary)' }}>{c.patientRole.history}</span></div>}
                      {c.patientRole?.medications && <div className="col-span-2"><span style={{ color: 'var(--text-muted)' }}>Medications:</span> <span style={{ color: 'var(--text-secondary)' }}>{c.patientRole.medications}</span></div>}
                    </div>
                  </div>

                  {/* Doctor tasks */}
                  <div>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#3b82f6' }}>Your Tasks</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {c.doctorTasks?.map((task, i) => (
                        <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Red flags */}
                  {c.redFlags && c.redFlags.length > 0 && (
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,51,85,0.08)' }}>
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle size={12} style={{ color: '#ff3355' }} />
                        <span className="text-xs font-semibold" style={{ color: '#ff3355' }}>Red flags</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {c.redFlags.map((flag, i) => (
                          <li key={i} className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Must ask */}
                  {c.mustAsk && c.mustAsk.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#06b6d4' }}>Must Ask</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {c.mustAsk.map((q, i) => (
                          <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Useful phrases */}
                  {c.usefulPhrases && c.usefulPhrases.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#22c55e' }}>Useful Phrases</p>
                      <div className="flex flex-wrap gap-1">
                        {c.usefulPhrases.map((phrase, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor-to-doctor summary */}
                  {c.doctorToDoctorSummary && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.06)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#8b5cf6' }}>Doctor-to-doctor summary</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.doctorToDoctorSummary}</p>
                    </div>
                  )}

                  {/* AI feedback prompt */}
                  <button
                    onClick={() => {
                      const prompt = `You are an FSP examiner. Evaluate my performance on this case:
Case: ${c.title}
Setting: ${c.setting}
Patient: ${c.patientRole?.age}/${c.patientRole?.gender}, ${c.patientRole?.chiefComplaint}

Assess:
1. Question structure (did I ask about red flags?)
2. Medical vocabulary
3. Patient-friendly language
4. Grammar
5. Completeness

Rate each 1-5. Give specific improvement suggestions.`;
                      navigator.clipboard.writeText(prompt);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors w-full justify-center"
                    style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <Copy size={12} /> Copy AI Feedback Prompt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
