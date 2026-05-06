import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState } from '../utils/store';
import {
  Stethoscope, BookOpen, Mic, PenTool, FileText, Headphones, ClipboardCheck, Target, ChevronRight, Star,
  Clock, AlertTriangle, GraduationCap, CalendarCheck, ListChecks, TriangleAlert, Network
} from 'lucide-react';



// FSP progress counts (static for now, will be dynamic with localStorage later)
const progressDefaults = {
  vocabulary: 0, anamnese: 0, speakingCases: 0, arztbrief: 0,
  presentations: 0, listening: 0, reading: 0, grammar: 0, mockExams: 0,
  totalVocab: 0, totalAnamnese: 0, totalCases: 0, totalArztbrief: 0,
  totalPresentations: 0, totalListening: 0, totalReading: 0, totalGrammar: 0, totalMockExams: 0
};

const studyPath = [
  { step: 1, label: 'Medical Vocabulary', icon: BookOpen, color: '#3b82f6', desc: 'Build your clinical German vocabulary', to: '/medical-fsp/vocabulary' },
  { step: 2, label: 'Anamnesis Structure', icon: ListChecks, color: '#06b6d4', desc: 'Learn structured patient history taking', to: '/medical-fsp/anamnese' },
  { step: 3, label: 'Patient Conversation', icon: Mic, color: '#8b5cf6', desc: 'Practice doctor-patient dialogues', to: '/medical-fsp/cases' },
  { step: 4, label: 'Case Presentation (Arzt-Arzt)', icon: Network, color: '#f59e0b', desc: 'Present cases to senior doctors', to: '/medical-fsp/presentations' },
  { step: 5, label: 'Arztbrief Writing', icon: PenTool, color: '#ff6b00', desc: 'Write structured medical reports', to: '/medical-fsp/writing' },
  { step: 6, label: 'Clinical Listening', icon: Headphones, color: '#22c55e', desc: 'Understand clinical dialogues', to: '/medical-fsp/listening' },
  { step: 7, label: 'Healthcare Reading', icon: FileText, color: '#10b981', desc: 'Read medical documents and reports', to: '/medical-fsp/reading' },
  { step: 8, label: 'Documentation Grammar', icon: Star, color: '#a855f7', desc: 'Master medical German grammar', to: '/medical-fsp/grammar' },
  { step: 9, label: 'Mock Exams', icon: CalendarCheck, color: '#ef4444', desc: 'Full FSP practice exams', to: '/medical-fsp/exams' },
  { step: 10, label: 'Review Mistakes', icon: AlertTriangle, color: '#ff3355', desc: 'Review and improve weak areas', to: '/mistake-notebook' },
];

const quickActions = [
  { label: 'Anamnese Practice', to: '/medical-fsp/anamnese', color: '#06b6d4', icon: ListChecks },
  { label: 'Arztbrief Practice', to: '/medical-fsp/writing', color: '#ff6b00', icon: PenTool },
  { label: 'Case Presentation', to: '/medical-fsp/presentations', color: '#f59e0b', icon: Network },
  { label: 'Start Mock Exam', to: '/medical-fsp/exams', color: '#ef4444', icon: CalendarCheck },
  { label: 'Review Mistakes', to: '/mistake-notebook', color: '#ff3355', icon: TriangleAlert },
];

export default function MedicalFSPHubPage() {
  const [c1Unlocked, setC1Unlocked] = useState(false);
  const [progress, setProgress] = useState(progressDefaults);

  useEffect(() => {
    const s = getState();
    const b2Exam = s.exams?.B2;
    setC1Unlocked(b2Exam?.passed === true);
    // Load FSP progress from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('fspProgress') || '{}');
      setProgress({ ...progressDefaults, ...saved });
    } catch { /* empty */ }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
          <Stethoscope size={24} style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>Medical German / FSP Hub</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Focused preparation for the Fachsprachpruefung</p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#8b5cf6' }}>
          <GraduationCap size={16} /> What is the FSP?
        </h2>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          The Fachsprachpruefung (FSP) is the medical German language exam required for international doctors
          to work in Germany. It tests C1-level clinical communication: taking patient histories, explaining
          diagnoses, presenting cases to colleagues, and documenting findings.
        </p>
        <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Target size={14} />
          <span className="text-xs">Recommended level: B2/C1 German before starting FSP prep</span>
        </div>
      </div>

      {/* C1 lock warning (non-blocking) */}
      {!c1Unlocked && (
        <div className="rounded-xl p-3 mb-5 flex items-start gap-2" style={{ backgroundColor: 'rgba(255,51,85,0.08)', border: '1px solid rgba(255,51,85,0.25)' }}>
          <AlertTriangle size={16} style={{ color: '#ff3355', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#ff3355' }}>C1 content not yet unlocked</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              You can still use FSP materials. We recommend completing B1-B2 first for best results.
            </p>
          </div>
        </div>
      )}

      {/* Progress Cards */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardCheck size={16} style={{ color: '#22c55e' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#22c55e' }}>Progress Overview</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {[
            { label: 'Vocabulary', icon: BookOpen, color: '#3b82f6', current: progress.vocabulary, total: '1,000+' },
            { label: 'Anamnese', icon: ListChecks, color: '#06b6d4', current: progress.anamnese, total: '100+' },
            { label: 'Cases', icon: Mic, color: '#8b5cf6', current: progress.speakingCases, total: '100+' },
            { label: 'Arztbrief', icon: PenTool, color: '#ff6b00', current: progress.arztbrief, total: '100+' },
            { label: 'Presentations', icon: Network, color: '#f59e0b', current: progress.presentations, total: '100+' },
            { label: 'Listening', icon: Headphones, color: '#22c55e', current: progress.listening, total: '100+' },
            { label: 'Reading', icon: FileText, color: '#10b981', current: progress.reading, total: '100+' },
            { label: 'Grammar', icon: Star, color: '#a855f7', current: progress.grammar, total: '150+' },
            { label: 'Mock Exams', icon: CalendarCheck, color: '#ef4444', current: progress.mockExams, total: '10' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-center mb-1">
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.current}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Target: {stat.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} style={{ color: '#ffaa33' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#ffaa33' }}>Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {quickActions.map(btn => {
            const Icon = btn.icon;
            return (
              <Link
                key={btn.label}
                to={btn.to}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors hover:scale-[1.02]"
                style={{ backgroundColor: btn.color + '15', color: btn.color, border: '1px solid ' + btn.color + '35' }}
              >
                <Icon size={14} />
                {btn.label}
                <ChevronRight size={12} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Study Path */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} style={{ color: '#8b5cf6' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#8b5cf6' }}>Recommended Study Path</h2>
        </div>
        <div className="space-y-2">
          {studyPath.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.step}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ backgroundColor: item.color + '18', color: item.color }}
                >
                  {item.step}
                </div>
                <Icon size={16} style={{ color: item.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
