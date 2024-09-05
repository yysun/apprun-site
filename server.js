// @ts-check

import { existsSync } from 'fs';
import { join } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import render from './src/render.js';
import { info, debug, error, warn } from './src/log';

export default function (config = {}) {
  let { source, output, ssr, port, root } = config;
  source = source || process.cwd();
  port = port || 8080;
  root = output || root || join(source, 'public');
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  set_api(app, source, port);
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
        const home_html = `${root}/index.html`;
        info('Serve:', path);
        if (existsSync(html_file)) {
          info('Serve:', html_file);
          res.sendFile(html_file);
        }
        else if (ssr) {
          debug('SSR:', path, 'start');
          let content = await render(path, root);
          debug('SSR:', path, 'done');

          if (content) {
            info('Serve:', `${root}${path}`, '(SSR)');
            res.send(content);
          } else {
            warn('SSR:', path, 'failed, fallback to SPA');
          }
          info('Serve:', home_html, '(SPA)');
          res.sendFile(home_html);
        }
      }
    }
    catch (err) {
      next(err);
    }
  });
}

export function set_api(app, source, port) {

  const fetch = global.fetch;
  global.fetch = (url, ...p) => {
    if (url.startsWith('/')) url = `http://localhost:${port}${url}`;
    return fetch(url, ...p);
  }

  app.all('/api/*', async (req, res, next) => {

    const path = req.path;
    const paths = path.split('/');
    info('API:', path);

    try {
      const run_api = async (js_file) => {

        debug('API import:', js_file);
        const module = await import(`file://${js_file}`);
        const exp = module.default;
        debug('API execute:', exp.name);
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
      error('API Error:', path, 'not found');
      res.sendStatus(404);
    } catch (e) {
      error('API Error:', path, e.message);
      next(e);
    }
  });
}
