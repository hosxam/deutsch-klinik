import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CalendarCheck, ChevronLeft, ChevronDown, ChevronUp, Clock, AlertTriangle, Copy } from 'lucide-react';

export default function FSPExamPage() {
  const [exams, setExams] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspExams.json');
      setExams(module.default || module);
    } catch {
      setExams([]);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
          <CalendarCheck size={18} style={{ color: '#ef4444' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>FSP Mock Exams</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{exams.length} full FSP practice exams</p>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading exam data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => (
            <div key={exam.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [exam.id]: !prev[exam.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{exam.title}</span>
                </div>
                {expanded[exam.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[exam.id] && (
                <div className="p-3 space-y-3">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{exam.case}</p>

                  {exam.part1_patientConversation && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.06)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#8b5cf6' }}>Part 1: Patient Conversation</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{JSON.stringify(exam.part1_patientConversation)}</p>
                    </div>
                  )}

                  {exam.part2_documentation && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,107,0,0.06)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#ff6b00' }}>Part 2: Documentation</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{exam.part2_documentation.task}</p>
                    </div>
                  )}

                  {exam.part3_doctorDoctorConversation && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.06)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>Part 3: Doctor-Doctor Conversation</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{exam.part3_doctorDoctorConversation.task}</p>
                    </div>
                  )}

                  {exam.terminology && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#06b6d4' }}>Terminology focus</p>
                      <div className="flex flex-wrap gap-1">
                        {exam.terminology.map((t, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {exam.rubric && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#22c55e' }}>Scoring rubric</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(exam.rubric).map(([key, val]) => (
                          <div key={key} className="flex justify-between p-1 rounded" style={{ backgroundColor: 'var(--bg-card)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{key}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
