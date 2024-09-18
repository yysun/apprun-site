/* eslint-disable no-console */
//@ts-check
import { existsSync, mkdirSync, rmSync, statSync, copyFileSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname, basename, extname, relative as path_relative } from 'path';
import chokidar from 'chokidar';
import chalk from 'chalk';
const { cyan, yellow, magenta, red, green } = chalk;
import esbuild from './esbuild.js';
import { build_main, build_component, add_route, routes } from './build-ts.js';
import { build_css } from './build-css.js';
import { markdown } from './build-md.js';
import render from './render.js';
import vfs from './vfs.js';
import { send } from '../ws.js';

const Markdown_Types = ['.md', '.mdx'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Copy_Types = ['.html', '.htm', '.png', '.gif', '.json', '.svg', '.jpg', '.jpeg', '.ico'];
const Css_Types = ['.css'];

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};


async function walk(dir, config) {
  let files = readdirSync(dir);

  for(const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    if (stats.isDirectory()) await walk(filePath, config);
    else if (stats.isFile()) await process_file(filePath, config);
  }
}

const render_routes = async ({ output, relative}) => {
  for (const route of routes) {
    const path = route[0];
    try {
      const port = process.env.PORT || 8080;
      const content = await render(path + '/', output, port);
      if (content) {
        const html_file = join(output, path, 'index.html');
        writeFileSync(html_file, content);
        console.log(green('Rendered'), relative(html_file));
      } else {
        console.log(magenta('Rendered empty'), path);
      }
    } catch (e) {
      console.log(red('Render failed'), path, e.message);
    }
  }
}

const run_build = async (config) => {
  const start_time = Date.now();
  routes.length = 0;
  vfs.clean();
  await walk(config.pages, config);
  await build_main(config);
  const elapsed = Date.now() - start_time;
  console.log(cyan(`Build done in ${elapsed} ms.`));
}

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

let paused = false;

const onChange = (async (config, path) => {
  paused = true;
  const ext = extname(path);
  if (Css_Types.indexOf(ext) >= 0) {
    await process_file(path, config);
  } else {
    await run_build(config);
  }
  send(path);
  paused = false;
});

const debouncedOnChange = debounce(onChange, 300);

let copy_files;

export default async (config) => {

  const { source, pages, output, assets, clean, dev } = config;
  const relative = fname => path_relative(source, fname);
  console.log(`${cyan('Build from')} ${yellow(relative(pages))} to
    ${yellow(relative(output))} ${dev ? cyan('in DEV mode') : ''}`);

  if (!config.dev && clean) {
    rmSync(output, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(output));
  }

  Array.isArray(assets) && Copy_Types.push(...assets);
  copy_files = [...new Set(Copy_Types)];

  try {
    config.relative = fn => '/' + path_relative(output, fn);
    await run_build(config);
    if (config.render) {
      const start_time = Date.now();
      await render_routes(config);
      const elapsed = Date.now() - start_time;
      console.log(cyan(`Render done in ${elapsed} ms.`));
    }
  } catch (e) {
    console.log(red('Build failed'), e.message);
  }

  let ready = false
  if (config.watch) {
    const watcher = chokidar.watch(pages, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true
    });
    watcher.on('all', (event, path) => {
      if (ready && !paused) {
        debouncedOnChange(config, path);
      }
    }).on('ready', () => {
      ready = true;
      console.log(yellow('Watching ...'));
    });
  }
}

async function process_file(file, config) {
  const { pages, output, relative } = config;
  const dir = dirname(file).replace(pages, '');
  const name = basename(file).replace(/\.[^/.]+$/, '');
  const ext = extname(file);
  const pub_dir = join(output, dir);
  ensure(pub_dir);
  const js_file = join(output, dir, name) + '.js';

  if (copy_files.indexOf(ext) >= 0) {
    let dest = join(pub_dir, name) + ext;
    if (config.dev) {
      const content = readFileSync(file, 'utf-8');
      vfs.set(relative(dest), content, ext.replace('.', ''));
    } else {
      copyFileSync(file, dest);
    }
    console.log(cyan('Copied File'), relative(dest));
  } else if (Markdown_Types.indexOf(ext) >= 0) {

    const content = markdown(file)
    if (!content) {
      console.log(red('Markdown load failed'));
    } else {
      await build_component(content, js_file, config);
      console.log(cyan('Created Component'), relative(js_file));
    }
    add_route(dir, js_file, output);
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    await esbuild(file, js_file, config);
    console.log(cyan('Compiled JavaSript'), relative(js_file));
    // }
    add_route(dir, js_file, output);
  } else if (Css_Types.indexOf(ext) >= 0) {
    const css_file = join(output, dir, name) + '.css';
    await build_css(file, css_file, config);
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }
}
