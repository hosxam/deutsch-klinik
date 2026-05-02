import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getState, updateState } from '../utils/store';
import speakingData from '../data/speaking.json';
import {
  Mic, Square, Clock, Lightbulb, Copy, ClipboardCheck,
  Sparkles, Loader2, AlertCircle, CheckCircle2, XCircle,
  Play, StopCircle, Volume2, FileText, MessageSquare
} from 'lucide-react';
import LevelLock from '../components/LevelLock';
import { correctSpeaking, isSpeakingCorrectionEnabled } from '../utils/aiCorrection';

export default function SpeakingPage() {
  const { levelId } = useParams();
  const prompts = speakingData[levelId] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('ready'); // ready | prep | talk | done
  const [prepTime, setPrepTime] = useState(0);
  const [talkTime, setTalkTime] = useState(0);
  const [prepTimer, setPrepTimer] = useState(null);
  const [talkTimer, setTalkTimer] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);

  // AI feedback state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  // Transcript state
  const [transcript, setTranscript] = useState('');

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechSupported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Audio recording state (local only, never uploaded)
  const [audioRecorderState, setAudioRecorderState] = useState('idle'); // idle | recording | recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioSupported = typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  const prompt = prompts[currentIndex];
  const speakingEnabled = isSpeakingCorrectionEnabled();

  useEffect(() => {
    const s = getState();
    setRecordings(s.speakingRecordings[levelId] || []);
  }, [levelId]);

  useEffect(() => {
    return () => {
      if (prepTimer) clearInterval(prepTimer);
      if (talkTimer) clearInterval(talkTimer);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [prepTimer, talkTimer]);

  // --- Timer ---

  const startPrep = () => {
    setPhase('prep');
    setPrepTime(prompt.prepTime);
    const interval = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          setPrepTimer(null);
          startTalk();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setPrepTimer(interval);
  };

  const startTalk = () => {
    setPhase('talk');
    setTalkTime(prompt.talkTime);
    const interval = setInterval(() => {
      setTalkTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTalkTimer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTalkTimer(interval);
  };

  const done = () => {
    if (prepTimer) clearInterval(prepTimer);
    if (talkTimer) clearInterval(talkTimer);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
    // Save recording attempt
    const s = getState();
    const recs = s.speakingRecordings[levelId] || [];
    recs.push({ id: prompt.id, date: new Date().toISOString() });
    if (!s.speakingRecordings) s.speakingRecordings = {};
    s.speakingRecordings[levelId] = recs;
    updateState({ speakingRecordings: s.speakingRecordings });
    setRecordings(recs);

    // Reset AI state for new prompt
    setAiResult(null);
    setAiError(null);
    setPhase('done');
  };

  // --- Speech Recognition ---

  const startListening = () => {
    if (!speechSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript;
      }
      setTranscript(prev => prev + ' ');
      // Pick up the full transcript from results
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript;
      }
      setTranscript(full);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  };

  // --- Local Audio Recording (never uploaded) ---

  const startAudioRecording = async () => {
    if (!audioSupported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        setAudioRecorderState('recorded');
        // Stop all tracks so the mic icon goes away
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.current = recorder;
      recorder.start();
      setAudioRecorderState('recording');
    } catch (err) {
      console.warn('Microphone access denied:', err);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  };

  // --- AI Speaking Feedback ---

  const getSpeakingFeedback = async () => {
    if (!transcript.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const result = await correctSpeaking({
        level: levelId,
        task: prompt.prompt,
        transcript: transcript.trim(),
      });
      setAiResult(result);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // --- Reset all AI state when changing prompt ---

  const changePrompt = (index) => {
    setCurrentIndex(index);
    setPhase('ready');
    setTranscript('');
    setAiResult(null);
    setAiError(null);
    setAudioRecorderState('idle');
    setAudioUrl(null);
    setShowAiPrompt(false);
  };

  if (prompts.length === 0) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No speaking tasks for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

  return (
    <LevelLock levelId={levelId}>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <select onChange={(e) => changePrompt(Number(e.target.value))} value={currentIndex}
          className="px-3 py-1.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          {prompts.map((p, i) => (
            <option key={p.id} value={i}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Level {levelId} | Prep: {prompt.prepTime}s | Talk: {prompt.talkTime}s</div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--accent)' }}>{prompt.title}</h2>
        <p className="text-sm mb-4 break-words">{prompt.prompt}</p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{prompt.instructions}</p>

        {/* Tips */}
        <details className="mb-4">
          <summary className="text-sm cursor-pointer flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            <Lightbulb size={14} /> Tips & Useful Phrases
          </summary>
          <div className="mt-2 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>{prompt.tips}</p>
            {prompt.usefulPhrases?.map((p, i) => (
              <div key={i} className="py-1" style={{ color: 'var(--accent)' }}>{p}</div>
            ))}
          </div>
        </details>

        {/* Timer display */}
        {(phase === 'prep' || phase === 'talk') && (
          <div className="text-center mb-6">
            <div className="text-3xl font-bold" style={{ color: phase === 'prep' ? '#f59e0b' : '#ff3355' }}>
              {phase === 'prep' ? prepTime : talkTime}s
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {phase === 'prep' ? 'Preparation Time' : 'Speaking Time'}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {phase === 'ready' && (
            <button onClick={startPrep} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              <Clock size={16} /> Start Preparation
            </button>
          )}
          {(phase === 'prep' || phase === 'talk') && (
            <button onClick={done} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: '#ff3355', color: '#fff' }}>
              <Square size={16} /> Stop & Complete
            </button>
          )}
        </div>
      </div>

      {/* Recording attempts */}
      {recordings.length > 0 && (
        <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Completed Tasks ({recordings.length})</h3>
          <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {recordings.slice().reverse().map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mic size={12} style={{ color: '#3bff9e' }} />
                Completed: {r.date?.split('T')[0] || 'Unknown'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== POST-TALK SECTION ===== */}
      {phase === 'done' && (
        <div className="mt-6 space-y-4">

          {/* --- Transcript Box --- */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              <MessageSquare size={14} /> Your Spoken Answer Transcript
            </h3>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type or paste your spoken answer here..."
              rows={4}
              className="w-full p-3 rounded-lg text-sm outline-none resize-y"
              style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />

            {/* Speech Recognition */}
            {speechSupported ? (
              <div className="mt-2 flex gap-2">
                {!isListening ? (
                  <button onClick={startListening}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(59,255,158,0.1)', color: '#3bff9e', border: '1px solid #3bff9e' }}>
                    <Mic size={12} /> Start Speech Recognition
                  </button>
                ) : (
                  <button onClick={stopListening}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355', border: '1px solid #ff3355' }}>
                    <StopCircle size={12} /> Stop Recognition
                  </button>
                )}
                {isListening && (
                  <span className="text-xs flex items-center gap-1" style={{ color: '#3bff9e' }}>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Listening...
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <AlertCircle size={12} className="inline mr-1" />
                Speech recognition is not supported in this browser. Type or paste your transcript instead.
              </p>
            )}
          </div>

          {/* --- Local Audio Recording --- */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              <Volume2 size={14} /> Record Your Answer (Local Only)
            </h3>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              Audio stays in your browser and is not sent to AI.
            </p>
            {audioSupported ? (
              <div className="flex gap-2 items-center">
                {audioRecorderState === 'idle' && (
                  <button onClick={startAudioRecording}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid #8b5cf6' }}>
                    <Mic size={12} /> Start Recording
                  </button>
                )}
                {audioRecorderState === 'recording' && (
                  <button onClick={stopAudioRecording}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355', border: '1px solid #ff3355' }}>
                    <StopCircle size={12} /> Stop Recording
                  </button>
                )}
                {audioRecorderState === 'recording' && (
                  <span className="text-xs flex items-center gap-1" style={{ color: '#ff3355' }}>
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Recording...
                  </span>
                )}
                {audioUrl && (
                  <div className="flex items-center gap-2">
                    <audio src={audioUrl} controls className="h-8 rounded" />
                    <button
                      onClick={() => { setAudioUrl(null); setAudioRecorderState('idle'); }}
                      className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <AlertCircle size={12} className="inline mr-1" />
                Audio recording is not supported in this browser.
              </p>
            )}
          </div>

          {/* --- Get Speaking Feedback Button --- */}
          <div className="text-center">
            {speakingEnabled ? (
              <button
                onClick={getSpeakingFeedback}
                disabled={aiLoading || !transcript.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-lg mx-auto disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                {aiLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles size={16} /> Get Speaking Feedback</>
                )}
              </button>
            ) : (
              <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid #f59e0b' }}>
                <p className="text-xs flex items-center gap-1" style={{ color: '#f59e0b' }}>
                  <AlertCircle size={12} />
                  Live speaking feedback is not configured yet. Type or paste your transcript and use a manual AI tool instead.
                </p>
              </div>
            )}
          </div>

          {/* --- Error State --- */}
          {aiError && (
            <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,51,85,0.08)', border: '1px solid #ff3355' }}>
              <div className="flex items-start gap-2">
                <XCircle size={16} style={{ color: '#ff3355', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#ff3355' }}>Feedback Failed</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{aiError}</p>
                </div>
              </div>
            </div>
          )}

          {/* --- Results Panel --- */}
          {aiResult && (
            <div className="rounded-xl p-5 space-y-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {/* Score */}
              <div className="text-center">
                <div className="text-4xl font-bold" style={{
                  color: aiResult.score >= 7 ? '#3bff9e' : aiResult.score >= 4 ? '#f59e0b' : '#ff3355'
                }}>
                  {aiResult.score}/10
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Speaking Score</div>
              </div>

              {/* Rubric */}
              {aiResult.rubric && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Rubric Breakdown</h4>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(aiResult.rubric).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-medium capitalize min-w-[120px]" style={{ color: 'var(--text-secondary)' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span style={{ color: 'var(--text-primary)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mistakes */}
              {aiResult.mistakes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Mistakes</h4>
                  <div className="space-y-2">
                    {aiResult.mistakes.map((m, i) => (
                      <div key={i} className="p-3 rounded-lg text-xs space-y-1" style={{ backgroundColor: 'rgba(255,51,85,0.06)' }}>
                        <div><span style={{ color: '#ff3355' }}>{m.original}</span>
                          {' \u2192 '}
                          <span style={{ color: '#3bff9e' }}>{m.corrected}</span>
                        </div>
                        {m.explanation && <div style={{ color: 'var(--text-secondary)' }}>{m.explanation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Better Phrases */}
              {aiResult.betterPhrases && aiResult.betterPhrases.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Better Phrases</h4>
                  <div className="space-y-2">
                    {aiResult.betterPhrases.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg text-xs space-y-1" style={{ backgroundColor: 'rgba(245,158,11,0.06)' }}>
                        <div><span style={{ color: 'var(--text-secondary)' }}>Original:</span> {p.original}</div>
                        <div><span style={{ color: '#3bff9e' }}>Better:</span> {p.better}</div>
                        {p.explanation && <div style={{ color: 'var(--text-muted)' }}>{p.explanation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrected Transcript */}
              {aiResult.correctedTranscript && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Corrected Transcript</h4>
                  <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    {aiResult.correctedTranscript}
                  </div>
                </div>
              )}

              {/* Stronger Answer */}
              {aiResult.strongerAnswer && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Stronger Answer</h4>
                  <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(59,255,158,0.06)', border: '1px solid rgba(59,255,158,0.2)' }}>
                    {aiResult.strongerAnswer}
                  </div>
                </div>
              )}

              {/* Phrases to Memorize */}
              {aiResult.phrasesToMemorize && aiResult.phrasesToMemorize.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Phrases to Memorize</h4>
                  <div className="space-y-1.5">
                    {aiResult.phrasesToMemorize.map((f, i) => (
                      <div key={i} className="p-2 rounded-lg text-xs flex gap-2" style={{ backgroundColor: 'var(--bg-hover)' }}>
                        <span style={{ color: 'var(--accent)' }}>{f.german}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{f.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success indicator */}
              <div className="flex items-center gap-1 text-xs justify-center" style={{ color: '#3bff9e' }}>
                <CheckCircle2 size={12} /> Speaking feedback complete
              </div>
            </div>
          )}

          {/* --- Copy Prompt Fallback --- */}
          <div className="text-center space-y-3">
            <div>
              <button onClick={() => setShowAiPrompt(!showAiPrompt)} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid #8b5cf6' }}>
                {showAiPrompt ? 'Hide' : 'Copy prompt for AI correction'}
              </button>
              {showAiPrompt && (
                <div className="mt-2 rounded-xl p-3 text-left" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid #8b5cf6' }}>
                  <textarea readOnly value={`I practiced this German speaking task. Identify grammar mistakes, vocabulary mistakes, and sentence structure problems based on the topic. My level is ${levelId}. The task was: ${prompt.prompt}. My spoken answer was: ${transcript || '(transcript not provided)'}. Please give me a corrected sample response at my level.`} rows={5}
                    className="w-full p-2 rounded-lg text-xs outline-none resize-none"
                    style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  <button onClick={() => { navigator.clipboard.writeText(`I practiced this German speaking task. Identify grammar mistakes, vocabulary mistakes, and sentence structure problems based on the topic. My level is ${levelId}. The task was: ${prompt.prompt}. My spoken answer was: ${transcript || '(transcript not provided)'}. Please give me a corrected sample response at my level.`); setAiCopied(true); setTimeout(() => setAiCopied(false), 2000); }}
                    className="mt-1 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
                    {aiCopied ? <><ClipboardCheck size={12} /> Copied!</> : <><Copy size={12} /> Copy to clipboard</>}
                  </button>
                </div>
              )}
            </div>
            <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              Back to Level
            </Link>
          </div>
        </div>
      )}
    </div>
    </LevelLock>
  );
}
