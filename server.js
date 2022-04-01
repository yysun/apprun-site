// @ts-check

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import express from 'express';
import { JSDOM } from 'jsdom';
import { app as apprun, Component } from 'apprun/dist/apprun.esm.js';

export default function (source, { output }) {

  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  output = join(source, output || 'public');

  const app = express();

  const html = readFileSync(`${output}/index.html`, 'utf8');
  const dom = new JSDOM(html);

  global.window = dom.window;
  global.window.app = apprun;
  global.window.Component = Component;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.SVGElement = dom.window.SVGElement;

  app.get('*', async (req, res) => {

    let path = req.path;
    if (path.includes('.')) {
      res.sendFile(path, { root: output });
    } else {
      if (!path.endsWith('/')) path += '/';
      const html_file = `${output}${path}index.html`;
      const js_file = `${output}${path}index.js`;
      if (existsSync(html_file)) {
        res.sendFile(`${path}index.html`, { root: output });
      } else if (existsSync(js_file)) {
        const module = await import(js_file);
        const component = new module.default();
        component.start(dom.window.document.body);
        res.send(dom.window.document.documentElement.outerHTML);
      } else {
        res.sendFile('/404.html', { root: output });
      }
    }
  });

  const listener = app.listen(process.env.PORT || 8080, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
}