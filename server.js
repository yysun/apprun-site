// @ts-check

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import { JSDOM } from 'jsdom';
import { app as apprun, Component } from 'apprun/dist/apprun.esm.js';

export default function (source, { output, pages }) {

  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  output = join(source, output || 'public');
  pages = join(source, pages || 'pages');

  const app = express();
  const html = readFileSync(`${pages}/index.html`, 'utf8');

  app.get('*', async (req, res, next) => {

    const dom = new JSDOM(html);
    const win = global.window = dom.window;
    const document = global.document = dom.window.document;
    global.window.app = apprun;
    global.window.Component = Component;
    global.HTMLElement = dom.window.HTMLElement;
    global.SVGElement = dom.window.SVGElement;

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
          const js_file = `${output}/${route}/index.js`;
          if (existsSync(js_file)) {
            try {
              const module = await import(js_file);
              const exp = module.default;
              if (route.startsWith('api')) {
                console.log(blue(`\t ${js_file}`));
                exp(req, res, next);
                return;
              } else {
                console.log(green(`\t ${js_file}`));
                const component = new module.default();
                component.mount && component.mount(win['app-element'] || document.body, { route });
                component.run && component.run(route, ...paths.slice(i));
              }
            } catch (e) {
              console.log(red(e.message));
              res.sendStatus(500);
            // } finally {
            //   delete require.cache[js_file];
            }
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