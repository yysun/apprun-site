//@ts-check
import { writeFileSync, existsSync, copyFileSync, readFileSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
const { cyan, green, magenta, gray} = chalk;
import { build, bundle } from './esbuild.js';
export { build as build_ts };

export let routes = [];


export const build_component = async (content, target, config) => {
  const html = content.replace(/`/g, '\\`');
  const component = `const {safeHTML} = window;
  export default () => safeHTML(\`${html}\`);`;
  const tsx_file = target.replace(/\.[^/.]+$/, '.tsx');
  if (!tsx_file.endsWith('index.tsx')) return;
  writeFileSync(tsx_file, component);
  await build(tsx_file, target, config);
  // unlinkSync(tsx_file);
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

  let main = `import app from 'apprun';
${init ? `import main from '${pages_main}';` : 'const main = () => {}'}
export default main;
main();

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
const add_component = (path, site_url) => {
  const file = path === '/' ? '/index.js' : path + '/index.js';
  app.once(path, async () => {
    const timestamp = Date.now();
    ${live_reload ? `
    const module = await import(\`\${site_url}\${file}?\${timestamp}\`);`: `
    const module = await import(\`\${site_url}\${file}\`);`}
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
const components = ${JSON.stringify(routes.map( r=> r[0]).sort())};
const route = async (path) => {
  if (path === '/') {
    app.run('/');
    return;
  }
  const paths = path.split('/').filter(p => !!p);
  let routed = false;
  for (let i=0; i<paths.length; i++) {
    const current = '/' + paths.slice(0, i+1).join('/');
    const component = components.find(item => item === current);
    if (component) {
      routed = component === path;
      let resolveFn;
      const promise = new Promise((resolve) => {
        resolveFn = resolve;
      });
      handlerPromises.set(current, { resolve: resolveFn });
      app.run(current, ...paths.slice(i+1));
      await promise;
    }
  }
  console.assert(!!routed, \`\${path} can not be routed.\`);
};

app.route = route;
window.onload = async () => {
  components.map(item => add_component(item, '${site_url}'));
  app.route(location.pathname);
};`;

  if (csr) {
    main += `
document.body.addEventListener('click', e => {
  const element = e.target as HTMLElement;
  const menu = (element.tagName === 'A' ? element : element.closest('a')) as HTMLAnchorElement;
  if (menu &&
    menu.origin === location.origin && menu.pathname.startsWith('/')) {
    e.preventDefault();
    history.pushState(null, '', menu.href);
    app.route(menu.pathname);
  }
});`;
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
  await build(tsx_file, main_js_file, config);
  // unlinkSync(tsx_file);
  console.log(green('Created main.js'), relative(main_js_file),
    magenta(`(live reload: ${live_reload || false}, client side rendering: ${csr || false})`));

  await run_bundle(config);

  if (!config.dev) {
    const pages_index_html = `${config.pages}/index.html`;
    const main_index_html = `${config.output}/_.html`;
    if (existsSync(pages_index_html)) {
      const content = readFileSync(pages_index_html, 'utf8');
      writeFileSync(main_index_html, content);
      console.log(green('Copied index.html to '), relative(main_index_html));
    }

    const server_js_file = `${source}/server.js`;
    if (!existsSync(server_js_file)) {
      const server_fn = new URL('./server.js', import.meta.url);
      copyFileSync(server_fn, server_js_file);
      console.log(green('Created server file'), relative(server_js_file));
    } else {
      console.log(gray('Server file exists, skipped'), relative(server_js_file));
    }
  }
};

export async function run_bundle(config) {
  const { output, relative } = config;
  const main_js_file = `${output}/main.js`;
  const entryPoints = [main_js_file, ...routes.map(route => `${output}${route[1]}`)];
  await bundle(output, entryPoints, config);
  console.log(cyan('Bundled: '), entryPoints.map(p => relative(p)));
}