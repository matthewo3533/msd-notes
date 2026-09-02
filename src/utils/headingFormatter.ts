export type HeadingFormat = 'custom';

export interface CustomHeadingFormat {
  useTildes: boolean;
  useCapitals: boolean;
  useBold: boolean;
}

export const DEFAULT_CUSTOM_HEADING_FORMAT: CustomHeadingFormat = {
  useTildes: true,
  useCapitals: false,
  useBold: true
};

/**
 * Formats a heading using custom format options
 * @param heading The heading text to format
 * @param customFormat The custom format options
 * @returns The formatted heading
 */
export const formatHeading = (heading: string, _format: HeadingFormat, customFormat?: CustomHeadingFormat): string => {
  if (customFormat) {
    return formatCustomHeading(heading, customFormat);
  }
  return `~~~ ${heading} ~~~`; // Fallback
};

/**
 * Formats a heading using custom format options
 * @param heading The heading text to format
 * @param format The custom format options
 * @returns The formatted heading
 */
const formatCustomHeading = (heading: string, format: CustomHeadingFormat): string => {
  let text = heading;

  if (format.useCapitals) {
    text = text.toUpperCase();
  }

  if (format.useBold) {
    text = convertToBoldUnicode(text);
  }

  if (format.useTildes) {
    text = `~~~ ${text} ~~~`;
  } else if (format.useCapitals || format.useBold) {
    text = `${text}:`;
  }

  return text;
};

const convertToBoldUnicode = (text: string): string => {
  const boldMap: { [key: string]: string } = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
    'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
    'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
    'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
    'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
    'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
    'y': '𝘆', 'z': '𝘇',
    ' ': ' ', '&': '&', '-': '-', '/': '/', ':': ':', ';': ';', '.': '.', ',': ',',
    '!': '!', '?': '?', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}',
    "'": "'", '"': '"', '`': '`', '~': '~', '@': '@', '#': '#', '$': '$', '%': '%',
    '^': '^', '*': '*', '+': '+', '=': '=', '|': '|', '\\': '\\', '<': '<', '>': '>',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };

  return text.split('').map(char => boldMap[char] || char).join('');
};
