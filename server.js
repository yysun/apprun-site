// @ts-check

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import { JSDOM } from 'jsdom';
import fetch from 'isomorphic-fetch';

import { app as apprun, Component, safeHTML} from 'apprun/dist/apprun.esm.js';

export default function (source, { output, pages }) {

  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  output = join(source, output || 'public');
  pages = join(source, pages || 'pages');

  const app = express();
  const html = readFileSync(`${pages}/index.html`, 'utf8');

  app.get('/api/*', async (req, res, next) => {
    const run_api = async (js_file) => {
      const module = await import(js_file);
      const exp = module.default;
      console.log(blue(`\t${js_file}`));
      exp(req, res, next);
    };

    const path = req.path;
    const paths = path.split('/');
    console.log(cyan(`Serving API ${path}`));
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

  app.get('*', async (req, res, next) => {

    const dom = new JSDOM(html);
    const win = global.window = dom.window;
    const document = global.document = dom.window.document;
    global.fetch = fetch;
    global.window.app = apprun;
    global.window.Component = Component;
    global.window.safeHTML = safeHTML;
    global.HTMLElement = dom.window.HTMLElement;
    global.SVGElement = dom.window.SVGElement;

    const render = async (js_file, route, params) => {
      const module = await import(js_file);
      const exp = module.default;
      const el = document.getElementById(win['app-element']);
      if (exp.prototype && exp.prototype.constructor.name === exp.name) {
        console.log(green(`\t ${js_file}`));
        const component = new module.default();
        component.mount && component.mount(el || document.body, { route });
        component.run && component.run(route, ...params);
      } else if (typeof exp === 'function') {
        const vdom = await exp(...params);
        apprun.render( el || document.body, vdom);
      }
    }

    let path = req.path;
    if (path.includes('.')) {
      res.sendFile(path, { root: output });
    } else {
      if (!path.endsWith('/')) path += '/';
      const html_file = `${output}${path}index.html`;
      const main_file = `${output}/main.js`;
      console.log(cyan(`Rendering ${path}`));
      if (existsSync(html_file)) {
        res.sendFile(`${path}index.html`, { root: output });
      } else {
        if (existsSync(main_file)) {
          console.log(green(`\t ${main_file}`));
          const main = await import(main_file);
          await main.default();
        }
        const paths = path.split('/');
        for (let i = paths.length - 1; i > 1; i--) {
          const route = paths.slice(1, i).join('/');
          const js_index = `${output}/${route}/index.js`;
          const js_file = `${output}/${route}.js`;
          try {
            if (existsSync(js_index)) {
              await render(js_index, route, paths.slice(i));
            } else if (existsSync(js_file)) {
              await render(js_file, route, paths.slice(i));
            }
          } catch (e) {
            console.log(red(e.message));
          }
        }
        res.send(document.documentElement.outerHTML);
      }
    }
  });

  const listener = app.listen(process.env.PORT || 8080, function () {
    console.log(yellow('Your app is listening on port ') +
      `http://localhost:${listener.address().port}`);
  });
}