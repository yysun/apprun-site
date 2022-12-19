import { existsSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { BUILD } from './events.js';
import { exec } from 'child_process';

app.on(`${BUILD}:css`, async ( { source, output, relative }) => {
  return new Promise((resolve, reject) => {
    const tailwind = `${source}/tailwindcss.config.js`;
    if (existsSync(tailwind)) return false;
    const css_file = `${output}/style.css`;
    exec(`npx tailwindcss -o ${css_file}`, {cwd: source}, (err, output) => {
      if (err) {
        reject(err);
      }
      console.log(cyan('Compiled CSS with Tailwindcss'), relative(css_file));
      resolve(css_file);
    })
  })
})

