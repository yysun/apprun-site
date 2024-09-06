//@ ts -check
import { readFileSync, existsSync, statSync } from 'fs';
import { JSDOM } from 'jsdom';
import apprun from 'apprun';
const { app, Component, safeHTML } = apprun;

export default async (path, output) => {
  let content = '';
  const paths = path.split('/');
  for (let i = paths.length - 1; i > 0; i--) {
    let route = paths.slice(1, i).join('/');
    route = route || '.';
    const js_index = `${output}/${route}/index.js`;
    const js_file = `${output}/${route}.js`;
    if (existsSync(js_index)) {
      content = await render(output, js_index, route, paths.slice(i));
      break;
    } else if (existsSync(js_file)) {
      content = await render(output, js_file, route, paths.slice(i));
      break;
    }
  }
  return content;
}

async function render(output, js_file, route, params) {
  const html = readFileSync(`${output}/_.html`, 'utf8');
  const dom = new JSDOM(html);
  const win = global.window = dom.window;
  const document = global.document = dom.window.document;

  global.window.app = app;
  global.window.Component = Component;
  global.window.safeHTML = safeHTML;
  global.HTMLElement = dom.window.HTMLElement;
  global.SVGElement = dom.window.SVGElement;
  const main_file = `${output}/main.js`;
  if (existsSync(main_file)) {
    await run_module(document.body, main_file, '/', []);
  }
  const el = document.getElementById(win['app-element']) || document.body;
  await run_module(el, js_file, route, params);
  return document.documentElement.outerHTML;
}

async function run_module(element, js_file, route, params) {
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
    vdom && app.render(element, vdom);
  }

}
