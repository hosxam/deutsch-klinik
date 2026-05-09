import { useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { PageShell, SectionHeader, Card, Button } from '../components/ui';

export default function AccountPage() {
  const navigate = useNavigate();

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
        <AuthPanel />
      </Card>

      {/* Explanation */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">How It Works</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            Create an account or sign in to sync your progress across
            devices. Your completed lessons, vocabulary, flashcards,
            mistakes, and exam results are saved to the cloud.
          </p>
          <p>
            When signed in, changes save locally first then sync to the
            cloud automatically.
          </p>
          <p>
            When signed out, progress is saved only on this device.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
