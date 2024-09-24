#!/usr/bin/env node
/* eslint-disable no-console */

import { existsSync } from 'fs';
import { join } from 'path';
import http from 'http';
import { program } from 'commander';
import chalk from 'chalk';
const { red, yellow, gray } = chalk;
import { build } from './index.js';
import dev_server from './dev-server.js';
import app from './server.js';
import { routes } from './src/build-ts.js';

async function init_options(source, options) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  options.source = source;
  options['site_url'] = '/';
  const conf = `${source}/apprun-site.config.js`;
  if (existsSync(conf)) {
    const config = await import(`file://${conf}`);
    options = { ...config.default, ...options };
  }
  options.pages = join(source, options.pages || 'pages');
  options.output = join(source, options.output || 'output');
  options['site_url'].endsWith('/') && (options['site_url'] = options['site_url'].slice(0, -1));
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
      const server = http.createServer(app(options));
      const port = process.env.PORT || 8080;
      server.on('error', async (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(gray(`✖ Port ${port} is already in use.`));
          await render();
        } else {
          console.log(red(`✖`), err.message);
        }
      });
      server.listen(port, async () => {
        await render();
      });
    }

    async function render() {
      const render_pages = routes;
      if (Array.isArray(options.static_pages)) render_pages.push(...options.static_pages);
      for (const page of render_pages) {
        const path = page[0];
        try {
          const port = process.env.PORT || 8080;
          const reponse = await fetch(`http://localhost:${port}${path}`);
          const html = await reponse.text();
          console.log(yellow`✔ Rendered`, path);
        } catch (e) {
          console.log(red(`✖ Render failed`), path, e.message);
        }
      }
      process.exit(0);
    }
  });

program
  .command('serve [source]')
  .description('launch preview server, live reload is optional')
  .option('-o, --output [output]', 'output directory', 'public')
  .option('--no-ssr', 'disable server side rendering')
  .option('--no-save', 'disable auto save of side rendered pages')
  .action(async (source, options) => {
    ({ source, options } = await init_options(source, options));
    dev_server(options);
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
    dev_server(options);
  });

program.parseAsync(process.argv);