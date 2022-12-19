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
const Copy_Types = ['.png', '.gif', '.json', '.svg', '.jpg', '.jpeg', '.ico'];
const Css_Types = ['.css'];

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

let relative, copy_files;

export const should_ignore = (src, dest) => {
  if (!existsSync(dest)) return false;
  const src_stat = statSync(src);
  const dest_stat = statSync(dest);
  return src_stat.mtimeMs <= dest_stat.mtimeMs;
}

app.on(PRE_BUILD, ({ source, clean, output, assets }) => {

  relative = fname => fname.replace(source, '');

  Array.isArray(assets) && Copy_Types.push(...assets);
  copy_files = [...new Set(Copy_Types)];


  if (clean) {
    rmSync(output, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(output));
  }
});

app.on(POST_BUILD, async (config) => {
  const { watch, render, output, pages, live_reload } = config;

  !config['no-startup'] && app.run(`${BUILD}:startup`, config, output, pages, live_reload);
  render && await app.query(`${BUILD}:render`, config, output);

  if (watch) {
    console.log(cyan('Watching ...'));

    chokidar.watch(pages).on('all', _.debounce((event, path) => {
      if (event === 'change' || event === 'add') {
        // console.log(yellow('Change detected'), pages, relative(path));
        if (path === `${pages}/main.tsx`) {
          !config['no-startup'] && app.run(`${BUILD}:startup`, config, output, pages, live_reload);
        } else {
          process_file(path, { pages, output });
        }
      }
    }, 500));
  } else {
    console.log(cyan('Build done.'))
  }
})

app.on(BUILD, async (config) => {
  const { pages } = config
  console.log(cyan('Build from'), relative(pages));

  async function walk(dir) {
    let files = await readdir(dir);
    await Promise.all(files.map(async file => {
      const filePath = join(dir, file);
      const stats = await stat(filePath);
      if (stats.isDirectory()) return walk(filePath);
      else if (stats.isFile()) return process_file(filePath, config);
    }));
  }
  await walk(pages);
});


async function process_file(file, config) {

  const { pages, output, plugins } = config;
  const dir = dirname(file).replace(pages, '');
  const name = basename(file).replace(/\.[^/.]+$/, '');
  const ext = extname(file);
  const event = ext;
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
      const all_content = await app.query(`${BUILD}${event}`, file, js_file, config);
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
  } else if (Css_Types.indexOf(ext) >= 0) {
    const css_file = join(output, dir, name) + '.css';
    if (!should_ignore(file, css_file)) {
      app.run(`${BUILD}:css`, file, css_file, config);
      console.log(cyan('Compiled CSS'), relative(css_file));
    }
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }

  if (plugins && plugins[event]) {
    await plugins[event](file, config);
  }
}

