#!/usr/bin/env node

/* eslint-disable no-console */
//@ts-check
import fs from 'fs';
import { resolve, join } from 'path';
import http from 'http';
import { program } from 'commander';
import inquirer from 'inquirer';
import degit from 'degit';
import chalk from 'chalk';
const { red, yellow, gray } = chalk;
import { build } from './index.js';
import dev_server from './dev-server.js';
import app from './server.js';
import { routes } from './src/build-ts.js';
import build_server from './src/build-server.js';

async function init_options(source, options) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  options.source = source;
  const conf = `${source}/apprun-site.config.js`;
  if (fs.existsSync(conf)) {
    const config = await import(`file://${conf}`);
    options = { ...config.default, ...options };
  }
  options.pages = join(source, options.pages || 'pages');
  options.output = join(source, options.output || 'public');
  options['base_dir'].endsWith('/') && (options['base_dir'] = options['base_dir'].slice(0, -1));
  if (!options.base_dir) options.base_dir = '/';
  return { source, options };
}

program
  .version('1.5.0')
  .description('AppRun Site CLI');

program
  .command('init [destination]')
  .description('Initialize a new project from a template')
  .action(async (destination) => {

    const defaultTemplates = [
      { name: "AppRun Site Basic", value: "apprunjs/apprun-site-template" },
      { name: "AppRun Site with Shadcn/ui", value: "apprunjs/apprun-shadcn" },
      { name: "AppRun Site with Ant Design Pro", value: "apprunjs/apprun-antd-pro" }
    ];

    const templatesUrl = 'https://raw.githubusercontent.com/yysun/apprun-site/master/templates.json';
    let templates = [];
    // console.log('Fetching templates from GitHub...');
    try {
      const response = await fetch(templatesUrl);
      templates = await response.json();
    } catch (error) {
      // console.error('Error fetching templates from GitHub:', error.message);
      // console.log('Using default templates instead.');
      templates = defaultTemplates;
    }


    function isDirectoryEmpty(directory) {
      return fs.promises.readdir(directory)
        .then(files => files.length === 0)
        .catch(() => true); // Directory doesn't exist
    }


    try {
      // Step 1: Prompt for destination if not provided
      if (!destination) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'destination',
            message: 'Enter the destination directory:',
            default: '.',
          },
        ]);
        destination = answers.destination;
      }

      // Step 2: Check if destination directory is empty
      const destPath = resolve(process.cwd(), destination);
      const isEmpty = await isDirectoryEmpty(destPath);

      if (!isEmpty) {
        console.error('Error: Destination directory is not empty.');
        process.exit(1);
      }

      // Step 3: Prompt the user to select a template
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Select a template to use:',
          choices: templates,
        },
      ]);

      const emitter = degit(answers.template, {
        cache: false,
        force: true,
        verbose: true,
      });

      // Step 4: Clone the selected template
      console.log(`Scaffolding project in ${destPath}...`);

      await emitter.clone(destPath);

      console.log('Project initialized successfully!');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });

program
  .command('build [source]')
  .description('build site')
  .option('-c, --clean', 'clean the output directory', false)
  .option('-w, --watch', 'watch the directory', false)
  .option('-o, --output [output]', 'output directory', 'public')
  .option('-p, --pages [pages]', 'pages directory', 'pages')
  .option('-s --server-only', 'build server app', false)
  .option('-b --client-only', 'build server app', false)
  .option('-r --render', 'pre-render pages', false)
  .option('--no-csr', 'no client side routing')
  .action(async (source, options) => {
    ({ source, options } = await init_options(source, options));

    if (!options['serverOnly']) {
      options.dev = false;
      await build(options);
    }

    if (!options['clientOnly']) {
      await build_server(options);
    }

    if (options.render) {
      options.ssr = true;
      options.save = true;
      const server = http.createServer(app(options));
      const port = process.env.PORT || 8080;
      server.on('error', async (err) => {
        if (err["code"] === 'EADDRINUSE') {
          console.log(gray(`✖ Port ${port} is already in use.`));
          await render(port);
        } else {
          console.log(red(`✖`), err.message);
        }
      });
      server.listen(port, async () => {
        await render(port);
      });
    }

    async function render(port) {
      const render_paths = routes.map(r => r[0]);
      if (Array.isArray(options.static_pages)) render_paths.push(...options.static_pages);
      for (const path of render_paths) {
        try {
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
  .option('--no-watch', 'no watching the directory')
  .option('--no-live_reload', 'no live reload')
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