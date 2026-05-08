import { useState, useEffect, useRef } from 'react';

/**
 * Shared UI component library for deutsch-klinik.
 * Reusable, consistent components for the learning platform.
 */

// ===== LAYOUT =====

/**
 * Consistent page shell with max-width, padding, and background.
 */
export function PageShell({ children, maxWidth = 'max-w-4xl', className = '', style = {} }) {
  return (
    <div
      className={`mx-auto px-4 py-8 ${maxWidth} ${className}`}
      style={{ minHeight: 'calc(100vh - 4rem)', ...style }}
    >
      {children}
    </div>
  );
}

/**
 * Page header with title, optional subtitle, and optional action.
 */
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{title}</h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Section divider with optional label.
 */
export function SectionDivider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 my-6 ${className}`}>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      )}
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  );
}

// ===== CARDS =====

/**
 * Standard card with consistent styling.
 */
export function Card({ children, className = '', style = {}, hover = false, onClick }) {
  return (
    <div
      className={`rounded-xl p-5 transition-all ${
        hover ? 'cursor-pointer hover:scale-[1.01] hover:shadow-lg hover:shadow-black/20' : ''
      } ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Stat card showing a number, label, and optional trend.
 */
export function StatCard({ value, label, icon, trend, accent = 'var(--accent)', className = '' }) {
  return (
    <Card className={`text-center ${className}`} style={{ borderTop: `3px solid ${accent}` }}>
      {icon && <div className="mb-2" style={{ color: accent }}>{icon}</div>}
      <div className="text-3xl font-bold mb-1" style={{ color: accent }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
      {trend !== undefined && (
        <div className="text-xs mt-1" style={{ color: trend > 0 ? '#3bff9e' : '#ff3355' }}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </Card>
  );
}

/**
 * Progress card with bar, label, and percentage.
 */
export function ProgressCard({ label, value, max = 100, accent = 'var(--accent)', className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>
    </Card>
  );
}

/**
 * Skill card showing a skill type with score and practice CTA.
 */
export function SkillCard({ title, value, max = 10, icon, accent = 'var(--accent)', onClick, className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const scoreColor = pct >= 80 ? '#3bff9e' : pct >= 50 ? '#fbbf24' : '#ff3355';

  return (
    <Card
      hover
      onClick={onClick}
      className={`flex items-center gap-4 ${className}`}
    >
      {icon && <div className="text-2xl shrink-0" style={{ color: accent }}>{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold">{title}</span>
          <span className="text-xs font-bold" style={{ color: scoreColor }}>
            {value}/{max}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: scoreColor }}
          />
        </div>
      </div>
    </Card>
  );
}

/**
 * Action card with title, description, and optional accent.
 */
export function ActionCard({ title, description, icon, accent = 'var(--accent)', onClick, className = '' }) {
  return (
    <Card
      hover
      onClick={onClick}
      className={`flex items-center gap-4 ${className}`}
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      {icon && <div className="text-xl shrink-0" style={{ color: accent }}>{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</div>
        )}
      </div>
      <div className="text-lg shrink-0" style={{ color: 'var(--text-muted)' }}>&rarr;</div>
    </Card>
  );
}

// ===== STATES =====

/**
 * Empty state with icon, title, and description.
 */
export function EmptyState({ icon = '📭', title, description, action, className = '' }) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Loading state with optional message.
 */
export function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-3"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </div>
  );
}

/**
 * Error state with message and optional retry.
 */
export function ErrorState({ message = 'Something went wrong.', onRetry, className = '' }) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold mb-2">Error</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// ===== BADGES =====

/**
 * Level badge showing CEFR level.
 */
export function LevelBadge({ level, size = 'md', className = '' }) {
  const colors = {
    A1: '#3bff9e', A2: '#06b6d4', B1: '#6366f1',
    B2: '#f59e0b', C1: '#ff3355', FSP: '#8b5cf6',
  };
  const color = colors[level] || 'var(--accent)';
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full ${sizes[size]} ${className}`}
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {level}
    </span>
  );
}

/**
 * Generic badge for skills, categories, etc.
 */
export function Badge({ label, color = 'var(--accent)', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${className}`}
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {label}
    </span>
  );
}

