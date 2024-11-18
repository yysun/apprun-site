/* eslint-disable no-console */
//@ts-check
import { existsSync, mkdirSync, rmSync, statSync, copyFileSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname, basename, extname, relative as path_relative } from 'path';
import chokidar from 'chokidar';
import chalk from 'chalk';
const { cyan, yellow, magenta, red, green } = chalk;
import { build_ts, build_main, build_component, routes, run_bundle } from './build-ts.js';
import { build_css } from './build-css.js';
import { markdown } from './build-md.js';
import vfs from './vfs.js';
import { send } from './ws.js';

const Markdown_Types = ['.md', '.mdx'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Copy_Types = ['.html', '.htm', '.png', '.gif', '.json', '.svg', '.jpg', '.jpeg', '.ico'];
const Css_Types = ['.css'];

class BuildTimer {
  constructor() {
    this.startTime = Date.now();
    this.lastTime = this.startTime;
  }

  lap(label) {
    const now = Date.now();
    const total = now - this.startTime;
    const lap = now - this.lastTime;
    this.lastTime = now;
    console.log(cyan(`${label}: ${lap}ms (total: ${total}ms)`));
  }
}

class BuildCache {
  constructor() {
    this.cache = new Map();
  }

  getFileHash(filePath) {
    const stats = statSync(filePath);
    return `${stats.size}-${stats.mtimeMs}`;
  }

  isChanged(filePath) {
    const currentHash = this.getFileHash(filePath);
    const cachedHash = this.cache.get(filePath);
    const changed = currentHash !== cachedHash;
    this.cache.set(filePath, currentHash);
    return changed;
  }

  clear() {
    this.cache.clear();
  }
}

function validateConfig(config) {
  const required = ['source', 'pages', 'output'];
  const missing = required.filter(field => !config[field]);
  if (missing.length) {
    throw new Error(`Missing required configuration fields: ${missing.join(', ')}`);
  }
  
  if (!existsSync(config.source)) {
    throw new Error(`Source directory does not exist: ${config.source}`);
  }
  
  return config;
}

const ensure = dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

const getOutputPath = (file, config, ext) => {
  const { pages, output } = config;
  const dir = dirname(file).replace(pages, '');
  const name = basename(file).replace(/\.[^/.]+$/, '');
  const pub_dir = join(output, dir);
  if (!config.dev) ensure(pub_dir);
  return join(output, dir, name) + ext;
};

const FileProcessors = {
  copy: async (file, config) => {
    const { pages, output, relative } = config;
    const dir = dirname(file).replace(pages, '');
    const name = basename(file).replace(/\.[^/.]+$/, '');
    const ext = extname(file);
    const pub_dir = join(output, dir);
    const dest = join(pub_dir, name) + ext;
    
    if (config.dev) {
      const content = readFileSync(file, 'utf-8');
      vfs.set(relative(dest), content, ext.replace('.', ''));
    } else {
      if (!existsSync(pub_dir)) mkdirSync(pub_dir, { recursive: true });
      copyFileSync(file, dest);
    }
    console.log(cyan('Copied File:'), relative(dest));
  },

  markdown: async (file, config) => {
    const content = markdown(file);
    if (!content) {
      console.log(red('Markdown load failed'));
      return;
    }
    const js_file = getOutputPath(file, config, '.js');
    await build_component(content, js_file, config);
  },

  typescript: async (file, config) => {
    const js_file = getOutputPath(file, config, '.js');
    await build_ts(file, js_file, config);
  },

  css: async (file, config) => {
    const css_file = getOutputPath(file, config, '.css');
    await build_css(file, css_file, config);
  }
};

async function safeProcessFile(file, config) {
  try {
    const ext = extname(file);
    if (copy_files.indexOf(ext) >= 0) {
      await FileProcessors.copy(file, config);
    } else if (Markdown_Types.indexOf(ext) >= 0) {
      await FileProcessors.markdown(file, config);
    } else if (Esbuild_Types.indexOf(ext) >= 0) {
      await FileProcessors.typescript(file, config);
    } else if (Css_Types.indexOf(ext) >= 0) {
      await FileProcessors.css(file, config);
    } else {
      console.log(magenta('Unknown file type'), config.relative(file));
    }
  } catch (error) {
    console.error(red(`Error processing file ${file}:`));
    console.error(red(error.stack));
    throw error;
  }
}

async function walk(dir, config) {
  let files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    if (stats.isDirectory()) await walk(filePath, config);
    else if (stats.isFile()) await safeProcessFile(filePath, config);
  }
}

const run_build = async (config) => {
  const timer = new BuildTimer();
  routes.length = 0;
  vfs.clean();
  try {
    await walk(config.pages, config);
    timer.lap('Files processed');
    await build_main(config);
    timer.lap('Main built');
    await run_bundle(config);
    timer.lap('Bundle complete');
  } catch (e) {
    console.log(red('Build failed'), e.message);
    throw e;
  }
}

let copy_files;
const buildCache = new BuildCache();

export default async (config) => {
  try {
    validateConfig(config);
    
    const { source, pages, output, assets, clean, dev } = config;
    const relative = fname => path_relative(source, fname);
    console.log(`${cyan('Build from')} ${yellow(relative(pages))} to ${yellow(relative(output))} ${dev ? cyan('in DEV mode') : ''}`);

    if (!config.dev && clean) {
      rmSync(output, { recursive: true, force: true });
      console.log(cyan('Clean'), relative(output));
    }

    Array.isArray(assets) && Copy_Types.push(...assets);
    copy_files = [...new Set(Copy_Types)];

    config.relative = fn => '/' + path_relative(output, fn).replace(/\\/g, '/');
    await run_build(config);
    
    let isProcessing = false;
    let changeTimeout = null;

    if (config.watch) {
      const watcher = chokidar.watch(pages, {
        ignored: /(^|[/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100
        }
      });

      watcher.on('all', (event, filePath) => {
        if (!isProcessing && (event === 'change' || event === 'add')) {
          if (!buildCache.isChanged(filePath)) {
            return; // Skip if file hasn't changed
          }
          
          if (changeTimeout) {
            clearTimeout(changeTimeout);
          }
          
          changeTimeout = setTimeout(() => {
            triggerProcessing(filePath);
          }, 500);
        }
      });

      async function triggerProcessing(filePath) {
        if (isProcessing) return;
        isProcessing = true;
        console.clear();
        console.log(yellow('File changed'), relative(filePath));
        try {
          const ext = extname(filePath);
          if (Css_Types.indexOf(ext) >= 0 || Copy_Types.indexOf(ext) >= 0) {
            await safeProcessFile(filePath, config);
          } else if (Markdown_Types.indexOf(ext) >= 0 || Esbuild_Types.indexOf(ext) >= 0) {
            await run_build(config);
          }
          send(filePath);
        } catch (error) {
          console.error(red('Processing failed:'), error);
        } finally {
          isProcessing = false;
        }
      }
    }
  } catch (error) {
    console.error(red('Build initialization failed:'));
    console.error(red(error.stack));
    process.exit(1);
  }
}
