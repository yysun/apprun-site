// @ts-check

import { readFileSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import { load } from 'js-yaml';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import WebSocket from 'ws';
import chokidar from 'chokidar';
import _ from 'lodash';
import { JSDOM } from 'jsdom';
import _fetch from 'isomorphic-fetch';

import { app as apprun, Component, safeHTML } from 'apprun/dist/apprun.esm.js';

export default function (source, config) {
  let { output, no_ssr, live_reload, port } = config;
  port = port || 8080;
  no_ssr = no_ssr || config['no-ssr'];

  const app = express();

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
    const html = readFileSync(`${output}/index.html`, 'utf8');
    const dom = new JSDOM(html);
    const win = global.window = dom.window;
    const document = global.document = dom.window.document;
    global.fetch = (url, ...p) => {
      if (url.startsWith('/')) url = `http://localhost:${port}${url}`;
      return _fetch(url, ...p);
    }
    global.window.app = apprun;
    global.window.Component = Component;
    global.window.safeHTML = safeHTML;
    global.HTMLElement = dom.window.HTMLElement;
    global.SVGElement = dom.window.SVGElement;

    const get_element = () => {
      const el = document.getElementById(win['app-element']);
      if (!el) console.log(red(`window['app-element'] not defined`));
      return el || document.body;
    }

    const render = async (js_file, route, params) => {
      try {
        const { mtimeMs } = statSync(js_file);
        const module = await import(`${js_file}?${mtimeMs}`);
        const exp = module.default;
        if (exp.prototype && exp.prototype.constructor.name === exp.name) {
          console.log(green(`\t ${js_file}`));
          const component = new module.default();
          component.mount && component.mount(get_element(), { route });
          component.run && component.run(route, ...params);
        } else if (typeof exp === 'function') {
          const vdom = await exp(...params);
          vdom && apprun.render(get_element(), vdom);
        }
      } catch (e) {
        console.log(red(e.message));
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
      } else if (no_ssr) {
        res.sendFile(`${output}/index.html`);
      } else {
        if (existsSync(main_file)) {
          console.log(green(`\t ${main_file}`));
          await render(main_file, '/', []);
        }
        const paths = path.split('/');
        for (let i = paths.length - 1; i > 1; i--) {
          const route = paths.slice(1, i).join('/');
          const js_index = `${output}/${route}/index.js`;
          const js_file = `${output}/${route}.js`;
          if (existsSync(js_index)) {
            await render(js_index, route, paths.slice(i));
          } else if (existsSync(js_file)) {
            await render(js_file, route, paths.slice(i));
          }
        }
        res.send(document.documentElement.outerHTML);
      }
    }
  });

  const server = app.listen(port, function () {
    if (live_reload) {
      const wss = new WebSocket.Server({ server });
      const send = data => {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            // console.log(green(`\tWS Sending ${data}`));
            client.send(data);
          }
        });
      }
      chokidar.watch(output).on('all', _.debounce((event, path) => {
        if (event === 'change' || event === 'add') {
          send(JSON.stringify({ event, path: '/' + relative(output, path) }));
        }
      }, 300));
    }

    console.log(yellow(`Your app is listening on http://localhost:${port}`));
    console.log(yellow(`Serving from:${output}`));
    console.log(`SSR ${no_ssr ? 'disabled' : 'enabled'}.`);
    console.log(`Live reload ${!live_reload ? 'disabled' : 'enabled'}.`);
  });
}