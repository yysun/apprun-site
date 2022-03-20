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
  });
  result.errors.length && console.log(red(result.errors));
  result.warnings.length && console.log(yellow(result.warnings));

});

app.on(`${events.BUILD}:add-route`, (route, target, public) => {
  const module_file = target.replace(public, '');
  module_file.endsWith('index.js') &&  routes.push([route || '/', module_file]);
});

app.on(`${events.BUILD}:startup`, (config, public) => {

  const main = `import { render_layout, add_components, load_apprun_dev_tools } from './apprun_site';
    window['config'] = ${JSON.stringify(config)};
    const components = ${JSON.stringify(routes)};

    import layout from '../src/${config.theme.name}/layout';
    add_components(components, '${config.theme.main_element}');
    render_layout(layout);
    // load_apprun_dev_tools();
  `;

  const tsx_file = `${public}/main.tsx`;
  const target = `${public}/main.js`;
  fs.writeFileSync(tsx_file, main);
  app.run(`${events.BUILD}:esbuild`, tsx_file, target, public);

});
