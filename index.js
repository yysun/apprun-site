//@ts-check
import { existsSync } from 'fs';
import { join } from 'path';
import { PRE_BUILD, BUILD, POST_BUILD } from './src/events.js';
import default_options from './config.js';
import run_build from './src/build.js';

import './src/build-md.js';
import './src/build-ts.js';
import './src/build-css.js';

import apprun from 'apprun';
const app = apprun['app'];

export async function init_options(source, options) {
  source = (source && source !== '.') ? `${process.cwd()}/${source}` : `${process.cwd()}`;
  options.source = source;
  options.pages = join(source, options.pages || 'pages');
  options.output = join(source, options.output || 'output');
  const conf = `${source}/apprun-site.config.js`;
  if (existsSync(conf)) {
    const config = await import(conf);
    options = { ...config.default, ...options };
  }
  options = { ...default_options, ...options };
  options['site_url'].endsWith('/') && (options['site_url'] = options['site_url'].slice(0, -1));
  options.relative = fname => fname.replace(source, '');
  return { source, options };
}

const NOOP = () => { };
app.on('pre-build', NOOP);
app.on('post-build', NOOP);

export async function build(source, options) {
  await app.query(PRE_BUILD, options);
  await run_build(options);
  await app.query(POST_BUILD, options);
}