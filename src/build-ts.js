import { dirname, join } from 'path';
import { writeFileSync, existsSync, readFileSync, mkdirSync, copyFileSync, rmSync, unlinkSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import esbuild from 'esbuild';
import { BUILD } from './events.js';
import render from './render.js';

import build from './esbuild.js';

let routes = [];

app.on(`${BUILD}:start`, (content, target, output) => {
  routes = [];
});

app.on(`${BUILD}:component`, (content, target, output) => {
  const html = content.replace(/\`/g, '\\`');
  const component = `const {safeHTML} = window;
  export default () => safeHTML(\`${html}\`);`;
  const tsx_file = target.replace(/\.[^/.]+$/, '.tsx');
  if (!tsx_file.endsWith('index.tsx')) return;
  writeFileSync(tsx_file, component);
  app.run(`${BUILD}:esbuild`, tsx_file, target, output);
  unlinkSync(tsx_file);
});

app.on(`${BUILD}:esbuild`, (file, target) => {
  build(file, target);
});

app.on(`${BUILD}:add-route`, (route, target, output) => {
  const module_file = target.replace(output, '').replace(/\\/g, '/');
  route = (route || '/').replace(/\\/g, '/');
  if (module_file.endsWith('index.js')) {
    routes.push([route, module_file]);
  }
});

app.on(`${BUILD}:startup`, ({ site_url, route, app_element, output, pages, live_reload, relative, source, port }) => {

  const route_hash = route === '#';
  const main_file = `${pages}/main.tsx`;
  const tsx_file = `${output}/main.tsx`;
  const main_js_file = `${output}/main.js`;
  const init = existsSync(main_file);

  // copyFileSync(`${output}/index.html`, `${output}/404.html`);

  const main = `import app from 'apprun';
  const get_element = () => {
    const app_element = ${app_element ? `'${app_element}'` : 'window["app-element"];'}
    const el = typeof app_element === 'string' ? document.getElementById(app_element) : app_element;
    if (!el) console.warn(\`window['app-element'] not defined\, will use document.body\`);
    return el || document.body;
  }
  const add_component = (component, site_url) => {
    let [path, file] = component;
    app.once(path, async (...p) => {
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
      app.route([path, ...p].join('/'));
    });
  }
window.onload = async () => {
  const components = ${JSON.stringify(routes)};
  components.map(item => add_component(item, '${site_url}'));
  app.route(${route_hash ? 'loacation.hash' : 'location.pathname'});
};
${!route_hash ? `
const route = app.route;
app.route = null;
document.addEventListener("DOMContentLoaded", () => app.route = route);
document.body.addEventListener('click', e => {
  const element = e.target as HTMLElement;
  const menu = (element.tagName === 'A' ? element : element.closest('a')) as HTMLAnchorElement;
  if (menu && menu.pathname.startsWith('/') && !menu.hash) {
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
${init ? `import main from '..${relative(pages)}/main';
export default main;
main();
`:
      'export default () => {}'}
`;

  writeFileSync(tsx_file, main);
  app.run(`${BUILD}:esbuild`, tsx_file, main_js_file, output);
  unlinkSync(tsx_file);
  console.log(green('Created main file'), 'main.js', magenta(`(live reload: ${live_reload || false})`));

  const server_file = `${output}/server.js`;
  const server_js_file = `${source}/server.js`;

  writeFileSync(server_file, `import server from 'apprun-site/server.js';
const port = process.env.PORT || 8080;
server('.', {port});`);

  build(server_file, server_js_file, { bundle: false, sourcemap: false, minify: false });
  console.log(green('Created server file'), 'server.js');

});

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

app.on(`${BUILD}:render`, async (config) => {

  const { output, relative } = config;
  let pages = routes.map(route => route[0]);
  config['static-pages'] && (pages = pages.concat(config['static-pages']));

  for (let i = 0; i < pages.length; i++) {
    const route = pages[i];
    const html_file = join(output, route, 'index.html');
    console.log(magenta('Creating File'), relative(html_file));
    const content = await render(route + '/', config);
    writeFileSync(html_file, content, { flag: 'w' });
  };

});
