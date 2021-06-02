#!/usr/bin/env node

const program = require('commander');
const degit = require('degit');
const build = require('./index');

program
  .command('init [targetDir]')
  .description('initialize project', { targetDir: 'target directory (default: current directory)' } )
  .option('-r, --repo [repo]', 'repository, default: apprunjs/apprun-starter', 'apprunjs/apprun-starter')
  .action((targetDir = '.', repo) => {
    const emitter = degit(repo, {
      cache: false,
      force: false,
      verbose: true
    });
    emitter.on('info', info => console.log(info.message));
    emitter.clone(targetDir || '').then(() => console.log('done'));
  });

program
  .command('build [source]')
  .description('build site')
  .option('-c, --clean', 'clean the output directory', false)
  .option('-w, --watch', 'watch the directory', false)
  .option('-o, --public', 'output directory', 'public')
  .option('-p, --pages', 'pages directory', 'pages')
  .action((source, options) => build({source, ...options}));

program.parse(process.args);
