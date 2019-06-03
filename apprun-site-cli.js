#!/usr/bin/env node

const cli = require('cac')();
const degit = require('degit');
const build = require('./cli-build');
const fix = require('./cli-esm-fix');

cli
  .command('build', 'build pages')
  .option('-r, --root [root]', 'event root, default /, you can make it #')
  .option('-s, --source [sourceDir]', 'source directory')
  .option('-t, --target [targetDir]', 'target directory')
  .option('-w, --watch', 'watch the folder')
  .option('-V, --verbose', 'show verbose diagnostic information')
  .action(options => build(options));

cli
  .command('fix-esm', 'fix es modules')
  .option('-m --modules <modules>', 'Choose a directory for global modules', { default: '_modules' })
  .option('-V, --verbose', 'show verbose diagnostic information')
  .option('-s, --source [sourceDir]', 'source directory')
  .action(options => fix(options));

cli
  .command('init [targetDir]', 'initialize project')
  .option('-r, --repo [repo]', 'source directory')
  .action((targetDir = '.', options) => {
    const repo = options.repo || 'apprunjs/apprun-starter';
    const emitter = degit(repo, {
      cache: true,
      force: false,
      verbose: true
    });
    emitter.on('info', info => console.log(info.message));
    emitter.clone(targetDir || '').then(() => console.log('done'));
  });

cli.help();
cli.version('0.4.0');
cli.parse();
