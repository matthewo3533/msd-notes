import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..', 'static');
const port = Number(process.argv[2] || 4173);

const contentTypeFor = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.csv':
      return 'text/csv; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
};

const server = http.createServer((req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = decodeURIComponent(reqUrl.pathname);

    // Serve SPA entry for "/"
    if (pathname === '/' || pathname === '') {
      const indexPath = path.join(rootDir, 'index.html');
      res.writeHead(200, { 'Content-Type': contentTypeFor(indexPath) });
      res.end(fs.readFileSync(indexPath));
      return;
    }

    const filePath = path.join(rootDir, pathname.replace(/^\/+/, ''));
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
    res.end(fs.readFileSync(filePath));
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${rootDir}`);
  console.log(`Open: http://127.0.0.1:${port}/static/index.html or http://127.0.0.1:${port}/`);
});

