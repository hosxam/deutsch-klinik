import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState } from '../utils/store';
import medicalData from '../data/medical.json';
import { Stethoscope, Lock } from 'lucide-react';

export default function MedicalPage() {
  const state = getState();
  const [unlocked, setUnlocked] = useState(state.medicalUnlocked);

  if (!unlocked) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Lock size={32} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Medical German Locked</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Complete level B1 to unlock the Medical German add-on with orthopedic vocabulary, patient dialogues, and clinical phrases.
        </p>
        <Link to="/" className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const categories = [...new Set(medicalData.vocabulary.map(v => v.category))];
  const topics = [...new Set(medicalData.vocabulary.map(v => v.topic))];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Stethoscope size={24} style={{ color: '#3bff9e' }} />
        <h1 className="text-xl font-bold" style={{ color: '#3bff9e' }}>Medical German (Orthopedics)</h1>
      </div>

      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'rgba(59,255,158,0.06)', border: '1px solid rgba(59,255,158,0.2)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          This supplement helps you prepare for medical communication in Germany. Focused on orthopedic vocabulary, patient history taking, and doctor-patient dialogues. This is not a replacement for the FSP (Fachsprachprüfung).
        </p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-6">
          <h2 className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {medicalData.vocabulary.filter(v => v.category === cat).map(v => (
              <div key={v.id} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span className="font-semibold text-sm">{v.german}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.english}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Dialogue practice */}
      <h2 className="font-semibold mb-3 mt-8" style={{ color: '#3bff9e' }}>Dialogue Practice</h2>
      <div className="space-y-3 mb-8">
        {medicalData.dialoguePrompts.map(d => (
          <div key={d.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>{d.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>{d.level}</span>
            </div>
            {d.patient && <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Patient: "{d.patient}"</p>}
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You: {d.doctorPrompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
