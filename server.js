// @ts-check

import { existsSync, statSync } from 'fs';
import { join } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import render from './src/render.js';
import { info, debug, error, warn } from './src/log.js';

export default function (config = {}) {
  let { source, output, ssr, root } = config;
  source = source || process.cwd();
  root = output || root || join(source, 'public');
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  set_api(app, source);
  set_ssr(app, root, ssr);

  app.use((err, req, res, next) => {
    error('Failed: ', req.path, err.message);
    res.status(500).send(err.message);
    next(err);
  });

  return app;
}

export function set_ssr(app, root, ssr) {

  app.get('*', async (req, res, next) => {
    try {
      let path = req.path;
      if (path.includes('.')) {
        if (existsSync(`${root}${path}`)) {
          res.sendFile(path, { root });
        } else {
          res.sendStatus(404);
        }
      } else {
        if (!path.endsWith('/')) path += '/';
        const html_file = `${root}${path}index.html`;
        info('Serve:', path);
        if (existsSync(html_file)) {
          debug('Send:', html_file);
          res.sendFile(html_file);
        }
        else if (ssr) {
          let content = await render(path, root);
          if (content) {
            info('Serve:', `${path}`, '(SSR)');
            res.send(content);
            return;
          } else {
            warn('SSR:', path, 'failed, fallback to SPA');
          }
          const home_html = `${root}/_.html`;
          info('Serve:', '/._html', '(SPA)');
          res.sendFile(home_html);
        }
      }
    }
    catch (err) {
      error('Error:', req.path, err.message);
      next(err);
    }
  });
}

export function set_api(app, source) {

  app.all('/api/*', async (req, res, next) => {

    const path = req.path;
    const paths = path.split('/');
    info('API  :', path);

    try {
      const run_api = async (js_file) => {
        const { mtimeMs } = statSync(js_file);
        const module = await import(`file://${js_file}?${mtimeMs}`);
        debug('Load:', js_file);
        const exp = module.default;
        exp(req, res, next);
      };


      for (let i = paths.length; i > 1; i--) {
        const route = paths.slice(1, i).join('/');
        let js_index = `${source}/${route}/index.js`;
        let js_file = `${source}/${route}.js`;

        if (existsSync(js_file)) {
          return run_api(js_file);
        } else if (existsSync(js_index)) {
          return run_api(js_index);
        }
      }
      warn('API Error:', path, 'not found');
      res.sendStatus(404);
    } catch (e) {
      error('Error:', path, e.message);
      next(e);
    }
  });
}
