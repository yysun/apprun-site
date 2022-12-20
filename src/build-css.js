import { existsSync, writeFileSync, readFileSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { BUILD } from './events.js';
import { exec } from 'child_process';
// import postcss from 'postcss';
// import postcssrc from 'postcss-load-config';

app.on(`${BUILD}:tailwind`, async ({ source, output, relative }) => {
  return new Promise((resolve, reject) => {
    const tailwind = `${source}/tailwindcss.config.js`;
    if (existsSync(tailwind)) return false;
    const css_file = `${output}/style.css`;
    exec(`npx tailwindcss -o ${css_file}`, { cwd: source }, (err, output) => {
      if (err) {
        reject(err);
      }
      console.log(cyan('Compiled CSS with Tailwindcss'), relative(css_file));
      resolve(css_file);
    })
  })
});

app.on(`${BUILD}:css`, async ({ source, pages, output, relative }) => {
  const postcss_config = `${source}/postcss.config.js`;
  if (!existsSync(postcss_config)) return false;

  const css_file = `${output}/style.css`;
  const css = readFileSync(`${pages}/style.css`, 'utf8');
  const from = `${pages}/style.css`;
  const to = css_file;
  const context = { from, to, cwd: source, map: true }

  const { plugins, options } = await (await import('postcss-load-config'))
    .default(context, css_file);

  const result = await (await import('postcss'))
    .default(plugins).process(css, options);

  for (const err of result.warnings()) {
    console.warn(err.toString());
  }

  writeFileSync(css_file, result.css);
  console.log(cyan('Compiled CSS with PostCss'), relative(css_file));
})

