import { app } from 'apprun/dist/apprun.esm.js';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, readFileSync, mkdirSync, copyFileSync, rmSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import esbuild from 'esbuild';
import { BUILD } from './events.js';
import startup from './startup.js';

const routes = [];

app.on(`${BUILD}:component`, (content, target, output) => {
  const component = `const Component = window['Component'];
  export default class extends Component {
    // ${JSON.stringify(content)}
    view = () => \`_html:${content.content}\`
  }`;
  const tsx_file = target.replace(/\.[^/.]+$/, '.tsx');
  writeFileSync(tsx_file, component);
  app.run(`${BUILD}:esbuild`, tsx_file, target, output);
});

app.on(`${BUILD}:esbuild`, (file, target) => {
  const result = esbuild.buildSync({
    entryPoints: [file],
    outfile: target,
    format: 'esm',
    bundle: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production'
  });
  result.errors.length && console.log(red(result.errors));
  result.warnings.length && console.log(yellow(result.warnings));
});

app.on(`${BUILD}:add-route`, (route, target, output) => {
  const module_file = target.replace(output, '').replace(/\\/g, '/');
  route = (route || '/').replace(/\\/g, '/');
  module_file.endsWith('index.js') && routes.push([route, module_file]);
});

app.on(`${BUILD}:startup`, (config, output, pages) => {

  const route_hash = config.route === '#';
  const main_file = `${pages}/main.tsx`;
  const tsx_file = `${output}/main.tsx`;
  const main_js_file = `${output}/main.js`;
  const init = existsSync(main_file) ? readFileSync(main_file).toString() : '';
  const { apprun_dev_tool, layout, app_element } = config;

  const main = `${startup}
${apprun_dev_tool ? 'add_js("https://unpkg.com/apprun/dist/apprun-dev-tools.js");' : ''}
${layout ? `import layout from '../${config.layout}';` : ''}
let components = ${JSON.stringify(routes)};
add_components(components, '${config.site_url}', ${app_element ? `'${app_element}'` : 'document.body'});

${init}

${layout ? `render_layout(layout).then(() => {
  app.route(${route_hash ? 'loacation.hash' : 'location.pathname'});
});`
  :
`app.route(${route_hash ? 'loacation.hash' : 'location.pathname'});`}

${!route_hash ? `
document.body.addEventListener('click', e => {
  const element = e.target as HTMLElement;
  const menu = (element.tagName === 'A' ? element : element.closest('a')) as HTMLAnchorElement;
  if (menu && menu.pathname.startsWith('/')) {
    e.preventDefault();
    history.pushState(null, '', menu.href);
    app.route(menu.pathname);
  }
});` : ''}

`;

  writeFileSync(tsx_file, main);
  app.run(`${BUILD}:esbuild`, tsx_file, main_js_file, output);
});

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

const write_html = (file, content, config) => {
  ensure(dirname(file));
  content = content.replace('<head>', `<head><base href="${config.site_url}" />`);
  content = content.replace('href="/style.css"', `href="${config.site_url}/style.css"`);
  content = content.replace('</body>', `<script type="module" src="${config.site_url}/main.js"></script></body>`);
  writeFileSync(file, content);
  console.log('\t', green(file));
};

app.on(`${BUILD}:static`, async (config, output) => {

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const port = config['dev-server']['port'] || 8080;
  const dev_server = `http://localhost:${port}`;

  console.log(cyan('Creating Static Files from: ', dev_server));

  copyFileSync(`${output}/index.html`, `${output}/404.html`);

  let pages = routes.map(route => route[0]);
  config['static-pages'] && (pages = pages.concat(config['static-pages']));

  for (let i = 0; i < pages.length; i++) {
    const route = pages[i];
    const html_file = join(output, route, 'index.html');
    if (existsSync(html_file)) rmSync(html_file);

    await page.goto(`${dev_server}${route}`, { waitUntil: 'networkidle0' });
    const content = await page.evaluate(() => document.querySelector('*').outerHTML);
    write_html(html_file, content, config);
  };

  await browser.close();
});
