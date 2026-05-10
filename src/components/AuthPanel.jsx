import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import { mergeProgress, resetCloudProgress, resetLocalProgress, createProgressBackup, exportBackupAsJson } from '../utils/supabaseSync';
import { updateState } from '../utils/store';
import {
  User, LogIn, LogOut, Upload, Download, AlertTriangle, CheckCircle,
  Loader2, CloudOff, KeyRound, Mail, RefreshCw, ArrowLeft, Cloud
} from 'lucide-react';

function getActiveProfile() {
  try { return localStorage.getItem('dk_active_profile') || 'default'; } catch { return 'default'; }
}
function getStoreKey() {
  return 'deutsch_klinik_state_' + getActiveProfile();
}
const PROGRESS_KEY = getStoreKey;
const SYNC_META_KEY = 'deutsch_klinik_sync_meta';
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
    } catch {}
  }
  return settings;
}

function getLocalProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY());
    if (!raw) return null;
    const progress = JSON.parse(raw);
    // Merge separate practice progress key into payload for sync
    try {
      const practiceRaw = localStorage.getItem('practiceProgress_v1');
      if (practiceRaw) {
        const practiceData = JSON.parse(practiceRaw);
        if (typeof practiceData === 'object' && Object.keys(practiceData).length > 0) {
          progress.practiceProgress_v1 = practiceData;
        }
      }
    } catch {}
    return progress;
  } catch { return null; }
}

function setLocalProgress(progress) {
  try {
    // Extract separate practice progress key before writing main state
    if (progress && progress.practiceProgress_v1) {
      try {
        localStorage.setItem('practiceProgress_v1', JSON.stringify(progress.practiceProgress_v1));
      } catch {}
      // Remove from main payload to avoid double-storage (main state doesn't know about it)
      const { practiceProgress_v1, ...mainState } = progress;
      localStorage.setItem(PROGRESS_KEY(), JSON.stringify(mainState));
    } else {
      localStorage.setItem(PROGRESS_KEY(), JSON.stringify(progress));
    }
  } catch (e) {
    console.warn('Failed to write local progress.', e);
  }
}

function setLocalSettings(settings) {
  if (!settings || typeof settings !== 'object') return;
  for (const key of Object.keys(settings)) {
    if (SETTINGS_KEYS.includes(key)) {
      try { localStorage.setItem(key, JSON.stringify(settings[key])); } catch {}
    }
  }
}

function getSyncMeta() {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const meta = {};
      if (parsed.lastUploadAt) meta.lastUploadAt = parsed.lastUploadAt;
      if (parsed.lastUploadType === 'manual' || parsed.lastUploadType === 'auto') meta.lastUploadType = parsed.lastUploadType;
      if (parsed.lastDownloadAt) meta.lastDownloadAt = parsed.lastDownloadAt;
      if (parsed.lastErrorAt) meta.lastErrorAt = parsed.lastErrorAt;
      if (parsed.lastErrorMessage) meta.lastErrorMessage = String(parsed.lastErrorMessage).slice(0, 200);
      return Object.keys(meta).length > 0 ? meta : null;
    }
    return null;
  } catch { return null; }
}

function setSyncMeta(update) {
  if (!update || typeof update !== 'object') return;
  try {
    const current = getSyncMeta() || {};
    const merged = { ...current, ...update };
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(merged));
  } catch {}
}

function clearSyncMeta() {
  try { localStorage.removeItem(SYNC_META_KEY); } catch {}
}

