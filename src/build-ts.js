/* eslint-disable no-console */
//@ts-check
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
const { cyan, green, magenta, gray} = chalk;
import render_page from './render.js';
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
  const { site_url, route, app_element, output, pages, live_reload, relative, source, csr } = config;
  const route_hash = route === '#';
  const main_file = `${pages}/main.tsx`;
  const tsx_file = `${output}/main.tsx`;
  const main_js_file = `${output}/main.js`;
  const init = existsSync(main_file);
  const pages_main = path.relative(output, `${pages}/main`).replace(/\\/g, '/');

  const main = `import app from 'apprun';
  const get_element = () => {
    const app_element = ${app_element ? `'${app_element}'` : 'window["app-element"];'}
    const el = typeof app_element === 'string' ? document.getElementById(app_element) : app_element;
    if (!el) console.warn(\`window['app-element'] not defined, will use document.body\`);
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
${init ? `import main from '${pages_main}';
export default main;
main();
`: 'export default () => {}'}
`;


  const main_push = `import app from 'apprun';

${init ? `import main from '${pages_main}';
export default main;
main();
`: 'export default () => {}'}

// window.onload = ()=> {

//   const get_element = () => {
//     const app_element = ${app_element ? `'${app_element}'` : 'window["app-element"];'}
//     const el = typeof app_element === 'string' ? document.getElementById(app_element) : app_element;
//     if (!el) console.warn(\`window['app-element'] not defined, will use document.body\`);
//     return el || document.body;
//   }

//   const es = new EventSource('/_' + document.location.pathname);
//   es.onmessage = async function (event) {
//     const data = JSON.parse(event.data);
//     for (const result of data) {
//       const timestamp = Date.now();
//       ${live_reload ? `
//       const module = await import(\`/\${result}?\${timestamp}\`);`: `
//       const module = await import(\`/\${result}\`);`}
//       const exp = module.default;
//       if (exp.prototype && exp.prototype.constructor.name === exp.name) {
//         const component = new module.default();
//         component.mount(get_element());
//         if (component.state instanceof Promise) {
//           component.state = await component.state;
//         }
//         app.route(location.pathname);
//       } else {
//         const vdom = await exp();
//         app.render(get_element(), vdom);
//       }
//     }
//   };

//   es.addEventListener('end', function (event) {
//     es.close();
//   });

//   es.onerror = function (event) {
//     es.close();
//   }
// };
`;

  writeFileSync(tsx_file, csr ? main : main_push);
  await esbuild(tsx_file, main_js_file);
  // unlinkSync(tsx_file);
  console.log(green('Created main file'), 'main.js',
    magenta(`(live reload: ${live_reload || false}, client side rendering: ${csr || false})`));

  const entryPoints = [main_js_file, ...routes.map(route => `${output}${route[1]}`)];
  bundle(output, entryPoints);
  console.log(cyan('Bundled: '), entryPoints.map(p => relative(p)));

  const server_js_file = `${source}/server.js`;
  if (!existsSync(server_js_file)) {
    writeFileSync(server_js_file, `import server from 'apprun-site/server.js';
const port = process.env.PORT || 8080;
const app = server();
app.listen(port, () => console.log(\`Your app is listening on http://localhost:\${port}\`));
  `);
    console.log(green('Created server file'), relative(server_js_file));
  } else {
    console.log(gray('Server file exists, skipped'), relative(server_js_file));
  }
};

export const render = async (config) => {
  const { output, relative } = config;
  let pages = routes.map(route => route[0]);
  config['static-pages'] && (pages = pages.concat(config['static-pages']));

  for (let i = 0; i < pages.length; i++) {
    const route = pages[i];
    const html_file = path.join(output, route, 'index.html');
    console.log(magenta('Creating File'), relative(html_file));
    const content = await render_page(route + '/', config);
    writeFileSync(html_file, content, { flag: 'w' });
  };
}