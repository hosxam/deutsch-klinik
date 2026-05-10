import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageShell, Card, FeatureCard } from '../components/ui';
import { getState, getCurrentStudyLevel } from '../utils/store';
import {
  BarChart3, FileText, Headphones, PenTool, Mic, BookMarked, AlertTriangle, Sparkles, MessageSquare
} from 'lucide-react';

export default function PracticeHubPage() {
  const state = getState();
  const level = getCurrentStudyLevel();
  const mistakesCount = Object.keys(state.mistakeNotebook || {}).length;

  const practiceCards = [
    {
      title: 'Recommended Practice',
      description: mistakesCount > 0
        ? 'You have mistakes to review before new practice.'
        : 'Start your daily practice session.',
      icon: <Sparkles size={28} />,
      accent: '#8b5cf6',
      to: mistakesCount > 0 ? '/mistake-notebook' : `/level/${level}/daily`,
    },
    {
      title: 'Grammar Practice',
      description: `Master grammar concepts for level ${level}`,
      icon: <BarChart3 size={28} />,
      accent: '#f59e0b',
      to: `/level/${level}/grammar`,
    },
    {
      title: 'Reading Practice',
      description: `Improve your reading comprehension (${level})`,
      icon: <FileText size={28} />,
      accent: '#14b8a6',
      to: `/level/${level}/reading`,
    },
    {
      title: 'Listening Practice',
      description: `Train your ear for German (${level})`,
      icon: <Headphones size={28} />,
      accent: '#8b5cf6',
      to: `/level/${level}/listening`,
    },
    {
      title: 'Writing Practice',
      description: `Practice written expression at ${level}`,
      icon: <PenTool size={28} />,
      accent: '#ff3bcd',
      to: `/level/${level}/writing`,
    },
    {
      title: 'Speaking Practice',
      description: `Practice spoken German at ${level}`,
      icon: <Mic size={28} />,
      accent: '#ff6b00',
      to: `/level/${level}/speaking`,
    },
    {
      title: 'Flashcards',
      description: 'Spaced repetition vocabulary review',
      icon: <BookMarked size={28} />,
      accent: '#06b6d4',
      to: `/level/${level}/vocabulary/flashcards`,
    },
    {
      title: 'Conversation Practice',
      description: 'Practice roleplay scenarios for real conversations',
      icon: <MessageSquare size={28} />,
      accent: '#ff6b00',
      to: '/conversation',
    },
    {
      title: 'Mistake Review',
      description: mistakesCount > 0
        ? `You have ${mistakesCount} mistake${mistakesCount === 1 ? '' : 's'} to review`
        : 'Review past mistakes and weak areas',
      icon: <AlertTriangle size={28} />,
      accent: '#ffaa33',
      to: '/mistake-notebook',
    },
  ];

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
          Practice Hub
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Choose your practice area for level {level}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="rounded-xl p-5 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${card.accent}44`,
              borderTop: `3px solid ${card.accent}`,
              textDecoration: 'none',
            }}
          >
            <div className="text-3xl mb-3" style={{ color: card.accent }}>
              {card.icon}
            </div>
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {card.title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
