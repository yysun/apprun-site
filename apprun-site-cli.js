#!/usr/bin/env node

import { program } from 'commander';
import build from './index.js';
import server from './server.js';

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
  .command('serve [source]')
  .description('launch development server, live reload is optional')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .option('-n, --no_ssr', 'disable server side rendering', false)
  .option('-l, --live_reload', 'enable live reload', false)
  .action((source, options) => {
    server(source, options);
  });

program
  .command('dev [source]')
  .description('launch development server, watch and live reload')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .option('-n, --no_ssr', 'disable server side rendering', false)
  .action((source, options) => {
    build(source, { ...options, watch: true, live_reload: true });
    server(source, options);
  });

program.parseAsync(process.argv);