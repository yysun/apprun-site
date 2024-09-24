/* eslint-disable no-console */
import { existsSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import vfs from './vfs.js';

export const build_css = async (from, to, config) => {
  const { source, relative } = config;
  try {
    const postcss = `${source}/postcss.config.js`;
    if (!existsSync(postcss)) return;
    // if (!existsSync(postcss)) return build_tailwind(from, to, config);
    const css = readFileSync(from, 'utf8');
    const context = { from, to, cwd: source, map: true }

    const { plugins, options } = await (await import('postcss-load-config'))
      .default(context, source);

    const result = await (await import('postcss'))
      .default(plugins)
      .process(css, options);

    for (const err of result.warnings()) {
      console.warn(err.toString());
    }

    if(config.dev) {
      vfs.set(relative(to), result.css, 'css');
    } else {
      writeFileSync(to, result.css);
    }
    // notifyChange('css', filePath);

    console.log(cyan('Compiled CSS with PostCss'), relative(to));

  } catch (err) {
    console.log(blue('CSS build: '), err.message);
    throw err;
  }
};

