import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { tryEvaluateMathExpression } from '../utils/mathExpression';

interface CalculatedAmountInputProps {
  value: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  className?: string;
  disabled?: boolean;
}

function formatDisplayValue(value: number): string {
  if (!value) return '';
  // Avoid scientific notation and unnecessary trailing zeros.
  return Number.isInteger(value) ? String(value) : String(value);
}

export default function CalculatedAmountInput({
  value,
  onValueChange,
  placeholder,
  min = 0,
  className,
  disabled
}: CalculatedAmountInputProps) {
  const hintId = useId();
  const formatted = useMemo(() => formatDisplayValue(value), [value]);
  const [text, setText] = useState(formatted);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastEmittedValueRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isFocused) setText(formatted);
  }, [formatted, isFocused]);

  const commit = (): { committed: true; displayText: string } | { committed: false } => {
    const raw = text.trim();
    if (!raw) {
      onValueChange(0);
      return { committed: true, displayText: '' };
    }

    const evaluated = tryEvaluateMathExpression(raw);
    const parsed = evaluated.ok ? evaluated.value : Number(raw);
    if (!Number.isFinite(parsed)) return { committed: false };

    const clamped = parsed < min ? min : parsed;
    onValueChange(clamped);
    return { committed: true, displayText: formatDisplayValue(clamped) };
  };

  const sanitize = (next: string) => next.replace(/[^0-9+\-*/().\s]/g, '');
  const showHint = isFocused && /[+\-*/()]/.test(text.trim());
  const tryParseToNumber = (raw: string): number | null => {
    const s = raw.trim();
    if (!s) return 0;

    const evaluated = tryEvaluateMathExpression(s);
    if (evaluated.ok && Number.isFinite(evaluated.value)) return evaluated.value;

    // Plain number (allow decimals while typing).
    if (/^[+-]?\d*(\.\d*)?$/.test(s)) {
      if (s === '+' || s === '-' || s === '.' || s === '+.' || s === '-.') return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    }

    return null;
  };

  const emitIfChanged = (next: number) => {
    const clamped = next < min ? min : next;
    const prev = lastEmittedValueRef.current;
    if (prev !== null && Object.is(prev, clamped)) return;
    lastEmittedValueRef.current = clamped;
    onValueChange(clamped);
  };

  return (
    <div className="calculated-amount-input">
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          const nextText = sanitize(e.target.value);
          setText(nextText);
          const maybe = tryParseToNumber(nextText);
          if (maybe !== null) emitIfChanged(maybe);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          const result = commit();
          if (result.committed) setText(result.displayText);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const result = commit();
            if (result.committed) {
              setText(result.displayText);
              requestAnimationFrame(() => {
                const el = inputRef.current;
                if (!el) return;
                el.focus();
                const end = el.value.length;
                el.setSelectionRange(end, end);
              });
            }
            return;
          }
          // Allow common shortcuts (Ctrl/⌘ + A/C/V/X/Z/Y etc.)
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          if (e.key.length === 1) {
            const sanitized = sanitize(e.key);
            if (sanitized !== e.key) e.preventDefault();
          }
        }}
        className={className}
        disabled={disabled}
        aria-label={placeholder || 'Amount'}
        aria-describedby={showHint ? hintId : undefined}
        autoComplete="off"
        spellCheck={false}
      />
      {showHint && (
        <div id={hintId} className="calculated-amount-hint">
          Press Enter to calculate
        </div>
      )}
    </div>
  );
}

