import { existsSync, writeFileSync, readFileSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { exec } from 'child_process';

export const build_tailwind = async (config) => {
  const { source, pages, output, relative, should_ignore } = config;
  return new Promise((resolve, reject) => {
    const tailwind = `${source}/tailwindcss.config.cjs`;
    if (existsSync(tailwind)) return false;
    const css_file = `${output}/style.css`;
    const from = `${pages}/style.css`;
    const to = css_file;
    if (should_ignore(from, to)) return;

    exec(`npx tailwindcss -o ${css_file}`, { cwd: source }, (err, output) => {
      if (err) {
        reject(err);
      }
      console.log(cyan('Compiled CSS with Tailwindcss'), relative(css_file));
      resolve(css_file);
    })
  })
};

export const build_css = async (config) => {
  try {
    const { source, pages, output, relative, should_ignore } = config;
    const postcss = `${source}/postcss.config.cjs`;
    if (!existsSync(postcss)) return build_tailwind(config);

    const css_file = `${output}/style.css`;
    const css = readFileSync(`${pages}/style.css`, 'utf8');
    const from = `${pages}/style.css`;
    const to = css_file;
    const context = { from, to, cwd: source, map: true }
    if (should_ignore(from, to)) return;

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

