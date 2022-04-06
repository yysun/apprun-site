//@ts-check
import { existsSync, mkdirSync, readFileSync, rmSync, readdirSync, statSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import chokidar from 'chokidar';
import _ from 'lodash';
import { load } from 'js-yaml';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { PRE_BUILD, POST_BUILD, BUILD } from './events.js';
import { app } from 'apprun/dist/apprun.esm.js';

const HTML_Types = ['.html', '.htm'];
const Content_Types = ['.md', '.mdx', '.html', '.htm'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
// const Copy_Types = ['.png', '.gif', '.json', '.css', '.svg', '.jpg', '.jpeg', '.ico'];
const Copy_Types = ['.json', '.css', '.ico'];


const last = arr => arr.reduce((acc, curr) => curr ? curr : acc);
const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

let relative, config;

app.on(PRE_BUILD, ({ source, clean, output }) => {

  relative = fname => fname.replace(source, '');

  const conf = `${source}/apprun-site.yml`;
  config = existsSync(conf) ? load(readFileSync(conf, 'utf-8')) : {};
  config.site_url = config.site_url || '/';
  config.site_url.endsWith('/') && (config.site_url = config.site_url.slice(0, -1));


  if (clean) {
    rmSync(output, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(output));
  }
});

app.on(POST_BUILD, async ({ watch, render, output, pages}) => {
  !config['no-startup'] && app.run(`${BUILD}:startup`, config, output, pages);
  console.log(cyan('Created File'), relative(`${output}/main.js`));
  render && await app.query(`${BUILD}:render`, config, output);
  console.log(cyan('Build done.'));

  if (watch) {
    console.log(cyan('Watching ...'));

    chokidar.watch(pages).on('all', _.debounce((event, path) => {
      if (event === 'change'|| event === 'add') {
        console.log(cyan('Change detected'), relative(path));
        process_file(path, { pages, output });
      }
    },500));
  } else {
    console.log(cyan('Build done.'))
  }
})

app.on(BUILD, async ({ pages, output }) => {
  console.log(cyan('Build from'), relative(pages));
  function walkDir(dir, callback) {
    readdirSync(dir).forEach(f => {
      let dirPath = join(dir, f);
      let isDirectory = statSync(dirPath).isDirectory();
      if (f.startsWith('_')) {
        console.log(gray('Skip'), gray(relative(dirPath)));
        return;
      }
      isDirectory ? walkDir(dirPath, callback) : callback(join(dir, f));
    });
  }
  walkDir(pages, file => process_file(file, { pages, output }));
});

async function process_file(file, { pages, output }) {
  const dir = dirname(file).replace(pages, '');
  const name = basename(file).replace(/\.[^/.]+$/, '');
  const ext = extname(file);
  // const event = content_events?.[ext] || ext;
  const event = ext;
  const pub_dir = join(output, dir);
  ensure(pub_dir);

  const js_file = join(output, dir, name) + '.js';

  // console.log('Page: ', file, '=>', event);
  const text = readFileSync(file).toString();

  if (HTML_Types.indexOf(ext) >= 0 && text.indexOf('<html') >= 0) {
    const new_file = join(pub_dir, name + '.html');
    writeFileSync(new_file, text);
    console.log(cyan('Copied HTML'), relative(new_file));
    return;
  }

  if (Content_Types.indexOf(ext) >= 0) {
    const all_content = await app.query(`${BUILD}${event}`, text);
    const content = last(all_content);
    // console.log(content);
    if (!content) {
      console.log(red('Content load failed'));
      return;
    }
    app.run(`${BUILD}:component`, content, js_file, output);
    app.run(`${BUILD}:add-route`, dir, js_file, output);
    console.log(cyan('Created Component'), relative(js_file));
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    app.run(`${BUILD}:esbuild`, file, js_file, output);
    console.log(cyan('Compiled JavaSript'), relative(js_file));
    app.run(`${BUILD}:add-route`, dir, js_file, output);
  } else if (Copy_Types.indexOf(ext) >= 0) {
    const dest = join(pub_dir, name) + ext;
    copyFileSync(file, dest);
    console.log(cyan('Copied File'), relative(dest));
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }
}

