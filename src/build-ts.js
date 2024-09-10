/* eslint-disable no-console */
//@ts-check
import { writeFileSync, existsSync, unlinkSync, copyFileSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
const { cyan, green, magenta, gray} = chalk;
import esbuild, { bundle } from './esbuild.js';

export let routes = [];

export const build_component = async (content, target) => {
  const html = content.replace(/`/g, '\\`');
  const component = `const {safeHTML} = window;
  export default () => safeHTML(\`${html}\`);`;
  const tsx_file = target.replace(/\.[^/.]+$/, '.tsx');
  if (!tsx_file.endsWith('index.tsx')) return;
  writeFileSync(tsx_file, component);
  await esbuild(tsx_file, target);
  unlinkSync(tsx_file);
};

export const add_route = (route, target, output) => {
  const module_file = target.replace(output, '').replace(/\\/g, '/');
  route = (route || '/').replace(/\\/g, '/');
  if (module_file.endsWith('index.js')) {
    routes.push([route, module_file]);
  }
};

export const build_main = async (config) => {
  const { site_url, output, pages, live_reload, relative, source, csr } = config;
  const main_file = `${pages}/main.tsx`;
  const tsx_file = `${output}/main.tsx`;
  const main_js_file = `${output}/main.js`;
  const init = existsSync(main_file);
  const pages_main = path.relative(output, `${pages}/main`).replace(/\\/g, '/');

  const import_main = `import main from '${pages_main}';
import {app_element} from '${pages_main}';
export {app_element}
export default main;
main();
`
  const main = `import app from 'apprun';
${init ? import_main : 'export default () => {}'}

  const get_element = () => {
    const el = typeof app_element === 'string' ? document.getElementById(app_element) : app_element;
    if (!el) console.warn(\`'app-element' not defined, will use document.body\`);
    return el || document.body;
  }
  const add_component = (component, site_url) => {
    let [path, file] = component;
    app.once(path, async () => {
      const timestamp = Date.now();
      ${live_reload ? `
      const module = await import(\`\${site_url}\${file}?\${timestamp}\`);`: `
      const module = await import(\`\${site_url}\${file}\`);`}
      const exp = module.default;
      if (exp.prototype && exp.prototype.constructor.name === exp.name) {
        const component = new module.default();
        component.mount(get_element(), { route: path });
        if (component.state instanceof Promise) {
          component.state = await component.state;
        }
      } else {
        app.on(path, async (...p) => {
          const vdom = await exp(...p);
          app.render(get_element(), vdom);
        });
      }
      app.route(location.pathname);
    });
  }
window.onload = async () => {
  const components = ${JSON.stringify(routes)};
  components.map(item => add_component(item, '${site_url}'));
  app.route(${!csr ? 'loacation.hash' : 'location.pathname'});
};
${csr ? `
const route = app.route;
app.route = null;
document.addEventListener("DOMContentLoaded", () => app.route = route);
document.body.addEventListener('click', e => {
  const element = e.target as HTMLElement;
  const menu = (element.tagName === 'A' ? element : element.closest('a')) as HTMLAnchorElement;
  if (menu &&
    menu.origin === location.origin &&
    menu.pathname.startsWith('/') && !menu.hash) {
    e.preventDefault();
    history.pushState(null, '', menu.href);
    app.route(menu.pathname);
  }
});` : ''}
${live_reload ? `
function reload_css(path) {
  const sheets = document.getElementsByTagName("link");
  for (let i = 0; i < sheets.length; ++i) {
    const elem = sheets[i], parent = elem.parentElement;
    if (elem.href === path) {
      parent.removeChild(elem);
      break;
    }
  }
}
function _init_refresh() {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = protocol + window.location.host + window.location.pathname + '/ws';
  const socket = new WebSocket(address);
  socket.onmessage = function (msg) {
    const {event, path} = JSON.parse(msg.data);
    if(path.endsWith('.css')) {
      reload_css(location.protocol + '//' + location.host + path);
    } else {
      window.location.reload();
    }
  }
  console.log('Live reload enabled.');
}
window.addEventListener('DOMContentLoaded', _init_refresh);
` : ''}
`;

  writeFileSync(tsx_file, main);
  await esbuild(tsx_file, main_js_file);
  // unlinkSync(tsx_file);
  console.log(green('Created main file'), 'main.js',
    magenta(`(live reload: ${live_reload || false}, client side rendering: ${csr || false})`));

  const entryPoints = [main_js_file, ...routes.map(route => `${output}${route[1]}`)];
  bundle(output, entryPoints);
  console.log(cyan('Bundled: '), entryPoints.map(p => relative(p)));

  const server_js_file = `${source}/server.js`;
  if (!existsSync(server_js_file)) {
    const server_fn = new URL('./server.js', import.meta.url);
    copyFileSync(server_fn, server_js_file);
    console.log(green('Created server file'), relative(server_js_file));
  } else {
    console.log(gray('Server file exists, skipped'), relative(server_js_file));
  }
};
