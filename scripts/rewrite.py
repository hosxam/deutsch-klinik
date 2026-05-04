#!/usr/bin/env python3
"""Rewrite listening/reading/writing/speaking sections of DailyMissionPage.jsx"""

import re, os

DIR = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(DIR, '..', 'src', 'pages', 'DailyMissionPage.jsx')

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# ===== 1. Add new state variables after compShow =====
old = '  const [compShow, setCompShow] = useState(false);'
new = '''  const [compShow, setCompShow] = useState(false);

  // Listening question state
  const [lrq, setLrq] = useState(0);
  const [lrc, setLrc] = useState(0);
  const [lra, setLra] = useState({});
  const [lrcorr, setLrcorr] = useState({});

  // Reading question state
  const [rrq, setRrq] = useState(0);
  const [rrc, setRrc] = useState(0);
  const [rra, setRra] = useState({});
  const [rrcorr, setRrcorr] = useState({});

  // Writing/speaking state
  const [writingPrompt, setWritingPrompt] = useState(null);
  const [speakingPrompt, setSpeakingPrompt] = useState(null);
  const [spRecBlob, setSpRecBlob] = useState(null);
  const [spRecState, setSpRecState] = useState('idle');
  const [ttsAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);'''

if old in content:
    content = content.replace(old, new)
    changes += 1
    print("1. Added new state variables")
else:
    print("1. FAILED - compShow not found")

# ===== 2. Add icon imports =====
old = 'SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight'
new = 'Volume2, Copy, AlertTriangle, SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight'

# Need to handle the existing import line
# Actually, find the import line and append new icons before it
import_line_pattern = re.compile(r'(\s+SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight\s+)')
if 'Volume2' not in content:
    content = content.replace('import {\n  CheckCircle, XCircle, BarChart3, BookOpen, FileText, PenTool, Mic,\n  SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight\n}', 
        'import {\n  CheckCircle, XCircle, BarChart3, BookOpen, FileText, PenTool, Mic,\n  SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight, Volume2, Copy, AlertTriangle\n}')
    changes += 1
    print("2. Added icons")
else:
    print("2. Skipped - icons already present")

# ===== 3. Add fullLesson state after lsDone =====
old = '  const [lsDone, setLsDone] = useState(false);'
new = '  const [lsDone, setLsDone] = useState(false);\n  const [fullLesson, setFullLesson] = useState(null);'
if old in content:
    content = content.replace(old, new)
    changes += 1
    print("3. Added fullLesson state")
else:
    print("3. FAILED - lsDone not found")

# ===== 4. Update hLs handler =====
old = '  const hLs = () => setLsStart(true);'
new = '''  const hLs = () => {
    const cm = getCm();
    if (cm?.nextLesson?.id) {
      try {
        const lessons = require('./data/germanLessons.json');
        const found = Array.isArray(lessons) ? lessons.find(l => l.id === cm.nextLesson.id) : null;
        if (found) setFullLesson(found);
      } catch(e) {}
    }
    setLsStart(true);
  };'''
if old in content:
    content = content.replace(old, new)
    changes += 1
    print("4. Updated hLs handler")
else:
    print("4. FAILED - hLs not found")

# ===== 5. Update lesson section to use fullLesson data =====
old_explan = """                {cm.nextLesson?.explanation && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--accent)' }}>Explanation:</strong>
                    <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{cm.nextLesson.explanation}</p>
                  </div>
                )}
                {cm.nextLesson?.examples?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Examples:</strong>
                    <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {cm.nextLesson.examples.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
                {cm.nextLesson?.grammarFocus && ("""

new_explan = """                {fullLesson?.explanation && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--accent)' }}>Explanation:</strong>
                    <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{fullLesson.explanation}</p>
                  </div>
                )}
                {fullLesson?.examples?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Examples:</strong>
                    <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {fullLesson.examples.slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
                {fullLesson?.grammarFocus && ("""

if old_explan in content:
    content = content.replace(old_explan, new_explan)
    changes += 1
    print("5. Updated lesson explanation/examples to use fullLesson")
else:
    print("5. FAILED - lesson explanation not found")

# ===== 6. Update grammarFocus and reviewSummary with vocab + guided practice =====
old_gram = """                {cm.nextLesson?.grammarFocus && (
                  <div style={{ background: 'rgba(245,158,11,0.1)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#f59e0b' }}>Grammar Focus: </strong><span style={{ color: 'var(--text-secondary)' }}>{cm.nextLesson.grammarFocus}</span>
                  </div>
                )}
                {cm.nextLesson?.reviewSummary && ("""

new_gram = """                {fullLesson?.grammarFocus && (
                  <div style={{ background: 'rgba(245,158,11,0.1)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#f59e0b' }}>Grammar Focus: </strong><span style={{ color: 'var(--text-secondary)' }}>{fullLesson.grammarFocus}</span>
                  </div>
                )}
                {/* Vocabulary */}
                {fullLesson?.vocabulary?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Key Vocabulary:</strong>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                      {fullLesson.vocabulary.slice(0, 6).map((v, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.4rem', background: i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent', borderRadius: '4px', marginBottom: '0.15rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{v.word}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{v.translation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Guided Practice */}
                {fullLesson?.guidedPractice?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Practice Questions:</strong>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                      {fullLesson.guidedPractice.slice(0, 3).map((p, i) => (
                        <div key={i} style={{ padding: '0.4rem 0.6rem', background: 'rgba(59,130,246,0.08)', borderRadius: '6px', marginBottom: '0.3rem' }}>
                          <p style={{ color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{p.prompt}</p>
                          <p style={{ color: '#059669', fontStyle: 'italic' }}>Answer: {p.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {fullLesson?.reviewSummary && ("""

if old_gram in content:
    content = content.replace(old_gram, new_gram)
    changes += 1
    print("6. Updated grammarFocus + added vocabulary/guided practice")
else:
    print("6. FAILED - grammarFocus not found")



# ===== SAVE interim result for next script =====
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nDone. {changes}/7 changes applied for lesson section. Saved interim file.")
