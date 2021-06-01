const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const app = require('apprun').app;

const events = require('./src/events');

module.exports = async function (source) {
  const config = yaml.load(fs.readFileSync(`${source}/apprun-site.yml`));
  config.pages = `${process.cwd()}/${source}/${config.pages || 'pages'}`;
  config.public = `${process.cwd()}/${source}/${config.public || 'public'}`;

  const { modules, plugins, start, theme } = config;
  modules?.forEach(module => require(`${__dirname}/src/${module}`));
  plugins?.forEach(module => require(`${process.cwd()}/${source}/plugins/${module}`));
  const themePath = `${process.cwd()}/${source}/themes/${theme.name}/index.js`;
  config.themePath = fs.existsSync(themePath) ? themePath : `${__dirname}/src/themes/${theme.name}`

  app.config = config;
  if (start) {
    await app.query(start);
  } else {
    await app.query(events.PRE_BUILD);;
    await app.query(events.BUILD);
    await app.query(events.POST_BUILD);
  }
}