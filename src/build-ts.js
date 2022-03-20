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

app.on(`${events.BUILD}:esbuild`, (file, target, public) => {
  const result = require('esbuild').buildSync({
    entryPoints: [file],
    outfile: target,
    format: 'esm',
    bundle: true,
    sourcemap: true,
  });
  result.errors.length && console.log(red(result.errors));
  result.warnings.length && console.log(yellow(result.warnings));
});

app.on(`${events.BUILD}:add-route`, (route, target, public) => {
  const module_file = target.replace(public, '');
  module_file.endsWith('index.js') &&  routes.push([route || '/', module_file]);
});

app.on(`${events.BUILD}:startup`, (config, public) => {
  const startup = require('./startup');
  const main = `${startup}
    window['config'] = ${JSON.stringify(config)};
    const components = ${JSON.stringify(routes)};

    import layout from '../${config.theme.name}';
    add_components(components, '${config.theme.main_element}');
    render_layout(layout);
    ${config['dev-tools']['apprun'] ? 'load_apprun_dev_tools();' : ''}
  `;

  const tsx_file = `${public}/main.tsx`;
  const target = `${public}/main.js`;
  fs.writeFileSync(tsx_file, main);
  app.run(`${events.BUILD}:esbuild`, tsx_file, target, public);
});

const write_html = (file, content) => {
  content = content.replace('</body>', '<script type="module" src="/main.js"></script></body>');
  fs.writeFileSync(file, content);
};

app.on(`${events.BUILD}:static`, async (config, public) => {

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const port = config['dev-tools']['port'] || 8080;
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0'});

  const home_page = await page.evaluate(() => document.querySelector('*').outerHTML);

  write_html(`${public}/index.html`, home_page);
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i][0];
    const html_file = path.join(public, route, 'index.html');


    await page.evaluate((route) => new Promise(resolve => {
      app.run(route);
      resolve();
    }, route));

    const content = await page.evaluate(() => document.querySelector('*').outerHTML);
    write_html(html_file, content);
  };

  await browser.close();
});
