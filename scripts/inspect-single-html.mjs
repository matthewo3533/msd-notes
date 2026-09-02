import { readFileSync } from 'node:fs';

const h = readFileSync('static/MSD-Note-Grid.html', 'utf8');
const scriptStart = h.indexOf('<script>') + '<script>'.length;
const scriptEnd = h.lastIndexOf('</script>');
const js = h.slice(scriptStart, scriptEnd);

const matches = [...js.matchAll(/<\/?script/gi)];
console.log('script-like sequences in inlined js:', matches.length);
matches.slice(0, 10).forEach((m) => {
  console.log(m.index, JSON.stringify(js.slice(m.index, m.index + 40)));
});
