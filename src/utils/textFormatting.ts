// Shared text-formatting helpers used by the selection formatting tooltip.
// Formatting is stored directly in the plain-text value as Unicode characters
// (mathematical bold / italic, and bullet dots) so it survives copy/paste into
// systems that don't support rich text.

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

const BOLD_REVERSE_MAP = Object.fromEntries(Object.entries(BOLD_MAP).map(([k, v]) => [v, k]));
const ITALIC_REVERSE_MAP = Object.fromEntries(Object.entries(ITALIC_MAP).map(([k, v]) => [v, k]));

const BOLD_VALUES = new Set(Object.values(BOLD_MAP));
const ITALIC_VALUES = new Set(Object.values(ITALIC_MAP));

export const BULLET = '•';

// NOTE: the mathematical bold/italic characters are astral-plane code points
// (surrogate pairs in UTF-16). We MUST iterate by code point (Array.from / for..of),
// never String.split(''), otherwise the reverse maps never match and un-bolding
// silently fails.
export const toBold = (text: string): string =>
  Array.from(text).map(c => BOLD_MAP[c] || c).join('');

export const toItalic = (text: string): string =>
  Array.from(text).map(c => ITALIC_MAP[c] || c).join('');

export const fromBold = (text: string): string =>
  Array.from(text).map(c => BOLD_REVERSE_MAP[c] || c).join('');

export const fromItalic = (text: string): string =>
  Array.from(text).map(c => ITALIC_REVERSE_MAP[c] || c).join('');

// A selection counts as "already bold" when it contains bold characters and no
// plain characters that still could be bolded. Toggling then only unbolds a
// fully-bold selection and bolds everything else (including partial ones).
export const isFullyBold = (text: string): boolean => {
  let plainConvertible = 0;
  let bold = 0;
  for (const c of text) {
    if (BOLD_VALUES.has(c)) bold++;
    else if (BOLD_MAP[c] !== undefined) plainConvertible++;
  }
  return bold > 0 && plainConvertible === 0;
};

export const isFullyItalic = (text: string): boolean => {
  let plainConvertible = 0;
  let italic = 0;
  for (const c of text) {
    if (ITALIC_VALUES.has(c)) italic++;
    else if (ITALIC_MAP[c] !== undefined) plainConvertible++;
  }
  return italic > 0 && plainConvertible === 0;
};

export interface ListResult {
  from: number;
  to: number;
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

const NUMBER_PREFIX = /^(\s*)\d+\.\s+/;
const BULLET_PREFIX = new RegExp(`^(\\s*)${BULLET}\\s+`);

const stripPrefix = (line: string): string =>
  line.replace(NUMBER_PREFIX, '$1').replace(BULLET_PREFIX, '$1');

// Expand [start, end] to cover the full lines the selection touches.
const expandToLines = (value: string, start: number, end: number) => {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  // If the selection ends right at the beginning of a line, don't include that
  // trailing empty line in the block.
  let effectiveEnd = end;
  if (effectiveEnd > start && value[effectiveEnd - 1] === '\n') {
    effectiveEnd -= 1;
  }
  let lineEnd = value.indexOf('\n', effectiveEnd);
  if (lineEnd === -1) lineEnd = value.length;
  return { lineStart, lineEnd };
};

// Toggle a bullet or numbered list across all lines touched by the selection.
export const toggleList = (
  value: string,
  start: number,
  end: number,
  type: 'bullet' | 'numbered'
): ListResult => {
  const { lineStart, lineEnd } = expandToLines(value, start, end);
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split('\n');

  const nonEmpty = lines.filter(l => l.trim() !== '');
  const allBullet = nonEmpty.length > 0 && nonEmpty.every(l => BULLET_PREFIX.test(l));
  const allNumbered = nonEmpty.length > 0 && nonEmpty.every(l => NUMBER_PREFIX.test(l));

  let newLines: string[];
  if (type === 'bullet') {
    if (allBullet) {
      newLines = lines.map(stripPrefix);
    } else {
      newLines = lines.map(l => (l.trim() === '' ? l : `${BULLET} ${stripPrefix(l)}`));
    }
  } else {
    if (allNumbered) {
      newLines = lines.map(stripPrefix);
    } else {
      let n = 1;
      newLines = lines.map(l => (l.trim() === '' ? l : `${n++}. ${stripPrefix(l)}`));
    }
  }

  const newBlock = newLines.join('\n');
  return {
    from: lineStart,
    to: lineEnd,
    text: newBlock,
    selectionStart: lineStart,
    selectionEnd: lineStart + newBlock.length,
  };
};

// --- Caret / selection coordinate measurement ------------------------------
// Textareas don't expose per-character pixel positions, so we mirror the
// textarea into a hidden div and measure a marker span. Adapted from the
// well-known "textarea-caret-position" technique.

const MIRROR_PROPS = [
  'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
  'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent',
  'letterSpacing', 'wordSpacing', 'tabSize',
];

export interface CaretCoordinates {
  top: number;
  left: number;
  height: number;
}

export const getCaretCoordinates = (
  element: HTMLTextAreaElement,
  position: number
): CaretCoordinates => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const style = div.style as unknown as Record<string, string>;
  const computed = window.getComputedStyle(element);

  style.whiteSpace = 'pre-wrap';
  style.wordWrap = 'break-word';
  style.position = 'absolute';
  style.visibility = 'hidden';

  MIRROR_PROPS.forEach(prop => {
    style[prop] = computed.getPropertyValue(
      prop.replace(/([A-Z])/g, '-$1').toLowerCase()
    );
  });

  div.textContent = element.value.substring(0, position);

  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  div.appendChild(span);

  const lineHeight = parseInt(computed.lineHeight, 10);
  const coordinates: CaretCoordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth, 10),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth, 10),
    height: Number.isNaN(lineHeight) ? parseInt(computed.fontSize, 10) * 1.2 : lineHeight,
  };

  document.body.removeChild(div);
  return coordinates;
};
