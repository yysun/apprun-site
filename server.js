// @ts-check

import { existsSync, statSync } from 'fs';
import { relative } from 'path';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import express from 'express';
import WebSocket from 'ws';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import render from './src/render.js';

export default function (source, config) {
  let { output, no_ssr, live_reload, port } = config;
  config.port = port = port || 8080;
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
        console.log(cyan(`\t${home_html}`));
        res.sendFile(home_html);
      } else {
        let content = await render(path, config);
        res.send(content);
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
      chokidar.watch(output).on('all', ((event, path) => {
        debounce(() => {
          if (event === 'change' || event === 'add') {
            send(JSON.stringify({ event, path: '/' + relative(output, path) }));
          }
        }, 300);
      }));
    }

    console.log(yellow(`Your app is listening on http://localhost:${port}`));
    console.log(yellow(`Serving from:${output}`));
    console.log(`SSR ${no_ssr ? 'disabled' : 'enabled'}.`);
    console.log(`Live reload ${!live_reload ? 'disabled' : 'enabled'}.`);
  });
}