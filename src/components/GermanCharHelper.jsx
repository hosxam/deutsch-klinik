/**
 * GermanCharHelper — compact row of ä/ö/ü/ß buttons for inserting special characters.
 *
 * Usage:
 *   <GermanCharHelper targetRef={inputRef} />
 *   <GermanCharHelper onInsert={(char) => setValue(prev => prev + char)} />
 *
 * Pass EITHER a ref to the input/textarea (to insert at cursor position),
 * OR an onInsert callback.
 *
 * Works on mobile (onClick, not hover-based).
 */

import { useRef, useCallback } from 'react';

const CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

export default function GermanCharHelper({ targetRef, onInsert, style, compact }) {
  const handleChar = useCallback((char) => {
    if (onInsert) {
      onInsert(char);
      return;
    }
    if (targetRef && targetRef.current) {
      const el = targetRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;
      el.value = val.slice(0, start) + char + val.slice(end);
      // Set cursor position after inserted char
      const newPos = start + char.length;
      el.setSelectionRange(newPos, newPos);
      // Trigger React onChange by dispatching input event
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
    }
  }, [targetRef, onInsert]);

  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: compact ? '32px' : '36px',
    height: compact ? '32px' : '36px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: compact ? '0.85rem' : '0.95rem',
    fontWeight: 600,
    padding: 0,
    lineHeight: 1,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'manipulation',
  };

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      flexWrap: 'wrap',
      alignItems: 'center',
      ...style,
    }}>
      {CHARS.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={`Insert ${c}`}
          style={btnStyle}
          onClick={(e) => {
            e.preventDefault();
            handleChar(c);
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
