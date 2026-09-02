import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const staticDir = path.resolve(process.cwd(), 'static');
const indexPath = path.join(staticDir, 'index.html');
const outputPath = path.join(staticDir, 'MSD-Note-Grid.html');

const html = readFileSync(indexPath, 'utf8');

const scriptMatch = html.match(/<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>/i);
const cssMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/i)
  || html.match(/<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>/i);

if (!scriptMatch) {
  console.error('Could not find script reference in static/index.html');
  console.error('Run npm run build:static first.');
  process.exit(1);
}

const scriptRel = scriptMatch[1].replace(/^\.\//, '');

const jsPath = path.join(staticDir, scriptRel);
const js = readFileSync(jsPath, 'utf8');

let css = '';
if (cssMatch) {
  const cssRel = cssMatch[1].replace(/^\.\//, '');
  const cssPath = path.join(staticDir, cssRel);
  css = readFileSync(cssPath, 'utf8');
}

// Prevent inline CSS from closing the style element early.
const safeCss = css.replace(/<\/style/gi, '<\\/style');

// Escape closing script tags so inline JS stays valid plain text for security review.
const safeJs = js.replace(/<\/script/gi, '<\\/script');

let singleHtml = html
  .replace(/<script[^>]*\ssrc="[^"]+"[^>]*><\/script>\s*/i, '')
  .replace(/<link[^>]*rel="stylesheet"[^>]*>\s*/i, '')
  .replace(/<link[^>]*href="[^"]+"[^>]*rel="stylesheet"[^>]*>\s*/i, '');

// Function replacers are required: a replacement *string* treats $', $&, $`,
// and $$ as special tokens, which would corrupt CSS `content: '$'` and any
// `$` sequences in the inlined JS bundle.
singleHtml = singleHtml.replace('</head>', () =>
  css ? `    <style>\n${safeCss}\n    </style>\n  </head>` : '  </head>',
);

singleHtml = singleHtml.replace(
  '</body>',
  () => `    <script>\n${safeJs}\n    </script>\n  </body>`,
);

writeFileSync(outputPath, singleHtml, 'utf8');

const sizeMb = (Buffer.byteLength(singleHtml, 'utf8') / (1024 * 1024)).toFixed(2);
console.log(`Created ${outputPath} (${sizeMb} MB)`);
console.log('Open MSD-Note-Grid.html directly — no other files required.');
