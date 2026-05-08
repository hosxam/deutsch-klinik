import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { PageShell, SectionHeader, Card, Button, LevelBadge, LoadingState, ErrorState } from '../components/ui';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { getSupabase, isSupabaseConfigured } = await import('../lib/supabaseClient');
        if (isSupabaseConfigured()) {
          const sb = getSupabase();
          if (sb) {
            const { data: { user: u }, error: authErr } = await sb.auth.getUser();
            if (authErr) throw authErr;
            setUser(u || null);
          }
        } else {
          setError('Supabase is not configured. Cloud sync is unavailable.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load account information.');
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  function handleSignOut() {
    navigate('/');
  }

  return (
    <PageShell maxWidth="max-w-2xl">
      <SectionHeader
        title="Account"
        subtitle="Manage your profile and cloud sync"
        action={
          <Button onClick={() => navigate('/settings')} variant="secondary">
            Back to Settings
          </Button>
        }
      />

      {/* Cloud Sync */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Cloud Sync</h2>
        {loading ? (
          <LoadingState message="Checking auth state..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <AuthPanel onSignOut={handleSignOut} />
        )}
      </Card>
    </PageShell>
  );
}
