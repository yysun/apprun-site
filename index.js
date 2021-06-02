const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const app = require('apprun').app;
const events = require('./src/events');

module.exports = async function (source) {
  const config = yaml.load(fs.readFileSync(`${source}/apprun-site.yml`));
  config.source = `${process.cwd()}/${source}/`;
  config.pages = `${process.cwd()}/${source}/${config.pages || 'pages'}`;
  config.public = `${process.cwd()}/${source}/${config.public || 'public'}`;
  const { plugins, start, theme, site_url, tabs } = config;

  // nav
  const base = site_url || '/';
  config.nav = tabs ?
    Object.keys(tabs).map(key => ({
      link: `${base}${tabs[key] || ''}`,
      text: key
    }))
    : null;
  app.config = config;

  // plugins
  plugins?.forEach(module => require(`${process.cwd()}/${source}/plugins/${module}`));

  // theme
  app.get_theme_view = name => {
    const cust_themeView = `${process.cwd()}/${source}/themes/${theme.name}/${name}.js`;
    const sys_themeView = `${__dirname}/src/themes/${theme.name}/${name}.js`
    if (fs.existsSync(cust_themeView)) {
      console.log(yellow('Using custom view', cust_themeView));
      return require(cust_themeView);
    } else if (!fs.existsSync(sys_themeView)) {
      console.log(red(`Err: Cannot find theme view: ${theme.name}/${name}`));
    } else {
      return require(sys_themeView);
    }
  }

  // system modules
  // modules?.forEach(module => require(`${__dirname}/src/${module}`));
  require('./src/build');
  require('./src/build-md');
  require('./src/build-html');
  require('./src/build-ts');
  require('./src/build-esm');

  if (start) {
    await app.query(start);
  } else {
    await app.query(events.PRE_BUILD);;
    await app.query(events.BUILD);
    await app.query(events.POST_BUILD);
  }
}