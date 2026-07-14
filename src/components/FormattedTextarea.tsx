import React, { useState, useRef, useEffect, useCallback } from 'react';
import './FormattedTextarea.css';
import {
  toBold,
  fromBold,
  toItalic,
  fromItalic,
  isFullyBold,
  isFullyItalic,
  toggleList,
  getCaretCoordinates,
} from '../utils/textFormatting';

interface FormattedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

interface ToolbarState {
  top: number;
  left: number;
  above: boolean;
}

const TOOLBAR_GAP = 8;

const FormattedTextarea: React.FC<FormattedTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  label,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [toolbar, setToolbar] = useState<ToolbarState | null>(null);
  // Selection to restore after a controlled value update (formatting edits).
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    el.style.overflowY = el.scrollHeight > 800 ? 'auto' : 'hidden';
  }, []);

  // Position the tooltip above (or below) the current text selection.
  const updateToolbar = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) {
      setToolbar(null);
      return;
    }

    const startCoords = getCaretCoordinates(ta, start);
    const endCoords = getCaretCoordinates(ta, end);
    const sameLine = startCoords.top === endCoords.top;

    const lineTop = Math.min(startCoords.top, endCoords.top) - ta.scrollTop;
    const lineHeight = startCoords.height || 20;

    let left = sameLine
      ? (startCoords.left + endCoords.left) / 2
      : ta.clientWidth / 2;
    left -= ta.scrollLeft;
    // Keep the tooltip within the field so it never clips off the edges.
    left = Math.max(72, Math.min(left, ta.clientWidth - 72));

    const above = lineTop > 44;
    const top = above
      ? lineTop - TOOLBAR_GAP
      : lineTop + lineHeight + TOOLBAR_GAP;

    setToolbar({ top, left, above });
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  // After a controlled value change from a formatting action, restore the
  // selection and reposition the tooltip over the newly formatted text.
  useEffect(() => {
    if (pendingSelection.current && textareaRef.current) {
      const ta = textareaRef.current;
      const { start, end } = pendingSelection.current;
      pendingSelection.current = null;
      ta.focus();
      ta.setSelectionRange(start, end);
      requestAnimationFrame(updateToolbar);
    }
  }, [value, updateToolbar]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Replace [from, to) with `text` in a way that participates in the browser's
  // native undo/redo history, so Ctrl+Z reverses a formatting action instead of
  // wiping the whole field. `execCommand('insertText')` is deprecated but is the
  // only reliable cross-browser way to make a programmatic textarea edit
  // undoable; we fall back to a controlled update if it is unavailable.
  const replaceRange = (
    from: number,
    to: number,
    text: string,
    selStart: number,
    selEnd: number
  ) => {
    const ta = textareaRef.current;
    if (!ta) return;

    ta.focus();
    ta.setSelectionRange(from, to);

    let ok = false;
    try {
      ok = document.execCommand('insertText', false, text);
    } catch {
      ok = false;
    }

    if (!ok) {
      const newValue = value.slice(0, from) + text + value.slice(to);
      pendingSelection.current = { start: selStart, end: selEnd };
      onChange(newValue);
      return;
    }

    // execCommand fired the input event (updating React state) and left the
    // caret collapsed; re-select the affected text so the tooltip stays put.
    const applySelection = () => ta.setSelectionRange(selStart, selEnd);
    applySelection();
    requestAnimationFrame(() => {
      applySelection();
      updateToolbar();
    });
  };

  const applyInline = (
    toFn: (t: string) => string,
    fromFn: (t: string) => string,
    isActive: (t: string) => boolean
  ) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) return;

    const selected = value.substring(start, end);
    // Toggle off only when the whole selection is already styled; otherwise
    // apply styling (which cleanly upgrades partially-styled selections to
    // fully styled without doubling up on already-styled characters).
    const replaced = isActive(selected) ? fromFn(selected) : toFn(selected);
    if (replaced === selected) return;
    replaceRange(start, end, replaced, start, start + replaced.length);
  };

  const applyBold = () => applyInline(toBold, fromBold, isFullyBold);
  const applyItalic = () => applyInline(toItalic, fromItalic, isFullyItalic);

  const applyList = (type: 'bullet' | 'numbered') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const r = toggleList(value, ta.selectionStart, ta.selectionEnd, type);
    if (r.text === value.slice(r.from, r.to)) return;
    replaceRange(r.from, r.to, r.text, r.selectionStart, r.selectionEnd);
  };

  // Ctrl/Cmd+B and Ctrl/Cmd+I still work as shortcuts on a selection. Tab is
  // intentionally left to the browser so it moves focus to the next field.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyBold();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      applyItalic();
    }
  };

  // Prevent the toolbar from stealing focus (which would collapse the
  // selection) so the buttons can act on the still-selected text.
  const preventFocusSteal = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="formatted-textarea-container">
      {label && <label className="formatted-textarea-label">{label}</label>}

      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          className={`formatted-textarea ${className}`}
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onSelect={updateToolbar}
          onScroll={updateToolbar}
          onBlur={() => setToolbar(null)}
          placeholder={placeholder}
        />

        {toolbar && (
          <div
            className={`selection-toolbar ${toolbar.above ? 'above' : 'below'}`}
            style={{ top: toolbar.top, left: toolbar.left }}
            onMouseDown={preventFocusSteal}
            role="toolbar"
            aria-label="Text formatting"
          >
            <button
              type="button"
              tabIndex={-1}
              className="selection-toolbar-btn"
              onClick={applyBold}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor">
                <path d="M3 2h5c1.7 0 3 1.3 3 3 0 1-.5 1.9-1.2 2.4.9.6 1.5 1.6 1.5 2.8 0 1.8-1.5 3.3-3.3 3.3H3V2zm2 4.5h3c.6 0 1-.4 1-1s-.4-1-1-1H5v2zm0 5h3.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5H5v3z" />
              </svg>
            </button>

            <button
              type="button"
              tabIndex={-1}
              className="selection-toolbar-btn"
              onClick={applyItalic}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor">
                <path d="M6 2h6v2H9.5l-3 8H9v2H3v-2h2.5l3-8H6V2z" />
              </svg>
            </button>

            <span className="selection-toolbar-divider" />

            <button
              type="button"
              tabIndex={-1}
              className="selection-toolbar-btn"
              onClick={() => applyList('bullet')}
              title="Bullet list"
              aria-label="Bullet list"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="2" cy="2" r="1.5" />
                <circle cx="2" cy="7" r="1.5" />
                <circle cx="2" cy="12" r="1.5" />
                <path d="M5 1.5h9v1H5v-1zm0 5h9v1H5v-1zm0 5h9v1H5v-1z" />
              </svg>
            </button>

            <button
              type="button"
              tabIndex={-1}
              className="selection-toolbar-btn"
              onClick={() => applyList('numbered')}
              title="Numbered list"
              aria-label="Numbered list"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor">
                <path d="M2 3V1h1v5H2V5h-.5V4H2V3zM5 2h9v2H5V2zm0 4h9v2H5V6zm0 4h9v2H5v-2zM2 8v1h1v1H1V9h1V8H1V7h2v1H2zm0 3v1h1.5v1H1v-1h1v-.5H1V11h2v1H2z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormattedTextarea;
