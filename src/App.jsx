import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LevelPage from './pages/LevelPage';
import GrammarPage from './pages/GrammarPage';
import VocabularyPage from './pages/VocabularyPage';
import ReadingPage from './pages/ReadingPage';
import ListeningPage from './pages/ListeningPage';
import WritingPage from './pages/WritingPage';
import SpeakingPage from './pages/SpeakingPage';
import ExamPage from './pages/ExamPage';
import ResourcesPage from './pages/ResourcesPage';
import MedicalPage from './pages/MedicalPage';
import PlacementTest from './pages/PlacementTest';
import FlashcardPage from './pages/FlashcardPage';
import C1ReadinessPage from './pages/C1ReadinessPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import MistakeNotebookPage from './pages/MistakeNotebookPage';
import ErrorBoundary from './components/ErrorBoundary';
import TestPage from './pages/TestPage';
import TestDataPage from './pages/TestDataPage';

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="level/:levelId" element={<LevelPage />} />
            <Route path="level/:levelId/grammar" element={<GrammarPage />} />
            <Route path="level/:levelId/vocabulary" element={<VocabularyPage />} />
            <Route path="level/:levelId/vocabulary/flashcards" element={<FlashcardPage />} />
            <Route path="level/:levelId/reading" element={<ReadingPage />} />
            <Route path="level/:levelId/listening" element={<ListeningPage />} />
            <Route path="level/:levelId/writing" element={<WritingPage />} />
            <Route path="level/:levelId/speaking" element={<SpeakingPage />} />
            <Route path="level/:levelId/exam" element={<ExamPage />} />
            <Route path="level/:levelId/lessons" element={<LessonsPage />} />
            <Route path="level/:levelId/lessons/:lessonId" element={<LessonDetailPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="medical" element={<MedicalPage />} />
            <Route path="placement-test" element={<PlacementTest />} />
            <Route path="c1-readiness" element={<C1ReadinessPage />} />
            <Route path="mistake-notebook" element={<MistakeNotebookPage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="test-data" element={<TestDataPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
