import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { getSupabase, isSupabaseConfigured } = await import('../lib/supabaseClient');
        if (isSupabaseConfigured()) {
          const sb = getSupabase();
          if (sb) {
            const { data: { user: u } } = await sb.auth.getUser();
            setUser(u || null);
          }
        }
      } catch {
        // supabase not available
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  function handleSignOut() {
    navigate('/');
  }

  return (
    <div className="min-h-screen p-6" style={{ background: '#060912', color: '#f8fbff' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Account</h1>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: '#1a1f2e', color: '#8b9dc3' }}
          >
            Back to Settings
          </button>
        </div>

        <div className="rounded-xl p-6 mb-6" style={{ background: '#0d1121', border: '1px solid #1e2740' }}>
          <h2 className="text-lg font-semibold mb-4">Cloud Sync</h2>
          {loading ? (
            <p className="text-sm" style={{ color: '#6b7280' }}>Checking auth state...</p>
          ) : (
            <AuthPanel onSignOut={handleSignOut} />
          )}
        </div>
      </div>
    </div>
  );
}
