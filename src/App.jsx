import { lazy, Suspense, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { getCurrentProfileName, getState } from './utils/store';
import { isOnboardingComplete } from './utils/onboardingState';
import LoginPage from './pages/LoginPage';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LevelPage = lazy(() => import('./pages/LevelPage'));
const GrammarPage = lazy(() => import('./pages/GrammarPage'));
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const ReadingPage = lazy(() => import('./pages/ReadingPage'));
const ListeningPage = lazy(() => import('./pages/ListeningPage'));
const WritingPage = lazy(() => import('./pages/WritingPage'));
const SpeakingPage = lazy(() => import('./pages/SpeakingPage'));
const ExamPage = lazy(() => import('./pages/ExamPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const MedicalPage = lazy(() => import('./pages/MedicalPage'));
const PlacementTest = lazy(() => import('./pages/PlacementTest'));
const FlashcardPage = lazy(() => import('./pages/FlashcardPage'));
const C1ReadinessPage = lazy(() => import('./pages/C1ReadinessPage'));
const DailyMissionPage = lazy(() => import('./pages/DailyMissionPage'));
const LessonsPage = lazy(() => import('./pages/LessonsPage'));
const LessonDetailPage = lazy(() => import('./pages/LessonDetailPage'));
const MistakeNotebookPage = lazy(() => import('./pages/MistakeNotebookPage'));
const MedicalFSPHubPage = lazy(() => import('./pages/MedicalFSPHubPage'));
const FSPVocabPage = lazy(() => import('./pages/FSPVocabPage'));
const FSPAnamnesePage = lazy(() => import('./pages/FSPAnamnesePage'));
const FSPCasesPage = lazy(() => import('./pages/FSPCasesPage'));
const FSPPresentationsPage = lazy(() => import('./pages/FSPPresentationsPage'));
const FSPWritingPage = lazy(() => import('./pages/FSPWritingPage'));
const FSPListeningPage = lazy(() => import('./pages/FSPListeningPage'));
const FSPReadingPage = lazy(() => import('./pages/FSPReadingPage'));
const FSPGrammarPage = lazy(() => import('./pages/FSPGrammarPage'));
const FSPExamPage = lazy(() => import('./pages/FSPExamPage'));
const PracticeHubPage = lazy(() => import('./pages/PracticeHubPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const GoalSetupPage = lazy(() => import('./pages/GoalSetupPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Routes that are allowed during onboarding (before onboardingComplete)
const ONBOARDING_ALLOWED = [
  '/onboarding',
  '/placement-test',
  '/goal-setup',
];

// Redirect old vocabulary practice route to flashcards
function VocabPracticeRedirect() {
  const { levelId } = useParams();
  return <Navigate to={`/level/${levelId}/vocabulary/flashcards`} replace />;
}

function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div role="status" aria-live="polite" aria-label="Loading page" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: 'var(--text-muted)',
      fontSize: '1.1rem',
      gap: '12px',
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span>Loading{dots}</span>
    </div>
  );
}

/**
 * RouteGuard: Protects routes based on onboarding state.
 * - No profile => LoginPage (handled by parent before this component)
 * - Not onboarded => redirect to /onboarding (except for onboarding-allowed routes)
 * - Onboarded but goal not set => redirect to /goal-setup
 * - Fully onboarded => allow all
 */
function RouteGuard({ children }) {
  const location = useLocation();
  const profile = getCurrentProfileName();

  // If no profile, this shouldn't render (parent checks), but safety guard
  if (!profile) return <Navigate to="/" replace />;

  // Safe read: handle corrupted localStorage (invalid JSON, null values, etc.)
  let state;
  try {
    state = getState();
    // Protect against null/undefined state
    if (!state || typeof state !== 'object') {
      state = {};
    }
  } catch {
    // localStorage missing or corrupted - treat as fresh user
    return <Navigate to="/onboarding" replace />;
  }

  // Safe read of onboarding flags with proper fallbacks
  const onboardingComplete = (() => {
    try {
      return state.onboardingComplete === true || isOnboardingComplete();
    } catch {
      return false;
    }
  })();

  const currentPath = location.pathname;

  // If onboarding is complete, allow all routes
  if (onboardingComplete) {
    return children;
  }

  // If NOT onboarded
  // Allow onboarding routes to render
  if (ONBOARDING_ALLOWED.includes(currentPath)) {
    return children;
  }

  // Everything else: redirect to onboarding
  return <Navigate to="/onboarding" replace />;
}

export default function App() {
  if (!getCurrentProfileName()) return <LoginPage />;

  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <Dashboard />
                </RouteGuard>
              </Suspense>
            } />

            {/* Onboarding routes (exempt from RouteGuard) */}
            <Route path="onboarding" element={
              <Suspense fallback={<Loading />}>
                <OnboardingPage />
              </Suspense>
            } />
            <Route path="placement-test" element={
              <Suspense fallback={<Loading />}>
                <PlacementTest />
              </Suspense>
            } />
            <Route path="goal-setup" element={
              <Suspense fallback={<Loading />}>
                <GoalSetupPage />
              </Suspense>
            } />

            {/* Settings - allowed only after onboarding */}
            <Route path="settings" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <SettingsPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="settings/account" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <AccountPage />
                </RouteGuard>
              </Suspense>
            } />

            {/* Protected routes */}
            <Route path="level/:levelId" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <LevelPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/grammar" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <GrammarPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/vocabulary" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <VocabularyPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/vocabulary/flashcards" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FlashcardPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/vocabulary/practice" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <VocabPracticeRedirect />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/reading" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <ReadingPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/listening" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <ListeningPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/writing" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <WritingPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/speaking" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <SpeakingPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/exam" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <ExamPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/lessons" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <LessonsPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/daily" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <DailyMissionPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="level/:levelId/lessons/:lessonId" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <LessonDetailPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="resources" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <ResourcesPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <MedicalPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="c1-readiness" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <C1ReadinessPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="practice" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <PracticeHubPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="mistake-notebook" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <MistakeNotebookPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <MedicalFSPHubPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/vocabulary" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPVocabPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/anamnese" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPAnamnesePage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/cases" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPCasesPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/presentations" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPPresentationsPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/writing" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPWritingPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/listening" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPListeningPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/reading" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPReadingPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/grammar" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPGrammarPage />
                </RouteGuard>
              </Suspense>
            } />
            <Route path="medical-fsp/exams" element={
              <Suspense fallback={<Loading />}>
                <RouteGuard>
                  <FSPExamPage />
                </RouteGuard>
              </Suspense>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
