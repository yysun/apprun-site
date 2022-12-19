//@ts-check
import { existsSync, mkdirSync, readFileSync, rmSync, readdirSync, statSync, writeFileSync, copyFileSync } from 'fs';
import { readdir, stat } from 'fs/promises';

import { join, dirname, basename, extname } from 'path';
import chokidar from 'chokidar';
import _ from 'lodash';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { PRE_BUILD, POST_BUILD, BUILD } from './events.js';
import { app } from 'apprun/dist/apprun.esm.js';

const HTML_Types = ['.html', '.htm'];
const Content_Types = ['.md', '.mdx', '.html', '.htm'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Copy_Types = ['.png', '.gif', '.json', '.css', '.svg', '.jpg', '.jpeg', '.ico'];

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

export const should_ignore = (src, dest) => {
  if (!existsSync(dest)) return false;
  const src_stat = statSync(src);
  const dest_stat = statSync(dest);
  return src_stat.mtimeMs <= dest_stat.mtimeMs;
}

let relative, copy_files;
export default async (config) => {

  const { render, output, pages, assets, clean } = config;
  relative = config.relative;
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
    await walk(pages);
    !config['no-startup'] && app.run(`${BUILD}:startup`, config);
    await app.query(`${BUILD}:css`, config);
    render && await app.query(`${BUILD}:render`, config, output);
    console.log(cyan('Build done.'))
  }

  const { source, watch } = config;

  if (watch) {
    console.log(cyan('Watching ...'));
    const all_types = [...HTML_Types, ...Content_Types, ...Esbuild_Types, ...copy_files];
    chokidar.watch(source).on('all', _.debounce((event, path) => {
      if (path.indexOf(output) < 0 && path.indexOf(`${source}/api/`) < 0) {
        const ext = extname(path);
        if (all_types.indexOf(ext) >= 0) {
          console.log(yellow('Change detected'), relative(path));
          run_build();
        }
      }
    }, 500));
  } else {
    await run_build();
  }


};

async function process_file(file, config) {
  const { pages, output, plugins } = config;
  const dir = dirname(file).replace(pages, '');
  const name = basename(file).replace(/\.[^/.]+$/, '');
  const ext = extname(file);
  const pub_dir = join(output, dir);
  ensure(pub_dir);
  const js_file = join(output, dir, name) + '.js';

  if (HTML_Types.indexOf(ext) >= 0) {
    const text = readFileSync(file).toString();
    if (text.indexOf('<html') >= 0) {
      const new_file = join(pub_dir, name + '.html');
      if (!should_ignore(file, new_file)) {
        writeFileSync(new_file, text);
        console.log(cyan('Copied HTML'), relative(new_file));
      }
    }
  } else if (copy_files.indexOf(ext) >= 0) {
    const dest = join(pub_dir, name) + ext;
    if (!should_ignore(file, dest)) {
      copyFileSync(file, dest);
      console.log(cyan('Copied File'), relative(dest));
    }
  } else if (Content_Types.indexOf(ext) >= 0) {

    if (!should_ignore(file, js_file)) {
      const all_content = await app.query(`${BUILD}${ext}`, file, js_file, config);
      const content = all_content[all_content.length - 1];
      if (!content) {
        console.log(red('Content load failed'));
      } else {
        app.run(`${BUILD}:component`, content, js_file, output);
        console.log(cyan('Created Component'), relative(js_file));
      }
    }
    app.run(`${BUILD}:add-route`, dir, js_file, output);

  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    if (!should_ignore(file, js_file)) {
      app.run(`${BUILD}:esbuild`, file, js_file, output);
      console.log(cyan('Compiled JavaSript'), relative(js_file));
    }
    app.run(`${BUILD}:add-route`, dir, js_file, output);
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }

  if (plugins && plugins[ext]) {
    await plugins[ext](file, config);
  }
}

