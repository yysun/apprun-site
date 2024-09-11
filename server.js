// @ts-check

import { existsSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import render from './src/render.js';
import { info, debug, error, warn } from './src/log.js';

export let config = {};

export default function (_config = {}) {
  const cwd = process.cwd();
  let { source, output, ssr, root, port, save, live_reload } = _config;
  root = output || root || 'public';
  root = resolve(cwd, root);
  source = resolve(cwd, source || '.');
  ssr = ssr === undefined ? true : ssr;
  save = save === undefined? true : save;
  if (port === undefined) port = 8080;
  config = { source, output, ssr, root, port, save, live_reload };

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  set_api(app, source);
  set_push(app, source);
  set_ssr(app, root, ssr);

  app.use((err, req, res, next) => {
    error('Failed: ', req.path, err.message);
    res.status(500).send(err.message);
    next(err);
  });

  return app;
}

export function set_ssr(app, root, port, ssr, save=true) {

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
        const source_js = find_js(path, root);
        info('Serve:', path);
        if (source_js && existsSync(html_file)) {
          const { mtimeMs: html_mtimeMs } = statSync(html_file);
          const { mtimeMs: js_mtimeMs } = statSync(source_js);
          if (js_mtimeMs < html_mtimeMs) {
            debug('Send:', html_file);
            res.sendFile(html_file);
            return;
          }
        }
        if (ssr) {
          let content = await render(path, root, port);
          if (content) {
            info('Serve:', `${path}`, '(SSR)');
            if (save) {

              //ensure the directory exists
              const dir = join(root, path);
              if (!existsSync(dir)) {
                debug('Mkdir:', dir);
                mkdirSync(dir, { recursive: true });
              }

              writeFileSync(html_file, content);
              debug('Save:', html_file);
            }
            res.send(content);
            return;
          } else {
            warn('SSR:', path, 'failed, fallback to SPA');
          }
        }
        const home_html = `${root}/_.html`;
        info('Serve:', '/._html', '(SPA)');
        res.sendFile(home_html);
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

export function set_push(app, source) {

  app.get('/_/*', async (req, res, next) => {
    try {
      const path = req.path;
      const run_action = async (js_file, params) => {
        const { mtimeMs } = statSync(js_file);
        const module = await import(`file://${js_file}?${mtimeMs}`);
        debug('Load:', js_file);
        const exp = module.default;
        return exp(...params);
      };
      const paths = path.split('/').filter(p => !!p);
      if (paths.length === 0) paths.push('/'); // for /index.html

      for (let i = paths.length; i > 0; i--) {
        const route = '/' + paths.slice(0, i).join('/');
        const params = paths.slice(i);

        const js_index = `${source}${route}/index.js`;
        const js_file = `${source}${route}.js`;
        let result = null;
        if (existsSync(js_index)) {
          result = await run_action(js_index, params);
          res.json(result);
        } else if (existsSync(js_file)) {
          result = await run_action(js_file, params);
          res.json(result);
        }
      }
    } catch (err) {
      error('Error:', req.path, err.message);
      next(err);
    }
  });
}


function find_js(req_path, root) {
  let path = req_path.replace('/_', '');
  const segments = path.split('/').filter(segment => segment !== '');
  const paths = ['/'].concat(
    segments.map((_, index, array) => '/' + array.slice(0, index + 1).join('/'))
  );
  for (const route of paths) {
    if (route === '/' && paths.length > 1) continue;
    const js_index = `${root}${route}/index.js`;
    const js_file = `${root}${route}.js`;
    if (existsSync(js_index)) {
      return (js_index);
    } else if (existsSync(js_file)) {
      return (js_file);
    }
  }
}