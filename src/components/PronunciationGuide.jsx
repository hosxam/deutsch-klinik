import { useState, useEffect, useRef } from 'react';
import { Volume2, ChevronDown, ChevronUp, AlertTriangle, Play } from 'lucide-react';

const TTS_AVAILABLE = typeof window !== 'undefined' && 'speechSynthesis' in window;
const GERMAN_VOICE_LANG = 'de-DE';

function getGermanVoice() {
  if (!TTS_AVAILABLE) return null;
  const voices = window.speechSynthesis.getVoices();
  // Prefer a German-specific voice
  const germanVoice = voices.find(v => v.lang.startsWith(GERMAN_VOICE_LANG));
  return germanVoice || null;
}

function speak(word, cb) {
  if (!TTS_AVAILABLE) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = GERMAN_VOICE_LANG;
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  const germanVoice = getGermanVoice();
  if (germanVoice) {
    utterance.voice = germanVoice;
  }
  window.speechSynthesis.speak(utterance);
  if (cb && typeof cb === 'function') {
    utterance.onend = cb;
  }
}

export default function PronunciationGuide({ guide, fallbackText, accentColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [playingWord, setPlayingWord] = useState(null);
  const voicesLoaded = useRef(false);

  useEffect(() => {
    // Ensure voices are loaded (they load async in Chrome)
    if (!TTS_AVAILABLE) return;
    if (!voicesLoaded.current) {
      window.speechSynthesis.getVoices();
    }
    const handler = () => {
      voicesLoaded.current = true;
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
  }, []);

  if (!guide) {
    if (!fallbackText) return null;
    return (
      <div
        className="rounded-xl p-4 mb-6"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <AlertTriangle size={14} />
          {fallbackText}
        </div>
      </div>
    );
  }

  const handleListen = (word) => {
    // Cancel any ongoing speech
    if (TTS_AVAILABLE) {
      window.speechSynthesis.cancel();
    }
    setPlayingWord(word);
    speak(word, () => setPlayingWord(null));
  };

  const accent = accentColor || 'var(--accent)';

  return (
    <div
      className="rounded-xl overflow-hidden mb-6"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{
          color: 'var(--text-primary)',
          cursor: 'pointer',
          border: 'none',
          backgroundColor: 'transparent',
        }}
      >
        <span className="text-sm font-semibold flex items-center gap-2" style={{ color: accent }}>
          <Volume2 size={16} /> Pronunciation Guide
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-2">
            {guide.words.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg p-3 transition-colors"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* German word */}
                    <div className="text-sm font-semibold flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-primary)' }}>
                      {item.word}
                      {item.meaning && (
                        <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                          {item.meaning}
                        </span>
                      )}
                    </div>

                    {/* Pronunciation hint */}
                    <div className="text-xs mt-1" style={{ color: accent }}>
                      {item.hint}
                    </div>

                    {/* Common mistake warning */}
                    {item.warning && (
                      <div
                        className="text-xs mt-1 px-2 py-0.5 rounded inline-block"
                        style={{
                          backgroundColor: 'rgba(255,215,0,0.1)',
                          color: '#ffd700',
                        }}
                      >
                        {item.warning}
                      </div>
                    )}
                  </div>

                  {/* Listen button */}
                  {TTS_AVAILABLE && (
                    <button
                      onClick={() => handleListen(item.word)}
                      disabled={playingWord === item.word}
                      className="flex-shrink-0 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: playingWord === item.word
                          ? `${accent}33`
                          : 'var(--bg-card)',
                        color: playingWord === item.word ? accent : 'var(--text-muted)',
                        border: `1px solid ${playingWord === item.word ? accent : 'var(--border)'}`,
                        cursor: 'pointer',
                      }}
                      title={`Listen to "${item.word}"`}
                    >
                      <Play size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { speak, getGermanVoice, TTS_AVAILABLE };
