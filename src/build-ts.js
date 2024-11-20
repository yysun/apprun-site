//@ts-check
import { writeFileSync, existsSync, copyFileSync, readFileSync, unlinkSync, renameSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
const { cyan, green, magenta, gray, yellow } = chalk;
import { bundle } from './esbuild.js';
import vfs from './vfs.js';

export const routes = [];
const clean_up = [];

export const build_ts = async (file, target, config) => {
  add_route(file, target, config);
};

export const build_component = async (content, target, config) => {
  const { pages, output } = config;
  const html = content.replace(/`/g, '\\`');
  const component = `const {safeHTML} = window;
  export default () => safeHTML(\`${html}\`);`;
  let tsx_file = target.replace(/\.[^/.]+$/, '.tsx');
  tsx_file = tsx_file.replace(output, pages);
  if (!tsx_file.endsWith('index.tsx')) return;
  writeFileSync(tsx_file, component);
  add_route(tsx_file, target, config);
  clean_up.push(tsx_file);
};

const add_route = (file, target, config) => {
  const { output } = config;
  const module_file = target.replace(output, '').replace(/\\/g, '/');
  let route = module_file.replace(/\/index.js$/, '');
  route = (route || '/').replace(/\\/g, '/');
  if (module_file.endsWith('index.js') && !routes.find(r => r[0] === route && r[1] === module_file)) {
    routes.push([route, module_file, file]);
    console.log(cyan('Added route:'), route);
  }
};

export const build_main = async (config) => {
  const { base_dir, output, pages, live_reload, relative, source, csr } = config;
  const main_file = `${pages}/main.tsx`;
  const tsx_file = `${pages}/_main.tsx`;
  const init = existsSync(main_file);
  const pages_main = path.relative(output, `${pages}/main`).replace(/\\/g, '/');

  console.log(green('Base dir'), base_dir);

  let main = `import app from 'apprun';
${init ? `import main from '${pages_main}';` : 'const main = () => {}'}
export default main;
main();
const base_dir = '${base_dir}';
const get_element = (path) => {
  const paths = path.split('/').filter(p => !!p);
  paths.pop();
  let element_id = !paths.length ? 'main' : paths.join('-');
  element_id += '-app';
  const el = document.getElementById(element_id);
  console.assert(!!el, \`\${element_id} not found, component will display\`);
  return element_id;
};

const handlerPromises = new Map();
const resolvePromise = (path: string) => {
  const deferred = handlerPromises.get(path);
  if (deferred) {
    deferred.resolve();
    handlerPromises.delete(path);
  }
}
const add_component = (path, base_dir) => {
  const file = path === '/' ? '/index.js' : path + '/index.js';
  app.once(path, async () => {
    const timestamp = Date.now();
    ${live_reload ? `
    const module = await import(\`\${base_dir}\${file}?\${timestamp}\`);`: `
    const module = await import(\`\${base_dir}\${file}\`);`}
    const exp = module.default;
    if (exp.prototype && exp.prototype.constructor.name === exp.name) {
      const component = new module.default();
      if (component.state instanceof Promise) {
        component.state = await component.state;
      }
      const rendered = component.rendered;
      component.rendered = (...p) => {
        rendered && rendered(...p);
        resolvePromise(path);
      }
      component.start(get_element(path), { route: path });
    } else {
      const start = async (...p) => {
        const vdom = await exp(...p);
        const element_id = get_element(path);
        const el = document.getElementById(element_id);
        app.render(el, vdom);
        resolvePromise(path);
      };
      await start();
      app.on(path, start);
    }
    resolvePromise(path);
  });
};
const components = ${JSON.stringify(routes.map(r => r[0]).sort())};
const route = async (path) => {
  // Remove base path from the incoming path
  const normalizedPath = path.startsWith(base_dir) ? path.substring(base_dir.length) : path;
  
  if (normalizedPath === '/' || normalizedPath === '') {
    app.run('/');
    return;
  }
  const paths = normalizedPath.split('/').filter(p => !!p);
  let routed = false;
  for (let i=0; i<paths.length; i++) {
    const current = '/' + paths.slice(0, i+1).join('/');
    const component = components.find(item => item === current);
    if (component) {
      routed = component === normalizedPath;
      let resolveFn;
      const promise = new Promise((resolve) => {
        resolveFn = resolve;
      });
      handlerPromises.set(current, { resolve: resolveFn });
      app.run(current, ...paths.slice(i+1));
      await promise;
    }
  }
  console.assert(!!routed, \`\${normalizedPath} can not be routed.\`);
};

app.route = route;
window.onload = async () => {
  components.map(item => add_component(item, '${base_dir}'));
  app.route(location.pathname);
};`;

  if (csr) {
    main += `
document.body.addEventListener('click', e => {
  const element = e.target as HTMLElement;
  const menu = (element.tagName === 'A' ? element : element.closest('a')) as HTMLAnchorElement;
  if (menu &&
    menu.origin === location.origin) {
    e.preventDefault();
    history.pushState(null, '', menu.origin + base_dir + menu.pathname);
    app.run('//');
    app.route(menu.pathname);
  }
});
window.addEventListener("popstate", () => route(location.pathname));
`;
  };

  if (live_reload) {
    main += `
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
function init_refresh() {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = protocol + window.location.host + window.location.pathname + '/ws';
  const socket = new WebSocket(address);
  socket.onmessage = function (msg) {
    const path = JSON.parse(msg.data);
    if(path.endsWith('.css')) {
      reload_css(location.protocol + '//' + location.host + path);
    } else {
      window.location.reload();
    }
  }
  console.log('Live reload enabled.');
}
window.addEventListener('DOMContentLoaded', init_refresh);`;
  };

  writeFileSync(tsx_file, main);

  console.log(green('Created _main.tsx'),
    magenta(`(live reload: ${live_reload || false}, client side rendering: ${csr || false})`));

  if (!config.dev) {
    const pages_index_html = `${config.pages}/index.html`;
    const main_index_html = `${config.output}/_.html`;
    if (existsSync(pages_index_html)) {
      const content = readFileSync(pages_index_html, 'utf8');
      writeFileSync(main_index_html, content);
      console.log(green('Copied index.html to '), relative(main_index_html));
    }
  }
};

export async function run_bundle(config) {
  const { pages, output } = config;
  const main_tsx_file = `${pages}/_main.tsx`;
  const entryPoints = [main_tsx_file, ...routes.map(route => route[2])];
  await bundle(output, entryPoints, config);

  if (config.dev) {
    const { content } = vfs.get('/_main.js');
    vfs.set('/main.js', content, 'js');
  } else {
    renameSync(`${output}/_main.js`, `${output}/main.js`);
  }

  clean_up.push(main_tsx_file);
  clean_up.forEach(f => existsSync(f) && unlinkSync(f));
  clean_up.length = 0;

  console.log(cyan('Bundled: '), entryPoints.map(p => '/' +
    path.relative(pages, p).replace(/\\/g, '/')));
}