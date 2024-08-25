// @ts-check

import { existsSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import render from './src/render.js';

export default function (source, config) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  let { output, no_ssr, port, root, save_ssr } = config;
  config.port = port = port || 8080;
  output = output || root || 'public';
  output = join(source, output);
  const app = express();

  api(app, source);
  ssr(app, output, no_ssr, port, save_ssr);

  app.listen(port, function () {
    console.log(yellow(`Your app is listening on http://localhost:${port}`));
    console.log(yellow(`Serving from: ${output}`));
    console.log(`SSR ${no_ssr ? 'disabled' : 'enabled'}.`);
  });
  return app;
}

export function ssr(app, output, no_ssr, port, save_ssr) {
  app.get('*', async (req, res, next) => {
    let path = req.path;
    if (path.includes('.')) {
      res.sendFile(path, { root: output });
    } else {
      if (!path.endsWith('/')) path += '/';
      const html_file = `${output}${path}index.html`;
      console.log(cyan(`Serving ${path}`));
      if (existsSync(html_file)) {
        console.log(cyan(`\t${html_file}`));
        res.sendFile(html_file);
      }
      else if (no_ssr) {
        const home_html = `${output}/index.html`;
        console.log(gray(`\t${home_html} (SPA)`));
        res.sendFile(home_html);
      } else {
        let content = await render(path, output);
        if (!content) {
          console.log(red(`\t${path} not found`));
          res.sendStatus(404);
          return;
        }
        // console.log(green(`\t${html_file} (SSR)`));
        if (save_ssr) {
          writeFileSync(html_file, content);
          // console.log(green(`\t${html_file} (SSR Saved)`));
        }
        res.send(content);
      }
    };
    next();
  });
}

export function api(app, source = '.') {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  app.get('/api/*', async (req, res, next) => {
    const run_api = async (js_file) => {
      const { mtimeMs } = statSync(js_file);
      const module = await import(`${js_file}?${mtimeMs}`);
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
