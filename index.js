//@ts-check
import { join } from 'path';
import { PRE_BUILD, BUILD, POST_BUILD } from './src/events.js';
import { app } from 'apprun/dist/apprun.esm.js';

import './src/build.js';
import './src/build-md.js';
import './src/build-html.js';
import './src/build-ts.js';

export default async function (source, options) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  options.source = source;
  options.pages = join(source, options.pages || 'pages');
  options.output = join(source, options.output || 'output');

  // plugins
  options.plugins?.forEach(module => require(`${source}/plugins/${module}`));

  await app.query(PRE_BUILD, options);
  await app.query(BUILD, options);
  await app.query(POST_BUILD, options);
}