const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
const app = require('apprun').app;

let config;
app.on('get-global-config', () => config);

module.exports = async function (source) {
  config = yaml.load(fs.readFileSync(`${source}/apprun-site.yml`));
  const { modules, plugins, start } = config;
  modules?.forEach(module => require(`${__dirname}/src/${module}`));
  const event = start || 'build';
  plugins?.forEach(module => require(`${process.cwd()}/${source}/plugins/${module}`));
  await app.query(`pre-${event}`);
  await app.query(`${event}`);
  await app.query(`post-${event}`);
}