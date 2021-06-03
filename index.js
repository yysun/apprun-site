const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const app = require('apprun').app;
const events = require('./src/events');

async function build({ source, clean, watch, pages, public }) {
  source = (source && source !== '.') ?
    path.join(process.cwd(), source) :
    process.cwd();

  const conf = `${source}/apprun-site.yml`;
  if (!fs.existsSync(conf)) {
    console.log(red('Cannot read ', conf));
    return;
  }
  const config = yaml.load(fs.readFileSync(conf));
  const { plugins, start, theme, site_url, tabs } = config;
  config.source = source;
  config.pages = path.join(source, pages || 'pages');
  config.public = path.join(source, public || 'public');
  config.clean = clean;
  config.watch = watch;
  config.site_url = site_url || '';
  if (!config.site_url.endsWith('/')) config.site_url += '/';
  // nav
  config.nav = tabs ?
    Object.keys(tabs).map(key => ({
      link: `${config.site_url}${tabs[key] || ''}`,
      text: key
    }))
    : null;
  app.config = config;

  // system modules
  // modules?.forEach(module => require(`${__dirname}/src/${module}`));
  require('./src/build');

  // plugins
  plugins?.forEach(module => require(`${source}/plugins/${module}`));

  // theme
  app.get_theme_view = name => {
    const cust_themeView = path.join(source, "themes", theme.name, `${name}.js`);
    const sys_themeView = path.join(__dirname, "src", "themes", theme.name, `${name}.js`);
    if (fs.existsSync(cust_themeView)) {
      console.log(yellow('Use custom view'), cust_themeView.replace(process.cwd(), '').substr(1));
      return require(cust_themeView);
    } else if (!fs.existsSync(sys_themeView)) {
      console.log(red(`Err: Cannot find theme view: ${theme.name}/${name}`));
    } else {
      return require(sys_themeView);
    }
  }

  if (start) {
    await app.query(start);
  } else {
    await app.query(events.PRE_BUILD);
    await app.query(events.BUILD);
    await app.query(events.POST_BUILD);
  }
}

module.exports = { build }