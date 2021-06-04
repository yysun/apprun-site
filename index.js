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
  app.source = source;
  app.pages = path.join(source, pages || 'pages');
  app.public = path.join(source, public || 'public');
  app.clean = clean;
  app.watch = watch;
  app.cust_theme = path.join(source, "themes", theme.name);
  app.sys_theme = path.join(__dirname, "src", "themes", theme.name);

  config.root = config.root || '/';
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

  if (start) {
    await app.query(start);
  } else {
    await app.query(events.PRE_BUILD);
    await app.query(events.BUILD);
    await app.query(events.POST_BUILD);
  }
}

module.exports = { build }