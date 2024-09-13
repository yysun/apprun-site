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
  if (module_file.endsWith('index.js') && !routes.find(r => r[0] === route && r[1] === module_file)) {
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
export default main;
main();
`
  const main = `import app from 'apprun';
${init ? import_main : 'export default () => {}'}

  const get_element = (path) => {
    const paths = path.split('/').filter(p => !!p);
    paths.pop();
    let element_id = !paths.length ? 'main' : paths.join('-');
    element_id += '-app';
    const el = document.getElementById(element_id);
    console.assert(!!el, \`\${element_id} not found, component will display\`);
    return element_id;
  };

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
        component.mount(get_element(path), { route: path });
        if (component.state instanceof Promise) {
          component.state = await component.state;
        }
      } else {
        app.on(path, async (...p) => {
          const vdom = await exp(...p);
          const element_id = get_element(path);
          const el = document.getElementById(element_id);
          console.assert(!!el, \`\${element_id} not found, component will display\`);
          app.render(el, vdom);
        });
      }
      app.route(location.pathname);
    });
  }
const components = ${JSON.stringify(routes)};
const route = (path) => {
  let bestMatch;
  let longestMatchLength = 0;
  components.forEach((item, index) => {
    const _route = item[0];
    if (path.startsWith(_route) && (path[_route.length] === '/' || _route.length === path.length)) {
      if (_route.length > longestMatchLength) {
        longestMatchLength = _route.length;
        bestMatch = _route;
      }
    }
  });
  const idx = path.indexOf(bestMatch);
  const params = path.substring(bestMatch.length).split('/').filter(p => !!p);
  app.run(bestMatch, ...params);
};
app.route = null;
window.onload = async () => {
  app.route = route;
  components.map(item => add_component(item, '${site_url}'));
  app.route(${!csr ? 'loacation.hash' : 'location.pathname'});
};
${csr ? `
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

  // const main_no_csr = init ? import_main : 'export default () => {}';

  writeFileSync(tsx_file, main);
  await esbuild(tsx_file, main_js_file);
  // unlinkSync(tsx_file);
  console.log(green('Created main file'), 'main.js',
    magenta(`(live reload: ${live_reload || false}, client side rendering: ${csr || false})`));


  const server_js_file = `${source}/server.js`;
  if (!existsSync(server_js_file)) {
    const server_fn = new URL('./server.js', import.meta.url);
    copyFileSync(server_fn, server_js_file);
    console.log(green('Created server file'), relative(server_js_file));
  } else {
    console.log(gray('Server file exists, skipped'), relative(server_js_file));
  }
};

export async function run_bundle({ output, relative }) {
  const main_js_file = `${output}/main.js`;
  const entryPoints = [main_js_file, ...routes.map(route => `${output}${route[1]}`)];
  await bundle(output, entryPoints);
  console.log(cyan('Bundled: '), entryPoints.map(p => relative(p)));
}