// ===== BUTTONS =====

/**
 * Primary action button.
 */
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', style = {} }) {
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none' },
    secondary: { background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
    danger: { background: '#ff3355', color: '#fff', border: 'none' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: 'none' },
    success: { background: '#3bff9e', color: '#0a0e1a', border: 'none' },
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
        ${s} ${className}`}
      style={{ ...v, ...style }}
    >
      {children}
    </button>
  );
}

// ===== PROGRESS RING =====

/**
 * SVG progress ring for showing completion percentage.
 */
export function ProgressRing({ pct = 0, size = 80, strokeWidth = 6, color = 'var(--accent)', className = '' }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(100, Math.max(0, pct)) / 100) * circumference;

  return (
    <svg width={size} height={size} className={`transform -rotate-90 ${className}`}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="var(--bg-hover)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
      <text
        x="50%" y="50%"
        textAnchor="middle" dominantBaseline="central"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
        className="text-xs font-bold"
        fill="var(--text-primary)"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ===== PRACTICE STEPPER =====

/**
 * Practice step indicator showing current step out of total.
 */
export function PracticeStepper({ current, total, labels = [], className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < current ? 'scale-100' : ''}
              ${i === current ? 'scale-110 ring-2' : ''}`}
            style={{
              background: i <= current ? 'var(--accent)' : 'var(--bg-hover)',
              color: i <= current ? '#fff' : 'var(--text-muted)',
              border: i > current ? '1px solid var(--border)' : 'none',
              ...(i === current ? { ringColor: 'var(--accent)' } : {}),
            }}
          >
            {i + 1}
          </div>
          {labels[i] && (
            <span className="text-[10px] hidden sm:block" style={{ color: i <= current ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {labels[i]}
            </span>
          )}
          {i < total - 1 && (
            <div className="flex-1 h-px" style={{
              background: i < current ? 'var(--accent)' : 'var(--border)',
              opacity: i < current ? 0.5 : 1,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ===== RESULT SUMMARY =====

/**
 * Result summary for exam/practice completion.
 */
export function ResultSummary({ score, maxScore, level, label = 'Score', className = '' }) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const color = pct >= 80 ? '#3bff9e' : pct >= 50 ? '#fbbf24' : '#ff3355';
  const grade = pct >= 90 ? 'Ausgezeichnet!' : pct >= 80 ? 'Sehr gut!' : pct >= 65 ? 'Gut' : pct >= 50 ? 'Befriedigend' : 'Weiter üben';

  return (
    <Card className={`text-center ${className}`} style={{ borderColor: `${color}40` }}>
      <ProgressRing pct={pct} size={100} color={color} className="mx-auto mb-4" />
      <div className="text-lg font-bold mb-1" style={{ color }}>{grade}</div>
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {score}/{maxScore} &middot; {Math.round(pct)}%
      </div>
      {level && (
        <div className="mt-3">
          <LevelBadge level={level} />
        </div>
      )}
    </Card>
  );
}

// ===== CONFIRM DIALOG =====

/**
 * Simple confirm dialog overlay.
 */
export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, variant = 'danger' }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="rounded-xl p-6 max-w-sm w-full"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {message && (
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{message}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: variant === 'danger' ? '#ff3355' : 'var(--accent)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== FEATURE CARD =====

/**
 * Feature card for module/category selection (FSP hub, level grid).
 */
export function FeatureCard({ title, description, icon, accent = 'var(--accent)', count, onClick, className = '' }) {
  return (
    <Card
      hover
      onClick={onClick}
      className={`text-center p-6 ${className}`}
      style={{ borderTop: `3px solid ${accent}` }}
    >
      {icon && <div className="text-3xl mb-3" style={{ color: accent }}>{icon}</div>}
      <h3 className="text-sm font-bold mb-1">{title}</h3>
      {description && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>
      )}
      {count !== undefined && (
        <div className="mt-3">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: `${accent}15`, color: accent }}
          >
            {count} items
          </span>
        </div>
      )}
    </Card>
  );
}
