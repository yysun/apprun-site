#!/usr/bin/env node
/* eslint-disable no-console */

import { existsSync } from 'fs';
import { relative, join } from 'path';
import default_options from './config.js';

import { program } from 'commander';
import chalk from 'chalk';
import { build } from './index.js';
import server from './dev-server.js';
import { routes } from './src/build-ts.js';
const { red, yellow } = chalk;

async function init_options(source, options) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  options.source = source;
  options.pages = join(source, options.pages || 'pages');
  options.output = join(source, options.output || 'output');
  const conf = `${source}/apprun-site.config.js`;
  if (existsSync(conf)) {
    const config = await import(conf);
    options = { ...config.default, ...options };
  }
  options = { ...default_options, ...options };
  options['site_url'].endsWith('/') && (options['site_url'] = options['site_url'].slice(0, -1));
  // options.relative = fname => relative(source, fname);
  return { source, options };
}

program
  .version('1.3.20')
  .description('AppRun Site CLI');

program
  .command('build [source]')
  .description('build site')
  .option('-c, --clean', 'clean the output directory', false)
  .option('-w, --watch', 'watch the directory', false)
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .option('--no-csr', 'no client side routing')
  .option('-r --render', 'pre-render pages', false)
  .action(async (source, options) => {
    ({ source, options } = await init_options(source, options));
    options.dev = false;
    await build(options);
    if (options.render) {
      options.ssr = true;
      options.save = true;
      server(options);
      for (const route of routes) {
        const path = route[0];
        try {
          const port = process.env.PORT || 8080;
          const reponse = await fetch(`http://localhost:${port}${path}`);
          const html = await reponse.text();
          console.log(yellow`✔ Rendered`, path);
        } catch (e) {
          console.log(red(`✖ Render failed`), path, e.message);
        }
      }
    }
    process.exit(0);
  });

program
  .command('serve [source]')
  .description('launch preview server, live reload is optional')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('--no-ssr', 'disable server side rendering')
  .option('--no-save', 'disable auto save of side rendered pages')
  .action(async (source, options) => {
    ({ source, options } = await init_options(source, options));
    server(options);
  });

program
  .command('dev [source]')
  .description('launch development server, watch and live reload')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .option('--no-watch', 'watch the directory')
  .option('--no-live_reload', 'enable live reload')
  .option('--no-csr', 'no client side routing')
  .action(async (source, options) => {
    ({ source, options } = await init_options(source, options));
    options.ssr = false;
    options.save = false;
    options.dev = true;
    await build(options);
    server(options);
  });

program.parseAsync(process.argv);