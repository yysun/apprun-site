import { existsSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { exec } from 'child_process';

export const build_tailwind = async (from, to, config) => {
  const { source, pages, output, relative, should_ignore } = config;
  const tailwind = `${source}/tailwind.config.js`;
  if (!existsSync(from)) return;
  if (!existsSync(tailwind)) {
    console.log(cyan('Copied CSS'), relative(to));
    copyFileSync(from, to);
    return;
  }
  return new Promise((resolve, reject) => {
    exec(`npx tailwindcss -o ${to}`, { cwd: source }, (err, output) => {
      if (err) {
        reject(err);
      }
      console.log(cyan('Compiled CSS with Tailwindcss'), relative(to));
      resolve(to);
    })
  })
};

export const build_css = async (from, to, config) => {
  const { source, relative } = config;
  try {
    const postcss = `${source}/postcss.config.js`;
    if (!existsSync(from)) return;
    if (!existsSync(postcss)) return build_tailwind(from, to, config);
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

    writeFileSync(to, result.css);
    console.log(cyan('Compiled CSS with PostCss'), relative(to));

  } catch (err) {
    console.log(blue('CSS build: '), err.message);
    throw err;
  }
};

