/* eslint-disable no-console */
//@ ts -check
import { readFileSync, existsSync, statSync } from 'fs';
import { JSDOM } from 'jsdom';
import apprun from 'apprun';
const { app, Component, safeHTML } = apprun;

export default async (path, output) => {

  const html = readFileSync(`${output}/_.html`, 'utf8');
  const dom = new JSDOM(html);
  const win = global.window = dom.window;
  const document = global.document = dom.window.document;
  global.window.app = app;
  global.window.Component = Component;
  global.window.safeHTML = safeHTML;
  global.HTMLElement = dom.window.HTMLElement;
  global.SVGElement = dom.window.SVGElement;

  const port = process.env.PORT || 8080;
  const fetch = global.fetch;
  global.fetch = (url, ...p) => {
    if (url.startsWith('/')) url = `http://localhost:${port}${url}`;
    return fetch(url, ...p);
  };

  const main_file = `${output}/main.js`;
  if (existsSync(main_file)) {
    await run_module(document.body, main_file, '/', []);
  }
  const el = document.getElementById(win['app-element']) || document.body;
  const paths = path.split('/').filter(p => !!p);
  if (paths.length === 0) paths.push('/'); // for /index.html

  for (let i = paths.length; i > 0; i--) {
    const route = '/' + paths.slice(0,i).join('/');
    const params = paths.slice(i);
    try {
      const js_index = `${output}${route}/index.js`;
      const js_file = `${output}${route}.js`;
      if (existsSync(js_index)) {
        await run_module(el, js_index, route, params);
        break;
      } else if (existsSync(js_file)) {
        await run_module(el, js_file, route, params);
        break;
      }
    } catch (e) {
      // Module not found, continue to the next path
      if (e.code !== 'MODULE_NOT_FOUND') {
        console.error(`Error loading module for path ${route}:`, e);
      }
    }
  }
  return document.documentElement.outerHTML;
};

export async function run_module(element, js_file, route, params) {
  const { mtimeMs } = statSync(js_file);
  const module = await import(`file://${js_file}?${mtimeMs}`);
  const exp = module.default;
  // console.log(green(`\t ${js_file}`));
  if (exp.prototype && exp.prototype.constructor.name === exp.name) {
    const component = new module.default();
    component.mount && component.mount(element, { route });
    component.run && await component.run(route, ...params);
    component.unmount && component.unmount();
  } else if (typeof exp === 'function') {
    const vdom = await exp(...params);
    if (vdom) {
      return new Promise((resolve, reject) => {
        try {
          app.render(element, vdom);
          setTimeout(resolve, 500);
        } catch (e) {
          reject(e);
        }
      });
    }
  }
}
