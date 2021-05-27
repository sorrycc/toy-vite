import express from '@umijs/deps/compiled/express';
import { readFileSync } from 'fs';
import { extname, join } from 'path';
import { appRoot } from './constants';
import { transformCSS } from './transformCSS';
import { transformJS } from './transformJS';

export async function dev() {
  const app = express();

  // html
  app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    const htmlPath = join(appRoot, 'index.html');
    let html = readFileSync(htmlPath, 'utf-8');
    html = html.replace(
      '<head>',
      `
<head>\n    <script type="module" src="/@vite/client"></script>`.trim(),
    );
    res.send(html);
  });

  // @vite/client
  app.get('/@vite/client', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send('console.log("@vite/client");');
  });

  // source and precompiled deps
  app.get('/src/*', (req, res) => {
    console.log('> ', req.path);

    if ('import' in req.query) {
      res.set('Content-Type', 'application/javascript');
      res.send(`export default "${req.path}"`);
      return;
    }

    switch (extname(req.path)) {
      case '.svg':
        res.set('Content-Type', 'image/svg+xml');
        res.send(readFileSync(join(appRoot, req.path.slice(1)), 'utf-8'));
        break;
      case '.css':
        res.set('Content-Type', 'application/javascript');
        res.send(
          transformCSS({
            path: req.path,
            code: readFileSync(join(appRoot, req.path.slice(1)), 'utf-8'),
          }),
        );
        break;
      default:
        res.set('Content-Type', 'application/javascript');
        res.send(
          transformJS({
            appRoot,
            path: req.path,
            code: readFileSync(join(appRoot, req.path.slice(1)), 'utf-8'),
          }).code,
        );
        break;
    }
  });

  const port = 3002;
  app.listen(port, () => {
    console.log(
      `Example app listening at http://${
        process.env.HOST || '127.0.0.1'
      }:${port}`,
    );
  });
}
