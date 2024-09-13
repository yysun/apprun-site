/* eslint-disable no-console */
//@ ts -check
import { readFileSync, existsSync, statSync } from 'fs';
import { JSDOM } from 'jsdom';
import apprun from 'apprun';
const { app, Component, safeHTML } = apprun;
import parse from './parse-url.js';
import { debug, warn } from './log.js';

export default async (path, output, port) => {

  const html = readFileSync(`${output}/_.html`, 'utf8');
  const dom = new JSDOM(html);
  const document = global.document = dom.window.document;
  global.window = dom.window;
  global.window.app = app;
  global.window.Component = Component;
  global.window.safeHTML = safeHTML;
  global.HTMLElement = dom.window.HTMLElement;
  global.SVGElement = dom.window.SVGElement;
  global.navigator = dom.window.navigator;
  global.location = dom.window.location;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;
  global.localStorage = dom.window.localStorage;
  global.sessionStorage = dom.window.sessionStorage;
  global.addEventListener = dom.window.addEventListener;
  global.removeEventListener = dom.window.removeEventListener;
  global.cancelAnimationFrame = dom.window.cancelAnimationFrame;

  const routes = parse(path);
  let next_element = 'body';
  let el = document.body;

  for (const route of routes) {
    const route_path = route[0];
    const params = route[1];

    const set_next_element = (path) => {

      let new_next_element = path.replace(/\//g, '-').substring(1);
      new_next_element = new_next_element || 'main';
      new_next_element += '-app';
      if (new_next_element) {
        const new_el = document.getElementById(new_next_element);
        if (new_el) {
          next_element = new_next_element;
          el = new_el;
        } else {
          warn('Element not found:', new_next_element);
        }
      }
    };

    if (route_path === '/') {
      const main_file = `${output}/main.js`;
      if (existsSync(main_file)) {
        await run_module(el, main_file, route_path, params);
        set_next_element('/main');
      }
      if (routes.length > 1) continue;  // skip /index.js
    }

    // debug(route_path, ' => ' + next_element);

    const js_index = `${output}${route_path}/index.js`;
    const js_file = `${output}${route_path}.js`;
    if (existsSync(js_index)) {
      await run_module(el, js_index, route_path, params);
      set_next_element(route_path );
    } else if (existsSync(js_file)) {
      await run_module(el, js_file, route_path, params);
      set_next_element(route_path);
    }
  }
  return document.documentElement.outerHTML;

  async function run_module(element, js_file, route, params) {

    let lock = 0;

    const fetch = global.fetch;
    global.fetch = async (url, ...p) => {
      lock++;
      try {
        if (url.startsWith('/')) url = `http://localhost:${port}${url}`;
        return await fetch(url, ...p);
      } finally {
        lock--;
      }
    };

    window.requestAnimationFrame = (cb) => {
      lock++;
      setTimeout(() => {
        try {
          cb();
        } finally {
          lock--;
        }
      }, 0);
    };

    const { mtimeMs } = statSync(js_file);
    const module = await import(`file://${js_file}?${mtimeMs}`);
    const exp = module.default;
    if (exp.prototype && exp.prototype.constructor.name === exp.name) {
      const component = new module.default();
      component.mount && component.mount(element, { route });
      component.run && await component.run(route, ...params);
      component.unmount && component.unmount();
    } else if (typeof exp === 'function') {
      const vdom = await exp(...params);
      if (vdom) {
        app.render(element, vdom);
      }
    }

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (lock === 0) {
          clearInterval(interval);
          resolve(module);
        }
      }, 10);
    });
  }
};
