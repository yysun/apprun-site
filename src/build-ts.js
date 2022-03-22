const path = require('path');
const fs = require('fs');
const events = require('./events');
const chalk = require('chalk');
const { default: app } = require('apprun');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const routes = [];

app.on(`${events.BUILD}:component`, (content, target, public) => {
  const component = `const Component = window['Component'];
  export default class extends Component {
    // ${JSON.stringify(content)}
    view = () => \`_html:${content.content}\`
  }`;
  const tsx_file = target.replace(/\.[^/.]+$/, '.tsx');
  fs.writeFileSync(tsx_file, component);
  app.run(`${events.BUILD}:esbuild`, tsx_file, target, public);
});

app.on(`${events.BUILD}:esbuild`, (file, target) => {
  const result = require('esbuild').buildSync({
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

app.on(`${events.BUILD}:add-route`, (route, target, public) => {
  const module_file = target.replace(public, '').replace(/\\/g, '/');
  route = (route || '/').replace(/\\/g, '/');
  module_file.endsWith('index.js') && routes.push([route, module_file]);
});

app.on(`${events.BUILD}:startup`, (config, public) => {
  const startup = require('./startup');
  const new_config = JSON.parse(JSON.stringify(config));
  delete new_config['plugins'];
  delete new_config['dev-tools'];
  delete new_config['static-pages'];
  const main = `${startup}
    window['config'] = ${JSON.stringify(new_config)};
    const components = ${JSON.stringify(routes)};

    import layout from '../${config.theme.name}';
    add_components(components, '${config.site_url}', '${config.theme.main_element}');
    render_layout(layout);
    ${config['dev-tools']['apprun'] ? 'load_apprun_dev_tools();' : ''}
  `;

  const tsx_file = `${public}/main.tsx`;
  const target = `${public}/main.js`;
  fs.writeFileSync(tsx_file, main);
  app.run(`${events.BUILD}:esbuild`, tsx_file, target, public);
});

const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const write_html = (file, content, config) => {
  ensure(path.dirname(file));
  content = content.replace('<head>', `<head><base href="${config.site_url}" />`);
  content = content.replace('href="/style.css"', `href="${config.site_url}/style.css"`);
  content = content.replace('</body>', `<script type="module" src="${config.site_url}/main.js"></script></body>`);
  fs.writeFileSync(file, content);
  console.log('\t', green(file));
};

app.on(`${events.BUILD}:static`, async (config, public) => {

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const port = config['dev-tools']['port'] || 8080;
  const dev_server = `http://localhost:${port}`;

  console.log(cyan('Creating Static Files from: ', dev_server));
  await page.goto(dev_server, { waitUntil: 'networkidle0' });

  let pages = routes.map(route => route[0]);
  config['static-pages'] && (pages = pages.concat(config['static-pages']));

  for (let i = 0; i < pages.length; i++) {
    const route = pages[i];
    const html_file = path.join(public, route, 'index.html');
    await page.evaluate((route) => new Promise(resolve => {
      app.run(route);
      resolve();
    }, route));

    // await page.evaluate((route) => app.run(route), route);

    const content = await page.evaluate(() => document.querySelector('*').outerHTML);
    write_html(html_file, content, config);
  };

  await page.evaluate(() => document.body.innerHTML = '');
  const default_page = await page.evaluate(() => document.querySelector('*').outerHTML);
  write_html(`${public}/default.html`, default_page, config);

  await browser.close();
});
