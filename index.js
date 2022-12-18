//@ts-check
import { existsSync } from 'fs';
import { join } from 'path';
import { app } from 'apprun/dist/apprun.esm.js';
import { PRE_BUILD, BUILD, POST_BUILD } from './src/events.js';
import default_options from './config.js';

export default async function (source, options) {

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

  await app.query(PRE_BUILD, options);
  await app.query(BUILD, options);
  await app.query(POST_BUILD, options);
}