// @ts-check

import { existsSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import express from 'express';
import compression from 'compression';
import render from './src/render.js';
import { info, debug, error, warn } from './src/log.js';
import vfs from './src/vfs.js';

export let config = {};

export default function (_config = {}) {
  const cwd = process.cwd();
  let { source, output, ssr, root, port, save, live_reload, dev, base_dir, middlewares } = _config;
  base_dir = base_dir || '/';
  root = output || root || 'public';
  root = resolve(cwd, root);
  source = resolve(cwd, source || '.');
  ssr = ssr === undefined ? true : ssr;
  save = save === undefined ? true : save;
  if (!ssr) save = false;
  if (port === undefined) port = 8080;
  config = { ..._config, source, output, ssr, root, port, save, live_reload, base_dir };

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  if (middlewares) {
    for(const middleware of middlewares) {
      app.use(middleware);
    }
  }

  set_api(app, source, base_dir);
  set_action(app, source, base_dir);

  if (dev) set_vfs(app, base_dir);
  set_ssr(app, root, port, ssr, save, base_dir);

  app.use((err, req, res, next) => {
    error('Failed: ', req.path, err.message);
    res.status(500).send(err.message);
    next(err);
  });

  return app;
}

// Add this helper function after the import statements
function normalizePath(path, base_dir) {
  if(base_dir === '/') return path;
  path = path.startsWith(base_dir) ? path.slice(base_dir.length) : path;
  return path || '/';
}

export function set_vfs(app, base_dir) {
  app.use((req, res, next) => {
    const reqPath = normalizePath(req.path, base_dir);
    const indexPath = '/index.html';
    const asset = vfs.get(reqPath) || vfs.get(indexPath); // alwasy SPA mode
    if (asset) {
      res.type('.' + asset.type).send(asset.content);
    } else {
      next();
    }
  });
}

export function set_ssr(app, root, port, ssr, save, base_dir) {

  app.get('*', async (req, res, next) => {
    try {
      let path = normalizePath(req.path, base_dir); // Ensure base_dir is removed from the path
      if (path.includes('.')) {
        if (existsSync(`${root}${path}`)) {
          debug('Send:', path);
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
            debug('Send:', `${path}index.html`);
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
        if (existsSync(home_html)) {
          info('Send:', '/._html', '(SPA)');
          res.sendFile(home_html);
        } else {
          res.sendStatus(404);
        }
      }
    }
    catch (err) {
      error('Error:', req.path, err.message);
      next(err);
    }
  });
}

export function set_api(app, source, base_dir) {

  app.all(base_dir + 'api/*', async (req, res, next) => {

    const path = normalizePath(req.path, base_dir); // Ensure base_dir is removed from the path
    const paths = path.split('/');
    info('API  :', path);

    try {
      const run_api = async (js_file) => {
        try {
          const { mtimeMs } = statSync(js_file);
          const module = await import(`file://${js_file}?${mtimeMs}`);
          debug('Load:', js_file);

          const exp = module.default;
          if (typeof exp !== 'function') {
            throw new Error(`Default export is not a function in module ${js_file}`);
          }

          await exp(req, res, next);
        } catch (importError) {
          error('Error during module import or execution:', importError);
          res.status(500).send('Internal Server Error');
        }
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

export function set_action(app, source, base_dir) {

  app.all(base_dir + '_/*', async (req, res, next) => {

    const path = normalizePath(req.path, base_dir);
    const paths = path.split('/').filter(p => !!p);
    if (paths.length === 0) paths.push('/'); // for /index.html

    try {
      const run_action = async (js_file, params, body) => {
        const { mtimeMs } = statSync(js_file);
        let module;
        try {
          module = await import(`file://${js_file}?${mtimeMs}`);
          debug('Load:', js_file);
        } catch (importError) {
          throw new Error(`Error during import of module ${js_file}: ${importError.message}`);
        }

        const exp = module.default;
        if (typeof exp !== 'function') {
          throw new Error(`Default export is not a function in module ${js_file}`);
        }

        try {
          return await exp(...params, body);
        } catch (executionError) {
          throw new Error(`Error during execution of module ${js_file}: ${executionError.message}`);
        }
      };

      for (let i = paths.length; i > 0; i--) {
        const route = '/' + paths.slice(0, i).join('/');
        const params = paths.slice(i);
        const body = req.body;

        const js_index = `${source}${route}/index.js`;
        const js_file = `${source}${route}.js`;
        let result = null;
        if (existsSync(js_index)) {
          result = await run_action(js_index, params, body);
          res.json(result);
          return;
        } else if (existsSync(js_file)) {
          result = await run_action(js_file, params, body);
          res.json(result);
          return
        }
      }
      res.sendStatus(404);
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