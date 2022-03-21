const fs = require('fs');

const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const app = require('apprun').app;
const events = require('./src/events');

module.exports = async function ({ source, clean, watch, pages, public }) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;

  const config = {};
  config.source = source;
  config.pages = `${source}/${pages || 'pages'}`;
  config.public = `${source}/${public || 'public'}`;
  config.clean = clean;
  config.watch = watch;
  app.config = config;

  // plugins
  config.plugins?.forEach(module => require(`${source}/plugins/${module}`));


  require('./src/build');
  require('./src/build-md');
  require('./src/build-html');
  require('./src/build-ts');

  await app.query(events.PRE_BUILD);
  await app.query(events.BUILD);
  await app.query(events.POST_BUILD);
}