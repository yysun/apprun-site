//@ts-check
import { existsSync, mkdirSync, readFileSync, rmSync, readdirSync, statSync, writeFileSync, copyFileSync } from 'fs';
import { readdir, stat } from 'fs/promises';

import { join, dirname, basename, extname } from 'path';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import esbuild from './esbuild.js';
import { build_main, build_component, add_route } from './build-ts.js';
import { build_css } from './build-css.js';
import { markdown } from './build-md.js';

const Markdown_Types = ['.md', '.mdx'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Copy_Types = ['.html', '.htm', '.png', '.gif', '.json', '.css', '.svg', '.jpg', '.jpeg', '.ico'];

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

export const should_ignore = (src, dest) => {
  if (!existsSync(dest)) return false;
  const src_stat = statSync(src);
  const dest_stat = statSync(dest);
  return src_stat.mtimeMs <= dest_stat.mtimeMs;
}

let copy_files;
export default async (config) => {

  const { source, output, pages, assets, clean, relative } = config;
  Array.isArray(assets) && Copy_Types.push(...assets);
  copy_files = [...new Set(Copy_Types)];

  console.log(cyan('Build from'), relative(pages));
  if (clean) {
    rmSync(output, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(output));
  }

  async function walk(dir) {
    let files = await readdir(dir);
    await Promise.all(files.map(async file => {
      const filePath = join(dir, file);
      const stats = await stat(filePath);
      if (stats.isDirectory()) return walk(filePath);
      else if (stats.isFile()) return process_file(filePath, config);
    }));
  }

  const run_build = async () => {
    const start_time = Date.now();
    await walk(pages);
    !config['no-startup'] && build_main(config);
    await build_css(config);
    const elapsed = Date.now() - start_time;
    console.log(cyan(`Build done in ${elapsed} ms.`))
  }

  await run_build();

  const { watch } = config;
  if (watch) {
    console.log(cyan('Watching ...'));
    const all_types = [...Copy_Types, ...Markdown_Types, ...Esbuild_Types, ...copy_files];
    chokidar.watch(source).on('all', ((event, path) => {
      debounce(() => {
        if (path.indexOf(output) < 0 && path.indexOf(`${source}/api/`) < 0) {
          const ext = extname(path);
          if (all_types.indexOf(ext) >= 0) {
            console.log(yellow('Change detected'), relative(path));
            run_build();
          }
        }
      }, 500)
    }));
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
    const dest = join(pub_dir, name) + ext;
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
        build_component(content, js_file);
        console.log(cyan('Created Component'), relative(js_file));
      }
    }
    add_route(dir, js_file, output);
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    if (!should_ignore(file, js_file) && js_file.endsWith('index.js')) {
      esbuild(file, js_file);
      console.log(cyan('Compiled JavaSript'), relative(js_file));
    }
    add_route(dir, js_file, output);
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }

  if (plugins && plugins[ext]) {
    await plugins[ext](file, config);
  }
}