function computeSnapshotHash() {
  const mainProgress = getLocalProgress();
  let practiceProgress = null;
  try {
    const raw = localStorage.getItem('practiceProgress_v1');
    if (raw) practiceProgress = JSON.parse(raw);
  } catch {}
  const settings = getLocalSettings();
  const raw = JSON.stringify({ p: mainProgress, pp: practiceProgress, s: settings });
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

function useAutoSync(session, conflict, isManualOperation, onMetaChange) {
  const timerRef = useRef(null);
  const lastUploadedHashRef = useRef(null);
  const [autoSyncState, setAutoSyncState] = useState('idle');

  const doUpload = useCallback(async () => {
    if (!session?.user?.id) return;
    if (conflict) return;

    const progress = getLocalProgress();
    if (!progress) return;

    const currentHash = computeSnapshotHash();
    if (currentHash === lastUploadedHashRef.current) return;

    setAutoSyncState('saving');
    const settings = getLocalSettings();
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        current_level: progress.currentLevel || 'A1',
        levels: progress.levels || {},
        payload: progress,
        settings,
        profile: getActiveProfile(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      setAutoSyncState('failed');
      const errMsg = friendlyAuthError(error.message);
      setSyncMeta({ lastErrorAt: new Date().toISOString(), lastErrorMessage: errMsg });
      onMetaChange?.(getSyncMeta());
    } else {
      lastUploadedHashRef.current = currentHash;
      setAutoSyncState('saved');
      setSyncMeta({ lastUploadAt: new Date().toISOString(), lastUploadType: 'auto' });
      onMetaChange?.(getSyncMeta());
      setTimeout(() => {
        setAutoSyncState(prev => prev === 'saved' ? 'idle' : prev);
      }, 4000);
    }
  }, [session, conflict, onMetaChange]);

  const syncEnabled = !!(session?.user?.id && !conflict);

  useEffect(() => {
    if (!syncEnabled) {
      queueMicrotask(() => setAutoSyncState('idle'));
      return;
    }
    const handler = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { doUpload(); }, 3000);
    };
    window.addEventListener('deutsch-klinik-progress-changed', handler);
    return () => {
      window.removeEventListener('deutsch-klinik-progress-changed', handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [syncEnabled, doUpload]);

  useEffect(() => {
    if (isManualOperation) {
      lastUploadedHashRef.current = computeSnapshotHash();
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

function formatTimeAgo(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return diffMins + 'm ago';
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return diffHrs + 'h ago';
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return diffDays + 'd ago';
    return formatDate(iso);
  } catch { return null; }
}

function formatTime(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today ' + formatTime(iso);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday ' + formatTime(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + formatTime(iso);
  } catch { return iso; }
}

function SyncHistory({ meta, onClear }) {
  if (!meta) return null;

  const items = [];
  if (meta.lastUploadAt) {
    const label = meta.lastUploadType === 'manual' ? 'Manual upload' : 'Auto-sync';
    items.push({ icon: Upload, label, time: formatDate(meta.lastUploadAt), color: 'text-green-400' });
  }
  if (meta.lastDownloadAt) {
    items.push({ icon: Download, label: 'Download', time: formatDate(meta.lastDownloadAt), color: 'text-blue-400' });
  }
  if (meta.lastErrorAt) {
    items.push({
      icon: AlertTriangle,
      label: 'Sync error',
      time: formatDate(meta.lastErrorAt),
      detail: meta.lastErrorMessage,
      color: 'text-yellow-400',
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="border-t border-gray-700 pt-2 mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500 font-medium">Sync History</span>
        <button
          onClick={onClear}
          className="text-xs text-gray-600 hover:text-gray-400"
          title="Clear sync history"
        >
          Clear
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <Icon size={12} className={`${item.color} mt-0.5 shrink-0`} />
              <div className="min-w-0">
                <span className="text-gray-400">{item.label}</span>
                {item.detail && <span className="text-gray-500"> - {item.detail}</span>}
                <span className="text-gray-600 ml-1">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

function hasMeaningfulData(progress) {
  if (!progress || typeof progress !== 'object') return false;
  if (progress.currentLevel) return true;
  if (progress.levels && Object.keys(progress.levels).length > 0) return true;
  if (progress.completedLessons && Object.keys(progress.completedLessons).length > 0) return true;
  return false;
}

export default function AuthPanel() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [cloudData, setCloudData] = useState(null);
  const [isManualOp, setIsManualOp] = useState(false);
  const [syncMeta, setSyncMetaState] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showProgressReset, setShowProgressReset] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetInProgress, setResetInProgress] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const enabled = isSupabaseEnabled();
  const autoSyncState = useAutoSync(session, null, isManualOp, setSyncMetaState);

  const flash = useCallback((msg) => {
    setMessage(msg);
    if (msg) setTimeout(() => setMessage(''), 5000);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        setSyncMetaState(getSyncMeta());
        checkCloudProgress(s);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        setSession(s);
        setSyncMetaState(getSyncMeta());
        checkCloudProgress(s);
      } else {
        setSession(null);
        setCloudData(null);
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
        setSession(data.session);
        setEmail('');
        setPassword('');
        setTimeout(() => checkCloudProgress(), 500);
      } else {
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

  /**
   * Cloud-first sync strategy:
   * For signed-in users, cloud progress is the default source of truth.
   *
   * Cases:
   * 1. Cloud has data, local is empty: download cloud, apply to local (first device)
   * 2. Cloud has data, local has data: cloud wins by default, backup local, download cloud
   * 3. No cloud data, local has data: auto-upload local to cloud (first time this user)
   * 4. Neither: nothing to do
   */
  async function checkCloudProgress(overrideSession) {
    const s = overrideSession || session;
    if (!s?.user?.id) return;

    setSyncStatus('Checking cloud...');

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', s.user.id)
      .maybeSingle();

    if (error) {
      setSyncStatus('Error checking cloud: ' + friendlyAuthError(error.message));
      return;
    }

    const localProgress = getLocalProgress();
    const cloudPayload = data ? (data.payload || data.progress || {}) : null;
    const hasLocal = hasMeaningfulData(localProgress);
    const hasCloud = hasMeaningfulData(cloudPayload);

    setCloudData(data);

    if (hasCloud) {
      // Cloud has data. Cloud is the source of truth.
      // Backup local before overwriting, in case user wants to restore.
      if (hasLocal) {
        try {
          localStorage.setItem('dk_sync_backup', JSON.stringify({
            timestamp: new Date().toISOString(),
            progress: localProgress,
          }));
        } catch {}
      }

      // Apply cloud progress to local
      setLocalProgress(cloudPayload);
      updateState(cloudPayload);

      if (data.settings) {
        setLocalSettings(data.settings);
      }

      setSyncStatus('Cloud progress active. Your progress syncs across devices.');
      setSyncMeta({ lastDownloadAt: new Date().toISOString() });
      setSyncMetaState(getSyncMeta());

      flash('Cloud progress loaded.');

      // Reload page so all components re-initialize from fresh localStorage.
      // Without this, components like Dashboard that grab state once via
      // useState(getState()) would still show old default data.
      if (!hasLocal) {
        // Only reload when this is the first download (empty local + existing cloud)
        setTimeout(() => window.location.reload(), 1000);
      }

    } else if (hasLocal) {
      // No cloud data, has local. First-time upload.
      const payload = { ...localProgress };
      try {
        const onboardingRaw = localStorage.getItem('dk_onboarding');
        if (onboardingRaw) payload._onboarding = JSON.parse(onboardingRaw);
      } catch {}

      const { error: uploadError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: s.user.id,
          current_level: localProgress.currentLevel || 'A1',
          levels: localProgress.levels || {},
          payload,
          settings: getLocalSettings(),
          profile: getActiveProfile(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (!uploadError) {
        setSyncStatus('Cloud progress active. Your progress syncs across devices.');
        setSyncMeta({ lastUploadAt: new Date().toISOString(), lastUploadType: 'auto' });
        setSyncMetaState(getSyncMeta());
      } else {
        setSyncStatus('Could not upload local progress to cloud. ' + friendlyAuthError(uploadError.message));
      }
    } else {
      // Neither has data
      setSyncStatus('No progress yet. Sign in to sync across devices.');
    }
  }

  async function handleUpload() {
    if (!session?.user?.id) return;
    setIsManualOp(true);
    setLoading(true);
    setMessage('');

    let progress = getLocalProgress();
    if (!progress) {
      flash('No local progress found to upload.');
      setLoading(false);
      setIsManualOp(false);
      return;
    }
    progress = { ...progress };
    try {
      const onboardingRaw = localStorage.getItem('dk_onboarding');
      if (onboardingRaw) progress._onboarding = JSON.parse(onboardingRaw);
    } catch {}

    const settings = getLocalSettings();
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        current_level: progress.currentLevel || 'A1',
        levels: progress.levels || {},
        payload: progress,
        settings,
        profile: getActiveProfile(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      flash('Upload failed: ' + error.message);
      setSyncMeta({ lastErrorAt: new Date().toISOString(), lastErrorMessage: friendlyAuthError(error.message) });
      setSyncMetaState(getSyncMeta());
    } else {
      flash('Progress uploaded successfully.');
      setSyncStatus('Cloud progress active. Your progress syncs across devices.');
      setSyncMeta({ lastUploadAt: new Date().toISOString(), lastUploadType: 'manual' });
      setSyncMetaState(getSyncMeta());
    }
    setLoading(false);
    setIsManualOp(false);
  }

  async function handleDownload() {
    if (!cloudData) return;
    if (!window.confirm('Download cloud progress? This will overwrite your current local progress. Your local data will be backed up.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    const cloudPayload = cloudData.payload || cloudData.progress || {};
    if (typeof cloudPayload === 'object' && Object.keys(cloudPayload).length > 0) {
      setLocalProgress(cloudPayload);
      updateState(cloudPayload);
    }
    if (cloudData.settings && typeof cloudData.settings === 'object') {
      setLocalSettings(cloudData.settings);
    }

    flash('Cloud progress downloaded. Reloading to apply...');
    setSyncStatus('Cloud progress active. Your progress syncs across devices.');
    setSyncMeta({ lastDownloadAt: new Date().toISOString() });
    setSyncMetaState(getSyncMeta());
    setLoading(false);
    // Reload so all components re-initialize from fresh localStorage
    setTimeout(() => window.location.reload(), 1000);
  }

  async function handleResetCloud() {
    setResetInProgress(true);
    setMessage('');

    try {
      // Backup local first via the utility (also creates dk_reset_backup)
      createProgressBackup('cloud-reset');

      // Reset cloud (overwrites with clean default payload)
      const result = await resetCloudProgress(supabase);

      if (result.success) {
        // Clear local progress entirely and reboot to default state
        resetLocalProgress();

        // Clear component state
        setCloudData(null);
        setSyncStatus('Progress reset. Sign in to start fresh.');
        setSyncMetaState(null);
        clearSyncMeta();
        setResetConfirmText('');
        setResetDone(true);

        flash('Cloud and local progress have been reset. Restart onboarding to set your goals.');

        // Force reload so store initializes from scratch
        setTimeout(() => window.location.reload(), 1500);
      } else {
        flash('Reset failed: ' + (result.errors || ['Unknown error']).join(', '));
      }
    } catch (err) {
      flash('Reset failed: ' + err.message);
    }
    setResetInProgress(false);
  }

  async function handleResetLocal() {
    setResetInProgress(true);
    setMessage('');

    try {
      const result = resetLocalProgress();
      if (result.success) {
        setCloudData(null);
        setSyncStatus('');
        setSyncMetaState(null);
        clearSyncMeta();
        flash('Local progress has been reset. Page will reload to start fresh.');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      flash('Reset failed: ' + err.message);
    }
    setResetInProgress(false);
  }

  async function handleMerge() {
    if (!cloudData) return;
    setIsManualOp(true);
    setLoading(true);
    setMessage('');

    const cloudPayload = cloudData.payload || cloudData.progress || {};
    const local = getLocalProgress();
    const merged = mergeProgress(local, cloudPayload);

    // Backup local
    try {
      if (local) {
        localStorage.setItem('dk_sync_backup', JSON.stringify({
          timestamp: new Date().toISOString(),
          progress: local,
        }));
      }
    } catch {}

    // Save merged locally
    setLocalProgress(merged);
    updateState(merged);

    // Upload merged to cloud
    if (cloudData.settings) setLocalSettings(cloudData.settings);

    const settings = getLocalSettings();
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        current_level: merged.currentLevel || 'A1',
        levels: merged.levels || {},
        payload: merged,
        settings,
        profile: getActiveProfile(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (!error) {
      flash('Progress merged and uploaded.');
      setSyncStatus('Cloud progress active. Your progress syncs across devices.');
      setSyncMeta({ lastUploadAt: new Date().toISOString(), lastUploadType: 'manual' });
      setSyncMetaState(getSyncMeta());
    } else {
      flash('Merge saved locally but upload failed: ' + error.message);
    }
    setLoading(false);
    setIsManualOp(false);
  }

  if (!enabled) {
    return (
      <div className="border border-gray-700 rounded-lg p-4 text-sm" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.06))' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 text-gray-100 font-semibold">
              <CloudOff size={16} className="text-green-400" />
              <span>Account and progress</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Continue locally today. Account sync will turn on when Supabase is configured.
            </p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full border border-green-500/30 text-green-300 bg-green-500/10">
            Local mode
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-left text-green-200"
          >
            <span className="block text-sm font-semibold">Continue locally</span>
            <span className="block text-xs text-green-100/70 mt-0.5">Local mode active. Your progress is saved on this device.</span>
          </button>
          <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2">
            <div className="flex gap-2 mb-2">
              <button type="button" disabled className="flex-1 rounded-md bg-gray-800 px-2 py-1.5 text-xs text-gray-500 cursor-not-allowed">
                Sign in
              </button>
              <button type="button" disabled className="flex-1 rounded-md bg-gray-800 px-2 py-1.5 text-xs text-gray-500 cursor-not-allowed">
                Sign up
              </button>
            </div>
            <input disabled placeholder="Email" className="mb-2 w-full rounded-md border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-gray-500" />
            <input disabled placeholder="Password" type="password" className="w-full rounded-md border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-gray-500" />
          </div>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
          <p className="text-xs text-blue-100">
            Account sync is not connected yet. You can continue locally now; sign-in will be enabled when Supabase is configured.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Local mode saves progress on this device. Account mode will sync lessons, goals, mistakes, flashcards, and exam results across devices when enabled.
          </p>
        </div>

        {/* Local-only reset */}
        {!showProgressReset ? (
          <div className="border-t border-red-800/40 pt-3 mt-3">
            <p className="text-xs text-gray-500 mb-2 font-medium">Danger Zone</p>
            <button
              onClick={() => { setShowProgressReset(true); setResetDone(false); setResetConfirmText(''); }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-800/50 hover:bg-red-700/60 text-red-300 rounded transition-colors"
            >
              <AlertTriangle size={14} />
              Reset local progress
            </button>
          </div>
        ) : resetDone ? (
          <div className="border-t border-red-800/40 pt-3 mt-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <div className="flex items-center gap-2 text-green-300 text-xs font-medium mb-1">
                <CheckCircle size={14} />
                <span>Local progress reset complete</span>
              </div>
              <p className="text-xs text-green-200/70">
                Your local progress has been reset. Restart onboarding to set up your goals.
              </p>
              <button
                onClick={() => { setShowProgressReset(false); setResetDone(false); setResetConfirmText(''); }}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-red-800/40 pt-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-red-400 font-medium">Reset Local Progress</p>
              <button
                onClick={() => { setShowProgressReset(false); setResetConfirmText(''); }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            </div>
            <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-3 space-y-2">
              <p className="text-xs text-red-200">
                This will delete your saved learning progress (lessons, vocabulary, flashcards, mistakes, and goals) from this device.
              </p>
              <ul className="text-xs text-red-200/70 list-disc pl-4 space-y-0.5">
                <li>Your curriculum data will NOT be affected.</li>
                <li>A backup snapshot will be saved on this device before resetting.</li>
                <li>This cannot be undone once the page reloads.</li>
              </ul>
              {(function() {
                const raw = exportBackupAsJson();
                if (raw) {
                  try {
                    const p = JSON.parse(raw);
                    const when = p.timestamp ? new Date(p.timestamp).toLocaleString() : 'unknown';
                    return (
                      <div className="mt-2 p-2 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400">
                        <p>Existing backup found (created: {when})</p>
                      </div>
                    );
                  } catch {}
                }
                return null;
              })()}
              <div className="pt-1">
                <label className="block text-xs text-red-300 mb-1">
                  Type <span className="font-mono font-bold">RESET</span> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="Type RESET to confirm"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-gray-800 border border-red-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleResetLocal}
                    disabled={resetConfirmText !== 'RESET' || resetInProgress}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {resetInProgress ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                    {resetInProgress ? 'Resetting...' : 'Confirm Reset'}
                  </button>
                  <button
                    onClick={() => { setShowProgressReset(false); setResetConfirmText(''); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-850 text-sm">
      {session ? (
        <div className="space-y-3">
          {/* User info header */}
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

          {/* Cloud active status banner */}
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/8 p-3">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-medium mb-1">
              <Cloud size={14} />
              <span>Cloud progress is active</span>
            </div>
            <p className="text-xs text-blue-200/70">
              Your progress syncs across devices. Any changes you make here are automatically saved to the cloud.
            </p>
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

          {/* Last synced summary */}
          {autoSyncState === 'idle' && syncMeta?.lastUploadAt && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CheckCircle size={12} className="text-green-500/70" />
              <span>Last saved: {formatDate(syncMeta.lastUploadAt)}</span>
            </div>
          )}
          {autoSyncState === 'idle' && syncMeta?.lastDownloadAt && !syncMeta?.lastUploadAt && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Download size={12} className="text-blue-500/70" />
              <span>Last downloaded: {formatDate(syncMeta.lastDownloadAt)}</span>
            </div>
          )}

          {/* Debug info */}
          {cloudData && (
            <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-2.5 text-[10px] leading-relaxed text-gray-400 font-mono">
              <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
                <span>Cloud debug info</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                <span>User:</span>
                <span className="text-gray-300 truncate">{session.user.email}</span>
                <span>User ID:</span>
                <span className="text-gray-300 text-[9px]">{session.user.id?.slice(0, 16)}...</span>
                <span>Payload size:</span>
                <span className="text-gray-300">
                  {cloudData?.payload
                    ? (new TextEncoder().encode(JSON.stringify(cloudData.payload)).length / 1024).toFixed(1) + ' KB'
                    : 'N/A'}
                </span>
                <span>Payload keys:</span>
                <span className="text-gray-300">
                  {cloudData?.payload
                    ? Object.keys(cloudData.payload).length.toString()
                    : '0'}
                </span>
                <span>Updated at:</span>
                <span className="text-gray-300">
                  {cloudData?.updated_at
                    ? formatDate(cloudData.updated_at)
                    : 'N/A'}
                </span>
                <span>Level:</span>
                <span className="text-gray-300">
                  {cloudData?.current_level || 'N/A'}
                </span>
                <span>Settings keys:</span>
                <span className="text-gray-300">
                  {cloudData?.settings
                    ? Object.keys(cloudData.settings).length.toString()
                    : '0'}
                </span>
              </div>
            </div>
          )}

          {/* Sync status */}
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            {syncStatus.includes('Checking') && <Loader2 size={14} className="animate-spin" />}
            {syncStatus.includes('Error') && <AlertTriangle size={14} className="text-yellow-400" />}
            {syncStatus.includes('active') && <CheckCircle size={14} className="text-green-400" />}
            <span>{syncStatus || 'Checking...'}</span>
            {syncStatus && !syncStatus.includes('Checking') && (
              <button onClick={checkCloudProgress} className="text-blue-400 hover:text-blue-300 underline ml-1">
                <RefreshCw size={12} className="inline" /> Refresh
              </button>
            )}
          </div>

          {/* Manual sync controls */}
          <div className="border-t border-gray-700 pt-2">
            <p className="text-xs text-gray-500 mb-2 font-medium">Manual actions</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Upload local to cloud
              </button>
              {cloudData && (
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Download cloud to device
                </button>
              )}
              {cloudData && (
                <button
                  onClick={handleMerge}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-700 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  Merge local with cloud
                </button>
              )}
            </div>
          </div>

          {message && <p className="text-xs text-gray-300">{message}</p>}

          <SyncHistory meta={syncMeta} onClear={() => { clearSyncMeta(); setSyncMetaState(null); }} />

          {/* --- Danger Zone: Progress Reset --- */}
          {!showProgressReset ? (
            <div className="border-t border-red-800/40 pt-3 mt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Danger Zone</p>
              <button
                onClick={() => { setShowProgressReset(true); setResetDone(false); setResetConfirmText(''); }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-800/50 hover:bg-red-700/60 text-red-300 rounded transition-colors"
              >
                <AlertTriangle size={14} />
                Reset cloud progress
              </button>
            </div>
          ) : resetDone ? (
            <div className="border-t border-red-800/40 pt-3 mt-4">
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                <div className="flex items-center gap-2 text-green-300 text-xs font-medium mb-1">
                  <CheckCircle size={14} />
                  <span>Progress reset complete</span>
                </div>
                <p className="text-xs text-green-200/70">
                  Your cloud and local progress have been reset. Restart onboarding to set up your goals.
                </p>
                <button
                  onClick={() => { setShowProgressReset(false); setResetDone(false); setResetConfirmText(''); }}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-red-800/40 pt-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-red-400 font-medium">Reset Cloud Progress</p>
                <button
                  onClick={() => { setShowProgressReset(false); setResetConfirmText(''); }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>
              <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-3 space-y-2">
                <p className="text-xs text-red-200">
                  This will delete your saved learning progress (lessons, vocabulary, flashcards, mistakes, exam results, and goals).
                </p>
                <ul className="text-xs text-red-200/70 list-disc pl-4 space-y-0.5">
                  <li>Your login and account will NOT be deleted.</li>
                  <li>Your curriculum data will NOT be affected.</li>
                  <li>A backup snapshot will be saved on this device before resetting.</li>
                  <li>This cannot be undone from the cloud once processed.</li>
                </ul>
                {(function() {
                  const backupRaw = exportBackupAsJson();
                  if (backupRaw) {
                    try {
                      const parsed = JSON.parse(backupRaw);
                      const when = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString() : 'unknown';
                      const label = parsed.label || 'unknown';
                      return (
                        <div className="mt-2 p-2 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400">
                          <p>Existing backup found (label: {label}, created: {when})</p>
                        </div>
                      );
                    } catch {}
                  }
                  return null;
                })()}
                <div className="pt-1">
                  <label className="block text-xs text-red-300 mb-1">
                    Type <span className="font-mono font-bold">RESET</span> to confirm:
                  </label>
                  <input
                    type="text"
                    placeholder="Type RESET to confirm"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-gray-800 border border-red-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleResetCloud}
                      disabled={resetConfirmText !== 'RESET' || resetInProgress}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {resetInProgress ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                      {resetInProgress ? 'Resetting...' : 'Confirm Reset'}
                    </button>
                    <button
                      onClick={() => { setShowProgressReset(false); setResetConfirmText(''); }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {message && <p className="text-xs text-gray-300 mt-2">{message}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : showReset ? (
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
              <p className="text-xs text-gray-400">Enter your email and we will send you a password reset link.</p>
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