import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { getCurrentProfileName } from './utils/store';
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
const PracticePage = lazy(() => import('./pages/PracticePage'));
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


function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: 'var(--text-muted)',
      fontSize: '1.1rem',
    }}>
      Loading...
    </div>
  );
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
                <Dashboard />
              </Suspense>
            } />
            <Route path="level/:levelId" element={
              <Suspense fallback={<Loading />}>
                <LevelPage />
              </Suspense>
            } />
            <Route path="level/:levelId/grammar" element={
              <Suspense fallback={<Loading />}>
                <GrammarPage />
              </Suspense>
            } />
            <Route path="level/:levelId/vocabulary" element={
              <Suspense fallback={<Loading />}>
                <VocabularyPage />
              </Suspense>
            } />
            <Route path="level/:levelId/vocabulary/flashcards" element={
              <Suspense fallback={<Loading />}>
                <FlashcardPage />
              </Suspense>
            } />
            <Route path="level/:levelId/vocabulary/practice" element={
              <Suspense fallback={<Loading />}>
                <PracticePage />
              </Suspense>
            } />
            <Route path="level/:levelId/reading" element={
              <Suspense fallback={<Loading />}>
                <ReadingPage />
              </Suspense>
            } />
            <Route path="level/:levelId/listening" element={
              <Suspense fallback={<Loading />}>
                <ListeningPage />
              </Suspense>
            } />
            <Route path="level/:levelId/writing" element={
              <Suspense fallback={<Loading />}>
                <WritingPage />
              </Suspense>
            } />
            <Route path="level/:levelId/speaking" element={
              <Suspense fallback={<Loading />}>
                <SpeakingPage />
              </Suspense>
            } />
            <Route path="level/:levelId/exam" element={
              <Suspense fallback={<Loading />}>
                <ExamPage />
              </Suspense>
            } />
            <Route path="level/:levelId/lessons" element={
              <Suspense fallback={<Loading />}>
                <LessonsPage />
              </Suspense>
            } />
            <Route path="level/:levelId/daily" element={
              <Suspense fallback={<Loading />}>
                <DailyMissionPage />
              </Suspense>
            } />
            <Route path="level/:levelId/lessons/:lessonId" element={
              <Suspense fallback={<Loading />}>
                <LessonDetailPage />
              </Suspense>
            } />
            <Route path="resources" element={
              <Suspense fallback={<Loading />}>
                <ResourcesPage />
              </Suspense>
            } />
            <Route path="medical" element={
              <Suspense fallback={<Loading />}>
                <MedicalPage />
              </Suspense>
            } />
            <Route path="placement-test" element={
              <Suspense fallback={<Loading />}>
                <PlacementTest />
              </Suspense>
            } />
            <Route path="c1-readiness" element={
              <Suspense fallback={<Loading />}>
                <C1ReadinessPage />
              </Suspense>
            } />
            <Route path="mistake-notebook" element={
              <Suspense fallback={<Loading />}>
                <MistakeNotebookPage />
              </Suspense>
            } />
            <Route path="medical-fsp" element={
              <Suspense fallback={<Loading />}>
                <MedicalFSPHubPage />
              </Suspense>
            } />
            <Route path="medical-fsp/vocabulary" element={
              <Suspense fallback={<Loading />}>
                <FSPVocabPage />
              </Suspense>
            } />
            <Route path="medical-fsp/anamnese" element={
              <Suspense fallback={<Loading />}>
                <FSPAnamnesePage />
              </Suspense>
            } />
            <Route path="medical-fsp/cases" element={
              <Suspense fallback={<Loading />}>
                <FSPCasesPage />
              </Suspense>
            } />
            <Route path="medical-fsp/presentations" element={
              <Suspense fallback={<Loading />}>
                <FSPPresentationsPage />
              </Suspense>
            } />
            <Route path="medical-fsp/writing" element={
              <Suspense fallback={<Loading />}>
                <FSPWritingPage />
              </Suspense>
            } />
            <Route path="medical-fsp/listening" element={
              <Suspense fallback={<Loading />}>
                <FSPListeningPage />
              </Suspense>
            } />
            <Route path="medical-fsp/reading" element={
              <Suspense fallback={<Loading />}>
                <FSPReadingPage />
              </Suspense>
            } />
            <Route path="medical-fsp/grammar" element={
              <Suspense fallback={<Loading />}>
                <FSPGrammarPage />
              </Suspense>
            } />
            <Route path="medical-fsp/exams" element={
              <Suspense fallback={<Loading />}>
                <FSPExamPage />
              </Suspense>
            } />

          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
