const yaml = require('js-yaml');
const fs = require('fs');
const app = require('apprun').app;


let config;
app.on('get-global-config', () => config);

module.exports = async function (source) {
  config = yaml.load(fs.readFileSync(`${source}/apprun-site.yml`, 'utf8'));
  // const a = await app.query('get-global-config');
  // console.log(a)

  const { modules } = config;
  modules.forEach(module => require(`${__dirname}/${source}/modules/${module}`));

  app.run('begin-site');
}