const path = require('path');
const app = require('apprun').app;
const events = require('./src/events');

module.exports = async function ({ source, clean, watch, pages, public }) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;

  const config = {};
  config.source = source;
  config.pages = path.join(source, pages || 'pages');
  config.public = path.join(source, public || 'public');
  config.clean = clean;
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