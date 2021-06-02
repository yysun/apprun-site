// @ts-check
const app = require('apprun').app;
const events = require('./events');

const build = (file, target) => {
  require('esbuild').buildSync({
    entryPoints: [file],
    outdir: target
  })
}

app.on(`${events.BUILD}:tsx`, build);
app.on(`${events.BUILD}:ts`, build);
app.on(`${events.BUILD}:jsx`, build);
app.on(`${events.BUILD}:js`, build);

