import { existsSync, writeFileSync, readFileSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { exec } from 'child_process';

export const build_tailwind = async (from, to) => {
  const { source, pages, output, relative, should_ignore } = config;
  return new Promise((resolve, reject) => {
    const tailwind = `${source}/tailwindcss.config.cjs`;
    if (!existsSync(from)) return;
    if (existsSync(tailwind)) return false;

    exec(`npx tailwindcss -o ${css_file}`, { cwd: source }, (err, output) => {
      if (err) {
        reject(err);
      }
      console.log(cyan('Compiled CSS with Tailwindcss'), relative(css_file));
      resolve(css_file);
    })
  })
};

export const build_css = async (from, to) => {
  try {
    if (!existsSync(from)) return;
    if (!existsSync(postcss)) return build_tailwind(config);
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

    writeFileSync(css_file, result.css);
    console.log(cyan('Compiled CSS with PostCss'), relative(css_file));

  } catch (err) {
    console.log(blue('CSS build: '), err.message);
    throw err;
  }
};

