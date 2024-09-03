// @ts-check

import { existsSync, statSync, writeFileSync } from 'fs';
import { relative, join } from 'path';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import bodyParser from 'body-parser';
import render from './src/render.js';

export default function (config = {}) {
  let { source, output, no_ssr, port, root, save_ssr } = config;
  source = source || process.cwd();
  port = port || 8080;
  root = output || root || join(source, 'public');
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  api(app, source, port);
  ssr(app, root, no_ssr, save_ssr);

  app.use((err, req, res, next) => {
    const time = new Date(Date.now()).toString();
    console.error('Error occurred:', req.path, time, err.message);
    res.status(500).send(err.message);
    next(err);
  });

  return app;
}

export function ssr(app, root, no_ssr, save_ssr) {

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
    }
    catch (err) {
      next(err);
    }
  });
}

export function api(app, source, port) {

  const fetch = global.fetch;
  global.fetch = (url, ...p) => {
    if (url.startsWith('/')) url = `http://localhost:${port}${url}`;
    return fetch(url, ...p);
  }

  app.all('/api/*', async (req, res, next) => {
    try {
      const run_api = async (js_file) => {
        const module = await import(`file://${js_file}`);
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

        if (existsSync(js_file)) {
          return run_api(js_file);
        } else if (existsSync(js_index)) {
          return run_api(js_index);
        }
      }
      console.log(magenta(`\tUnknown path ${path}`));
      res.sendStatus(404);
    } catch (e) {
      console.log(red(e.message));
      next(e);
    }
  });
}
