import { Link } from 'react-router-dom';
import resources from '../data/resources.json';
import { ExternalLink, ArrowLeft, BookOpen, GraduationCap, Target, Globe } from 'lucide-react';

const categoryIcons = {
  'Official Goethe Exam Training': GraduationCap,
  'Free Practice & Community': Globe,
  'Structured Learning Courses': BookOpen,
  'Assessment & Testing': Target,
};

export default function ResourcesPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" style={{ color: 'var(--accent)' }}><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>Official Resources</h1>
      </div>

      <div className="space-y-6">
        {resources.categories.map(cat => {
          const Icon = categoryIcons[cat.name] || ExternalLink;
          return (
            <div key={cat.name} className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon size={20} style={{ color: cat.color }} />
                <h2 className="font-semibold" style={{ color: cat.color }}>{cat.name}</h2>
              </div>
              <div className="space-y-3">
                {cat.items.map(item => (
                  <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer"
                    className="block p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--accent)' }}>{item.name}</span>
                      <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.description}</div>
                    <div className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{item.url}</div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #8b5cf6' }}>
        <h2 className="font-semibold mb-2" style={{ color: '#8b5cf6' }}>How to use these resources with Deutsch Klinik</h2>
        <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
          <li>Use <strong style={{ color: 'var(--accent)' }}>Nicos Weg</strong> (DW) as your main structured course alongside this app</li>
          <li>Practice Goethe exam format here, then try the <strong style={{ color: 'var(--accent)' }}>official Goethe practice materials</strong></li>
          <li>Use <strong style={{ color: 'var(--accent)' }}>Deutsch für dich</strong> for community exercises and speaking partners</li>
          <li>Join the <strong style={{ color: 'var(--accent)' }}>vhs-Lernportal</strong> for free structured courses that complement your level progression here</li>
          <li>The <strong style={{ color: 'var(--accent)' }}>FSP (Fachsprachprüfung)</strong> is separate — reach C1 here first, then use specialized FSP prep</li>
        </ul>
      </div>
    </div>
  );
}
