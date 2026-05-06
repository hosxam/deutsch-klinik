import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, Search } from 'lucide-react';

export default function FSPVocabPage() {
  const [vocab, setVocab] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAnswer, setShowAnswer] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspVocabulary.json');
      setVocab(module.default || module);
    } catch {
      setVocab([]);
    }
  }

  const categories = [...new Set(vocab.map(v => v.category))].sort();

  const filtered = vocab.filter(v => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return v.word.toLowerCase().includes(q) || v.translation.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}>
          <BookOpen size={18} style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>FSP Medical Vocabulary</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{vocab.length} terms across 30+ categories</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search German or English..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {vocab.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading vocabulary data...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No vocabulary found for your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Category sections */}
          {selectedCategory === 'all' ? (
            categories.map(cat => {
              const catItems = filtered.filter(v => v.category === cat);
              if (catItems.length === 0) return null;
              return (
                <VocabSection key={cat} category={cat} items={catItems} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
              );
            })
          ) : (
            <VocabSection category={selectedCategory} items={filtered} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
          )}
        </div>
      )}
    </div>
  );
}

function VocabSection({ category, items, showAnswer, setShowAnswer }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="px-4 py-2.5 text-xs font-semibold" style={{ backgroundColor: 'var(--bg-hover)', color: '#3b82f6' }}>
        {category} ({items.length})
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {items.map(item => (
          <div key={item.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.article && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                      {item.article}
                    </span>
                  )}
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.word}</span>
                  {item.plural && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({item.plural})</span>
                  )}
                  <button
                    onClick={() => setShowAnswer(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className="ml-auto text-xs px-2 py-0.5 rounded transition-colors"
                    style={{ backgroundColor: showAnswer[item.id] ? 'var(--bg-hover)' : '#3b82f6', color: showAnswer[item.id] ? 'var(--text-muted)' : '#fff' }}
                  >
                    {showAnswer[item.id] ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.translation}</span>
                </div>
                {showAnswer[item.id] && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#3bff9e' }}>Patient-friendly:</span> {item.patientFriendlyPhrase}
                    </p>
                    {item.doctorToDoctorPhrase && (
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: '#8b5cf6' }}>Doctor-doctor:</span> {item.doctorToDoctorPhrase}
                      </p>
                    )}
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#f59e0b' }}>Lay explanation:</span> {item.layExplanation}
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Example:</span> {item.example}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.exampleTranslation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
