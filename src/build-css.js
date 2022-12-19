import { copyFileSync } from 'fs';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import { BUILD } from './events.js';

import { exec } from 'child_process';


app.on(`${BUILD}:css`, async (file, target, { source }) => {
  try {

    // if (existsSync(dest)) return false;
    exec(`npx tailwindcss -o ${target}`, {cwd: source}, (err, output) => {
      if (err) {
        console.error("could not execute command: ", err.message)
      }
    })
  } catch (e) {
    console.log(red(e.message));
    copyFileSync(file, dest);
  }
});

