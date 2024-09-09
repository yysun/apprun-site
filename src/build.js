/* eslint-disable no-console */
//@ts-check
import { existsSync, mkdirSync, rmSync, statSync, copyFileSync, writeFileSync } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import chokidar from 'chokidar';
import chalk from 'chalk';
const { cyan, yellow, magenta, red, green } = chalk;
import esbuild from './esbuild.js';
import { build_main, build_component, add_route, routes } from './build-ts.js';
import { build_css } from './build-css.js';
import { markdown } from './build-md.js';
import render from './render.js';

const Markdown_Types = ['.md', '.mdx'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Copy_Types = ['.html', '.htm', '.png', '.gif', '.json', '.svg', '.jpg', '.jpeg', '.ico'];
const Css_Types = ['.css'];

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

export const should_ignore = (src, dest) => {
  if (!existsSync(dest)) return false;
  const src_stat = statSync(src);
  const dest_stat = statSync(dest);
  return src_stat.mtimeMs <= dest_stat.mtimeMs;
}

async function walk(dir, config) {
  let files = await readdir(dir);
  await Promise.all(files.map(async file => {
    const filePath = join(dir, file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) return walk(filePath, config);
    else if (stats.isFile()) return process_file(filePath, config);
  }));
}

const render_routes = async ({ output, relative}) => {
  for (const route of routes) {
    const path = route[0];
    try {
      const content = await render(path + '/', output);
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
  let start_time = Date.now();
  routes.length = 0;
  await walk(config.pages, config);
  await build_main(config);
  let elapsed = Date.now() - start_time;
  console.log(cyan(`Build done in ${elapsed} ms.`));
  start_time = Date.now();
  if (config.render) {
    await render_routes(config);
    elapsed = Date.now() - start_time;
    console.log(cyan(`Render done in ${elapsed} ms.`));
  }
}


const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const onChange = ((config, path) => {
  // console.log(yellow('Change detected'), relative(path));
  walk(dirname(path), config);
});
const debouncedOnChange = debounce(onChange, 300);

let copy_files;
export default async (config) => {

  const { pages, output, assets, clean, relative } = config;
  const is_production = process.env.NODE_ENV === 'production';

  console.log(`${cyan('Build from')} ${yellow(relative(pages))} to ${yellow(relative(output))} ${is_production ? cyan('for production') : cyan('for development')}`);
  if (clean) {
    rmSync(output, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(output));
  }

  config.should_ignore = should_ignore;

  Array.isArray(assets) && Copy_Types.push(...assets);
  copy_files = [...new Set(Copy_Types)];

  await run_build(config);

  let ready = false
  if (config.watch) {
    const watcher = chokidar.watch(pages, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true
    });
    watcher.on('all', (event, path) => {
      if (ready && (event === 'change' || event === 'add' || event === 'unlink')) {
        debouncedOnChange(config, path);
      }
    }).on('ready', () => {
      ready = true;
      console.log(cyan('Watching ...'));
    });
  }
}

async function process_file(file, config) {
  const { pages, output, plugins, relative } = config;
  const dir = dirname(file).replace(pages, '');
  const name = basename(file).replace(/\.[^/.]+$/, '');
  const ext = extname(file);
  const pub_dir = join(output, dir);
  ensure(pub_dir);
  const js_file = join(output, dir, name) + '.js';

  if (copy_files.indexOf(ext) >= 0) {
    let dest = join(pub_dir, name) + ext;
    if (dest === join(output, 'index.html')) dest = join(output, '_.html');
    if (!should_ignore(file, dest)) {
      copyFileSync(file, dest);
      console.log(cyan('Copied File'), relative(dest));
    }
  } else if (Markdown_Types.indexOf(ext) >= 0) {
    if (!should_ignore(file, js_file)) {
      const content = markdown(file)
      if (!content) {
        console.log(red('Markdown load failed'));
      } else {
        await build_component(content, js_file);
        console.log(cyan('Created Component'), relative(js_file));
      }
    }
    add_route(dir, js_file, output);
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    if (!should_ignore(file, js_file)) {
      esbuild(file, js_file);
      console.log(cyan('Compiled JavaSript'), relative(js_file));
    }
    add_route(dir, js_file, output);
  } else if (Css_Types.indexOf(ext) >= 0) {
    const css_file = join(output, dir, name) + '.css';
    if (!should_ignore(file, css_file)) {
      await build_css(file, css_file, config);
    }
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }

  if (plugins && plugins[ext]) {
    await plugins[ext](file, config);
  }
}
