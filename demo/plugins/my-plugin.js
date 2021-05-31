const app = require('apprun').app;
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

app.on('pre-build', async () => {
  const config = (await app.query('get-global-config'))[0];
  console.log(green(config.site_name));
});