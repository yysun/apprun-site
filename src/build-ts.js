const events = require('./events');

app.on(`${events.BUILD}:esbuild`, (file, target) => {
  const result = require('esbuild').buildSync({
    entryPoints: [file],
    outfile: target,
    bundle: true,
  });
  result.errors.length && console.log(red(result.errors));
  result.warnings.length && console.log(red(result.warnings));
});

