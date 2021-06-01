const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const app = require('apprun').app;

const events = require('./src/events');

let config;
app.on(events.GET_GLOBAL_CONFIG, () => config);

module.exports = async function (source) {
  config = yaml.load(fs.readFileSync(`${source}/apprun-site.yml`));

  config.pages = `${process.cwd()}/${source}/${config.pages || 'pages'}`;
  config.public = `${process.cwd()}/${source}/${config.public || 'public'}`;

  const { modules, plugins, start, theme } = config;
  modules?.forEach(module => require(`${__dirname}/src/${module}`));
  plugins?.forEach(module => require(`${process.cwd()}/${source}/plugins/${module}`));
  const themePath = `${process.cwd()}/${source}/themes/${theme.name}/index.js`;
  if (fs.existsSync(themePath)) {
    require(themePath);
  } else {
    require(`${__dirname}/src/theme.js`);
  }

  if (start) {
    await app.query(start, config);
  } else {
    await app.query(events.PRE_BUILD, config);
    await app.query(events.BUILD, config);
    await app.query(events.POST_BUILD, config);
  }
}