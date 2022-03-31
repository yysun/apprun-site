#!/usr/bin/env node

import { program } from 'commander';
import degit from 'degit';
import build from './index.js';
import server from './server.js';

program
  .command('init [targetDir]')
  .description('initialize project', { targetDir: 'target directory (default: current directory)' } )
  .option('-r, --repo [repo]', 'repository, default: apprunjs/apprun-starter', 'apprunjs/apprun-starter')
  .action((targetDir = '.', { repo }) => {
    console.log(repo)
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
  .option('-r, --render', 'pre-render html pages', false)
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .action(build);

program
  .command('serv [source]')
  .description('launch development server')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .action(server);

program.parseAsync(process.argv);