import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ListChecks, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

export default function FSPAnamnesePage() {
  const [anamnese, setAnamnese] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspAnamnese.json');
      setAnamnese(module.default || module);
    } catch {
      setAnamnese([]);
    }
  }

  const categories = [...new Set(anamnese.map(a => a.category))].sort();

  const filtered = selectedCategory === 'all' ? anamnese : anamnese.filter(a => a.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(6,182,212,0.15)' }}>
          <ListChecks size={18} style={{ color: '#06b6d4' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>Anamnese Practice</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{anamnese.length} structured history-taking prompts</p>
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ backgroundColor: selectedCategory === 'all' ? '#06b6d4' : 'var(--bg-card)', color: selectedCategory === 'all' ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            All ({anamnese.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ backgroundColor: selectedCategory === cat ? '#06b6d4' : 'var(--bg-card)', color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {cat} ({anamnese.filter(a => a.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {anamnese.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading anamnese data...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No prompts found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>
                    {item.category}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.doctorQuestion.substring(0, 60)}{item.doctorQuestion.length > 60 ? '...' : ''}
                  </span>
                </div>
                {expanded[item.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[item.id] && (
                <div className="p-3 space-y-2">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#06b6d4' }}>Doctor question:</span> {item.doctorQuestion}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>In English:</span> {item.simpleEnglish}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#3bff9e' }}>Patient might say:</span> {item.patientPossibleAnswer}
                  </p>
                  {item.followUpQuestions && item.followUpQuestions.length > 0 && (
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#f59e0b' }}>Follow-up questions:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {item.followUpQuestions.map((q, i) => (
                          <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs mt-1 p-2 rounded" style={{ backgroundColor: 'rgba(245,158,11,0.08)', color: 'var(--text-secondary)' }}>
                      {item.notes}
                    </p>
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
