import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import {
  User, LogIn, LogOut, Upload, Download, AlertTriangle, CheckCircle,
  Loader2, CloudOff, KeyRound, Mail, RefreshCw, ArrowLeft
} from 'lucide-react';

const PROGRESS_KEY = 'deutsch_klinik_state';
const SETTINGS_KEYS = [
  'deutsch_klinik_study_goal',
  'deutsch_klinik_vocab_filters',
  'deutsch_klinik_dashboard_collapsed',
];

function getLocalSettings() {
  const settings = {};
  for (const key of SETTINGS_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) settings[key] = JSON.parse(raw);
    } catch {
      // skip corrupted keys
    }
  }
  return settings;
}

function getLocalProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setLocalProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to write local progress.', e);
  }
}

function setLocalSettings(settings) {
  if (!settings || typeof settings !== 'object') return;
  for (const key of Object.keys(settings)) {
    if (SETTINGS_KEYS.includes(key)) {
      try {
        localStorage.setItem(key, JSON.stringify(settings[key]));
      } catch {
        // skip
      }
    }
  }
}

/**
 * Quick hash of serialized progress + settings to detect real changes.
 */
function computeSnapshotHash() {
  const progress = getLocalProgress();
  const settings = getLocalSettings();
  const raw = JSON.stringify({ p: progress, s: settings });
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

/**
 * Debounced auto-sync: listens for progress changes and uploads after a quiet period.
 * Tracks last uploaded hash; skips if nothing changed since last upload.
 */
function useAutoSync(session, conflict, isManualOperation) {
  const timerRef = useRef(null);
  const lastUploadedHashRef = useRef(null);
  const [autoSyncState, setAutoSyncState] = useState('idle'); // idle | saving | saved | failed

  const doUpload = useCallback(async () => {
    if (!session?.user?.id) return;
    if (conflict) return; // don't auto-sync if conflict is pending

    const progress = getLocalProgress();
    if (!progress) return;

    const currentHash = computeSnapshotHash();
    if (currentHash === lastUploadedHashRef.current) return; // nothing changed

    setAutoSyncState('saving');
    const settings = getLocalSettings();
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        progress,
        settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      setAutoSyncState('failed');
    } else {
      lastUploadedHashRef.current = currentHash;
      setAutoSyncState('saved');
      // Clear "saved" after a few seconds
      setTimeout(() => {
        setAutoSyncState(prev => prev === 'saved' ? 'idle' : prev);
      }, 4000);
    }
  }, [session, conflict]);

  // Listen for progress-changed events
  const syncEnabled = !!(session?.user?.id && !conflict);

  // Set up event listener when sync is active
  useEffect(() => {
    if (!syncEnabled) {
      // Reset state asynchronously via microtask to avoid cascading render
      queueMicrotask(() => setAutoSyncState('idle'));
      return;
    }

    const handler = () => {
      // Debounce: reset timer on each event
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        doUpload();
      }, 3000);
    };

    window.addEventListener('deutsch-klinik-progress-changed', handler);
    return () => {
      window.removeEventListener('deutsch-klinik-progress-changed', handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [syncEnabled, doUpload]);

  // Clear saved state after manual upload
  useEffect(() => {
    if (isManualOperation) {
      // After manual upload completes, update hash so auto-sync doesn't re-upload
      lastUploadedHashRef.current = computeSnapshotHash();
      // Reset asynchronously to avoid cascading render
      queueMicrotask(() => setAutoSyncState('idle'));
    }
  }, [isManualOperation]);

  return autoSyncState;
}

function autoSyncStatusLabel(state) {
  switch (state) {
    case 'saving': return 'Saving...';
    case 'saved': return 'Saved to cloud';
    case 'failed': return 'Auto-sync failed';
    default: return null;
  }
}

function autoSyncStatusColor(state) {
  switch (state) {
    case 'saving': return 'text-blue-400';
    case 'saved': return 'text-green-400';
    case 'failed': return 'text-yellow-400';
    default: return 'text-gray-500';
  }
}

/** Map Supabase error messages to friendlier text */
function friendlyAuthError(message) {
  if (!message) return 'Something went wrong.';
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid password') || m.includes('wrong password')) {
    return 'Wrong email or password.';
  }
  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) {
    return 'Email not confirmed. Check your inbox for the confirmation link.';
  }
  if (m.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (m.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (m.includes('rate limit') || m.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (m.includes('new email cannot be the same as old email')) {
    return 'That email is the same as your current one.';
  }
  return message;
}

export default function AuthPanel() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [cloudData, setCloudData] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [isManualOp, setIsManualOp] = useState(false);

  // Password reset state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Per-button loading states
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const enabled = isSupabaseEnabled();
  const autoSyncState = useAutoSync(session, conflict, isManualOp);

  // Clear message after 5s
  const flash = useCallback((msg) => {
    setMessage(msg);
    if (msg) setTimeout(() => setMessage(''), 5000);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setCloudData(null);
        setConflict(null);
        setSyncStatus('');
      }
    });
    return () => subscription?.unsubscribe();
  }, [enabled]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpLoading(true);
    setMessage('');
    setShowReset(false);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        flash(friendlyAuthError(error.message));
      } else if (data?.session) {
        // Session returned straight away (email confirmation disabled)
        setSession(data.session);
        setEmail('');
        setPassword('');
        setTimeout(() => checkCloudProgress(), 500);
      } else {
        // Email confirmation required
        flash('Account created. Check your email for a confirmation link before signing in.');
      }
    } catch (err) {
      flash(friendlyAuthError(err.message));
    }
    setSignUpLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInLoading(true);
    setMessage('');
    setShowReset(false);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        flash(friendlyAuthError(error.message));
      } else {
        setSession(data.session);
        setEmail('');
        setPassword('');
        setTimeout(() => checkCloudProgress(), 500);
      }
    } catch (err) {
      flash(friendlyAuthError(err.message));
    }
    setSignInLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setCloudData(null);
    setConflict(null);
    setSyncStatus('');
    setLoading(false);
    setShowReset(false);
    setResetSent(false);
    setResetEmail('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setMessage('');
    setResetSent(false);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + window.location.pathname,
      });
      if (error) {
        flash(friendlyAuthError(error.message));
      } else {
        setResetSent(true);
        flash('Password reset link sent. Check your email.');
      }
    } catch (err) {
      flash(friendlyAuthError(err.message));
    }
    setResetLoading(false);
  };

  function handleBackToSignIn() {
    setShowReset(false);
    setResetSent(false);
    setResetEmail('');
    setMessage('');
  }

  async function checkCloudProgress() {
    if (!session?.user?.id) return;
    setSyncStatus('Checking cloud...');
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    if (error) {
      setSyncStatus('Error checking cloud.');
      return;
    }
    if (data) {
      setCloudData(data);
      const local = getLocalProgress();
      if (local && Object.keys(local).length > 0) {
        setConflict({ cloud: data, local });
        setSyncStatus('Conflict found. Choose what to keep.');
      } else {
        setSyncStatus('Cloud progress found. Download available.');
      }
    } else {
      setCloudData(null);
      const local = getLocalProgress();
      if (local && Object.keys(local).length > 0) {
        setSyncStatus('No cloud progress yet. Upload your local data?');
      } else {
        setSyncStatus('No progress to sync yet.');
      }
    }
  }

  async function handleUpload() {
    if (!session?.user?.id) return;
    setIsManualOp(true);
    setLoading(true);
    setMessage('');

    const progress = getLocalProgress();
    if (!progress) {
      flash('No local progress found to upload.');
      setLoading(false);
      setIsManualOp(false);
      return;
    }

    const settings = getLocalSettings();
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        progress,
        settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      flash('Upload failed: ' + error.message);
    } else {
      flash('Progress uploaded successfully.');
      setSyncStatus('Local progress uploaded to cloud.');
      setConflict(null);
    }
    setLoading(false);
    setIsManualOp(false);
  }

  async function handleDownload() {
    if (!cloudData) return;
    if (!window.confirm('Download cloud progress? This will overwrite your current local progress.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    if (cloudData.progress && typeof cloudData.progress === 'object') {
      setLocalProgress(cloudData.progress);
    }
    if (cloudData.settings && typeof cloudData.settings === 'object') {
      setLocalSettings(cloudData.settings);
    }

    flash('Cloud progress downloaded. Refresh page to reload progress.');
    setSyncStatus('Cloud progress downloaded to local.');
    setConflict(null);
    setLoading(false);
  }

  // Conflict resolution actions
  async function handleKeepLocal() {
    await handleUpload();
  }

  function handleReplaceWithCloud() {
    if (!cloudData?.progress) return;
    setLocalProgress(cloudData.progress);
    if (cloudData.settings) setLocalSettings(cloudData.settings);
    flash('Cloud progress applied. Refresh page to reload progress.');
    setSyncStatus('Using cloud progress locally.');
    setConflict(null);
  }

  // If Supabase is not configured
  if (!enabled) {
    return (
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-850 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <CloudOff size={16} />
          <span>Cloud sync is not configured.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-850 text-sm">
      {/* Signed in state */}
      {session ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-400">
              <User size={16} />
              <span className="font-medium truncate max-w-[180px]">{session.user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          {/* Auto-sync status bar */}
          {autoSyncState !== 'idle' && (
            <div className={`flex items-center gap-2 text-xs ${autoSyncStatusColor(autoSyncState)}`}>
              {autoSyncState === 'saving' && <Loader2 size={14} className="animate-spin" />}
              {autoSyncState === 'saved' && <CheckCircle size={14} />}
              {autoSyncState === 'failed' && <AlertTriangle size={14} />}
              <span>{autoSyncStatusLabel(autoSyncState)}</span>
              {autoSyncState === 'failed' && (
                <span className="text-gray-500">(local progress saved)</span>
              )}
            </div>
          )}

          {/* Sync status */}
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            {syncStatus.includes('Checking') && <Loader2 size={14} className="animate-spin" />}
            {syncStatus.includes('Error') && <AlertTriangle size={14} className="text-yellow-400" />}
            {syncStatus.includes('uploaded') || syncStatus.includes('downloaded') || syncStatus.includes('applied') ? (
              <CheckCircle size={14} className="text-green-400" />
            ) : null}
            <span>{syncStatus || 'Not checked yet.'}</span>
            {syncStatus && syncStatus !== 'Checking cloud...' && !syncStatus.includes('Conflict') && (
              <button onClick={checkCloudProgress} className="text-blue-400 hover:text-blue-300 underline ml-1">
                <RefreshCw size={12} className="inline" /> Refresh
              </button>
            )}
          </div>

          {/* Conflict resolution */}
          {conflict && (
            <div className="border border-yellow-600 bg-yellow-900/20 rounded p-3 space-y-2">
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
                <AlertTriangle size={14} />
                Cloud and local data differ
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleKeepLocal}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                >
                  <Upload size={14} />
                  Keep local & upload
                </button>
                <button
                  onClick={handleReplaceWithCloud}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
                >
                  <Download size={14} />
                  Use cloud data
                </button>
              </div>
            </div>
          )}

          {/* Manual sync buttons */}
          {!conflict && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Upload local progress
              </button>
              {cloudData && (
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Download cloud progress
                </button>
              )}
            </div>
          )}

          {message && <p className="text-xs text-gray-300">{message}</p>}
        </div>
      ) : showReset ? (
        /* Password reset form */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <KeyRound size={16} />
              <span>Reset Password</span>
            </div>
            <button
              onClick={handleBackToSignIn}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
          {!resetSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-2">
              <p className="text-xs text-gray-400">Enter your email and we'll send you a password reset link.</p>
              <div className="relative">
                <Mail size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
              >
                {resetLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-green-400 text-xs">
              <CheckCircle size={14} />
              <span>Reset link sent. Check your email.</span>
            </div>
          )}
          {message && <p className="text-xs text-gray-300">{message}</p>}
        </div>
      ) : (
        /* Signed out state - login form */
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <KeyRound size={16} />
            <span>Cloud Sync</span>
          </div>
          <p className="text-xs text-gray-400">Sign in to sync your progress across devices.</p>
          <form onSubmit={handleSignIn} className="space-y-2">
            <div className="relative">
              <Mail size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
              minLength={6}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={signInLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
              >
                {signInLoading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                disabled={signUpLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors disabled:opacity-50"
              >
                {signUpLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-xs text-blue-400 hover:text-blue-300 underline ml-auto"
              >
                Forgot password?
              </button>
            </div>
          </form>
          {message && <p className="text-xs text-gray-300">{message}</p>}
        </div>
      )}
    </div>
  );
}
