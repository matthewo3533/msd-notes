import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const indexPath = path.resolve(process.cwd(), 'static', 'index.html');

let html;
try {
  html = readFileSync(indexPath, 'utf8');
} catch {
  console.warn(`Could not find ${indexPath}; skipping crossorigin fix.`);
  process.exit(0);
}

// When opened via `file://`, browsers can block module/CSS loads that include `crossorigin`.
// Removing it makes the static bundle work when served directly from a shared drive.
const fixed = html
  .replace(/\s+crossorigin\b/g, '')
  .replace(/\stype="module"/g, '')
  // Classic scripts execute immediately in <head>; defer so #root exists.
  .replace(/<script\s+src=/g, '<script defer src=');
writeFileSync(indexPath, fixed, 'utf8');

