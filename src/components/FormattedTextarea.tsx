import React, { useState, useRef, useEffect } from 'react';
import './FormattedTextarea.css';

interface FormattedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

// Unicode character maps
const BOLD_MAP: { [key: string]: string } = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
  'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
  'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
  'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
  'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

const ITALIC_MAP: { [key: string]: string } = {
  'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
  'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
  'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
  'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
  'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
  'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
};

// Reverse maps for unformatting
const BOLD_REVERSE_MAP = Object.fromEntries(Object.entries(BOLD_MAP).map(([k, v]) => [v, k]));
const ITALIC_REVERSE_MAP = Object.fromEntries(Object.entries(ITALIC_MAP).map(([k, v]) => [v, k]));

const toBold = (text: string): string => {
  return text.split('').map(char => BOLD_MAP[char] || char).join('');
};

const toItalic = (text: string): string => {
  return text.split('').map(char => ITALIC_MAP[char] || char).join('');
};

const fromBold = (text: string): string => {
  return text.split('').map(char => BOLD_REVERSE_MAP[char] || char).join('');
};

const fromItalic = (text: string): string => {
  return text.split('').map(char => ITALIC_REVERSE_MAP[char] || char).join('');
};

const isBold = (text: string): boolean => {
  // Check if text contains bold characters
  const chars = text.split('');
  for (const char of chars) {
    if (Object.values(BOLD_MAP).includes(char)) {
      return true;
    }
  }
  return false;
};

const isItalic = (text: string): boolean => {
  // Check if text contains italic characters
  const chars = text.split('');
  for (const char of chars) {
    if (Object.values(ITALIC_MAP).includes(char)) {
      return true;
    }
  }
  return false;
};

