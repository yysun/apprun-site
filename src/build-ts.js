// @ts-check
const app = require('apprun').app;
const events = require('./events');

app.on(`${events.BUILD}.esbuild`, (file, target) => {
  return require('esbuild').buildSync({
    entryPoints: [file],
    outdir: target
  })
});

