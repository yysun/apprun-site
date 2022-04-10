#!/usr/bin/env node

import { program } from 'commander';
import degit from 'degit';
import build from './index.js';
import server from './server.js';

program
  .command('init')
  .description('initialize a new app')
  .argument('[targetDir]', 'target directory (default: current directory)')
  .option('-r, --repo [repo]', 'repository, default: apprunjs/apprun-starter', 'apprunjs/apprun-starter')
  .action((targetDir = '.', { repo }) => {

  console.log('Cloning from: ', repo);
    const emitter = degit(repo, {
      cache: false,
      force: false,
      verbose: true
    });
    emitter.on('info', info => console.log(info.message));
    emitter.clone(targetDir || '').then(() => {
      console.log('Project cloned to: ', targetDir);
      console.log('Please go to the project directory and run:')
      console.log('\tnpm install')
      console.log('\tnpm start')
      console.log('And then, you can visit the project at: http://localhost:8080');
    });
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

program
  .command('dev [source]')
  .description('launch development server')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .action((source, options) => {
    build(source, { ...options, watch: true });
    server(source, options);
  });

program.parseAsync(process.argv);