const FormattedTextarea: React.FC<FormattedTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  label
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [numberedListActive, setNumberedListActive] = useState(false);
  const [bulletListActive, setBulletListActive] = useState(false);
  const selectedBullet = '•';
  const [listCounter, setListCounter] = useState(1);
  const [pendingSelection, setPendingSelection] = useState<{ start: number; end: number } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize functionality
  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
      if (el.scrollHeight > 800) {
        el.style.overflowY = 'auto';
      } else {
        el.style.overflowY = 'hidden';
      }
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  // Restore selection after value changes
  useEffect(() => {
    if (pendingSelection && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(pendingSelection.start, pendingSelection.end);
      setPendingSelection(null);
    }
  }, [value, pendingSelection]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    
    // Handle list formatting on Enter
    if (e.target.value.length > value.length && e.target.value.slice(-1) === '\n') {
      if (numberedListActive) {
        newValue = e.target.value + listCounter + '. ';
        setListCounter(listCounter + 1);
      } else if (bulletListActive) {
        newValue = e.target.value + selectedBullet + ' ';
      }
    }
    
    onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Ctrl+B for bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      toggleBold();
      return;
    }

    // Handle Ctrl+I for italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      toggleItalic();
      return;
    }

    // Handle typing with formatting active
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (boldActive && BOLD_MAP[e.key]) {
        e.preventDefault();
        insertAtCursor(BOLD_MAP[e.key]);
      } else if (italicActive && ITALIC_MAP[e.key]) {
        e.preventDefault();
        insertAtCursor(ITALIC_MAP[e.key]);
      }
    }

    // Handle Enter key for lists
    if (e.key === 'Enter') {
      if (numberedListActive) {
        e.preventDefault();
        insertAtCursor('\n' + listCounter + '. ');
        setListCounter(listCounter + 1);
      } else if (bulletListActive) {
        e.preventDefault();
        insertAtCursor('\n' + selectedBullet + ' ');
      }
    }
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const toggleBold = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      // Text is selected - format/unformat it
      const selectedText = value.substring(start, end);
      const newText = isBold(selectedText) ? fromBold(selectedText) : toBold(selectedText);
      const newValue = value.substring(0, start) + newText + value.substring(end);
      
      // Set pending selection to restore after onChange
      setPendingSelection({ start, end: start + newText.length });
      onChange(newValue);
    } else {
      // Toggle typing mode
      setBoldActive(!boldActive);
      if (!boldActive) setItalicActive(false);
    }
  };

  const toggleItalic = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      // Text is selected - format/unformat it
      const selectedText = value.substring(start, end);
      const newText = isItalic(selectedText) ? fromItalic(selectedText) : toItalic(selectedText);
      const newValue = value.substring(0, start) + newText + value.substring(end);
      
      // Set pending selection to restore after onChange
      setPendingSelection({ start, end: start + newText.length });
      onChange(newValue);
    } else {
      // Toggle typing mode
      setItalicActive(!italicActive);
      if (!italicActive) setBoldActive(false);
    }
  };

  const toggleNumberedList = () => {
    const newState = !numberedListActive;
    setNumberedListActive(newState);
    if (newState) {
      setBulletListActive(false);
      setListCounter(2); // Start at 2 since we're inserting 1. immediately
      // If cursor is at start of line or textarea is empty, insert first number
      const textarea = textareaRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const isStartOfLine = cursorPos === 0 || value[cursorPos - 1] === '\n';
        if (isStartOfLine || value === '') {
          insertAtCursor('1. ');
        }
      }
    }
  };

  const toggleBulletList = () => {
    const newState = !bulletListActive;
    setBulletListActive(newState);
    if (newState) {
      setNumberedListActive(false);
      // If cursor is at start of line or textarea is empty, insert first bullet
      const textarea = textareaRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const isStartOfLine = cursorPos === 0 || value[cursorPos - 1] === '\n';
        if (isStartOfLine || value === '') {
          insertAtCursor(selectedBullet + ' ');
        }
      }
    }
  };

  const insertHorizontalLine = () => {
    insertAtCursor('\n────────────────\n');
  };

  return (
    <div className="formatted-textarea-container">
      {label && <label className="formatted-textarea-label">{label}</label>}
      
      <div className="textarea-wrapper">
        <div className={`formatting-toolbar ${isExpanded ? 'expanded' : ''}`}>
          <button
            type="button"
            className={`toolbar-expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Hide formatting options" : "Show formatting options"}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 5h10M3 8h10M3 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="toolbar-expand-text">
              {isExpanded ? 'Hide' : 'Format'}
            </span>
          </button>

          <div className={`toolbar-options ${isExpanded ? 'visible' : 'hidden'}`}>
            <div className="toolbar-section">
              <span className="toolbar-section-label">Style</span>
              <div className="toolbar-buttons">
                <button
                  type="button"
                  className={`toolbar-btn ${boldActive ? 'active' : ''}`}
                  onClick={toggleBold}
                  title="Bold (𝗕𝗼𝗹𝗱) - Ctrl+B"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M3 2h5c1.7 0 3 1.3 3 3 0 1-.5 1.9-1.2 2.4.9.6 1.5 1.6 1.5 2.8 0 1.8-1.5 3.3-3.3 3.3H3V2zm2 4.5h3c.6 0 1-.4 1-1s-.4-1-1-1H5v2zm0 5h3.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5H5v3z"/>
                  </svg>
                </button>
                
                <button
                  type="button"
                  className={`toolbar-btn ${italicActive ? 'active' : ''}`}
                  onClick={toggleItalic}
                  title="Italic (𝑰𝒕𝒂𝒍𝒊𝒄) - Ctrl+I"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M6 2h6v2H9.5l-3 8H9v2H3v-2h2.5l3-8H6V2z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-section">
              <span className="toolbar-section-label">Lists</span>
              <div className="toolbar-buttons">
                <button
                  type="button"
                  className={`toolbar-btn ${numberedListActive ? 'active' : ''}`}
                  onClick={toggleNumberedList}
                  title="Numbered List"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M2 3V1h1v5H2V5h-.5V4H2V3zM5 2h9v2H5V2zm0 4h9v2H5V6zm0 4h9v2H5v-2zM2 8v1h1v1H1V9h1V8H1V7h2v1H2zm0 3v1h1.5v1H1v-1h1v-.5H1V11h2v1H2z"/>
                  </svg>
                </button>
                
                <button
                  type="button"
                  className={`toolbar-btn ${bulletListActive ? 'active' : ''}`}
                  onClick={toggleBulletList}
                  title="Bullet List"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <circle cx="2" cy="2" r="1.5"/>
                    <circle cx="2" cy="7" r="1.5"/>
                    <circle cx="2" cy="12" r="1.5"/>
                    <path d="M5 1.5h9v1H5v-1zm0 5h9v1H5v-1zm0 5h9v1H5v-1z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-section">
              <span className="toolbar-section-label">Line Break</span>
              <div className="toolbar-buttons">
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={insertHorizontalLine}
                  title="Insert Horizontal Line"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M1 7h12v1H1z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          className={`formatted-textarea ${className}`}
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
        />
        
        {(boldActive || italicActive || numberedListActive || bulletListActive) && (
          <div className="format-status">
            {boldActive && <span className="status-badge">𝗕𝗼𝗹𝗱 mode active</span>}
            {italicActive && <span className="status-badge">𝑰𝒕𝒂𝒍𝒊𝒄 mode active</span>}
            {numberedListActive && <span className="status-badge">Numbered list active</span>}
            {bulletListActive && <span className="status-badge">Bullet list active ({selectedBullet})</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormattedTextarea;

