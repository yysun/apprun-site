// @ts-check

import { existsSync, statSync, writeFileSync } from 'fs';
import { relative, join } from 'path';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import render from './src/render.js';

export default function (config = {}) {
  let { source, output, no_ssr, port, root, save_ssr } = config;
  source = source || process.cwd();
  port = port || 8080;
  root = output || root || join(source, 'public');
  const app = express();
  api(app, source);
  ssr(app, root, no_ssr, save_ssr);

  const fetch = global.fetch;
  global.fetch = (url, ...p) => {
    if (url.startsWith('/')) url = `http://localhost:${port}${url}`;
    return fetch(url, ...p);
  }
  return app;
}

export function ssr(app, root, no_ssr, save_ssr) {

  app.get('*', async (req, res) => {
    let path = req.path;
    if (path.includes('.')) {
      res.sendFile(path, { root });
    } else {
      if (!path.endsWith('/')) path += '/';
      const html_file = `${root}${path}index.html`;
      console.log(cyan(`Serving ${path}`));
      if (existsSync(html_file)) {
        console.log(cyan(`\t${html_file}`));
        res.sendFile(html_file);
      }
      else if (no_ssr) {
        const home_html = `${root}/index.html`;
        console.log(gray(`\t${home_html} (SPA)`));
        res.sendFile(home_html);
      } else {
        let content = await render(path, root);
        if (content) {
          if (save_ssr) {
            writeFileSync(html_file, content);
          }
          console.log(green(`\t${root}${path} - SSR`));
          res.send(content);
        } else {
          console.log(red(`\t${path} not found`));
          res.sendStatus(404);
        }
      }
    }
  });
}

export function api(app, source) {
  app.get('/api/*', async (req, res, next) => {
    const run_api = async (js_file) => {
      const { mtimeMs } = statSync(js_file);
      const module = await import(`file://${js_file}?${mtimeMs}`);
      const exp = module.default;
      console.log(blue(`\t${js_file}`));
      exp(req, res, next);
    };

    const path = req.path;
    const paths = path.split('/');
    console.log(blue(`Serving API ${path}`));
    for (let i = paths.length; i > 1; i--) {
      const route = paths.slice(1, i).join('/');
      let js_index = `${source}/${route}/index.js`;
      let js_file = `${source}/${route}.js`;
      try {
        if (existsSync(js_file)) {
          await run_api(js_file);
          return;
        } else if (existsSync(js_index)) {
          await run_api(js_index);
          return;
        }
      } catch (e) {
        console.log(red(e.message));
        res.sendStatus(500);
        return;
        // } finally {
        //   delete require.cache[js_file];
      }
    }
    console.log(magenta(`\tUnknown path ${path}`));
    res.sendStatus(404);
  });
}
