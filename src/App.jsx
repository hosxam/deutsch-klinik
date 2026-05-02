import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

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
const LessonsPage = lazy(() => import('./pages/LessonsPage'));
const LessonDetailPage = lazy(() => import('./pages/LessonDetailPage'));
const MistakeNotebookPage = lazy(() => import('./pages/MistakeNotebookPage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const TestDataPage = lazy(() => import('./pages/TestDataPage'));

function Loading() {
  return (
    <div style={{
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
            <Route path="test" element={
              <Suspense fallback={<Loading />}>
                <TestPage />
              </Suspense>
            } />
            <Route path="test-data" element={
              <Suspense fallback={<Loading />}>
                <TestDataPage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
