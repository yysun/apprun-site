//@  ts-check
import { join } from 'path';
import { existsSync, copyFileSync, rmSync } from 'fs';
import * as glob from 'glob';
import esbuild from 'esbuild';
import conditionalCompilePlugin from './esbuild-plugin.js';
const { green, gray, red, yellow, cyan } = chalk;
import chalk from 'chalk';

export default async (config) => {

  const { source, clean, relative } = config;
  const server_js_file = `${source}/server.js`;
  if (!existsSync(server_js_file)) {
    const server_fn = new URL('./server.js', import.meta.url);
    copyFileSync(server_fn, server_js_file);
    console.log(green('Created server file'));
  } else {
    console.log(gray('Server file exists, skipped'));
  }

  const src = join(source, 'app');
  const dist = source;
  if (!existsSync(src)) {
    console.log(red('"app" folder not found'), src);
    return;
  }

  if (clean) {
    rmSync(`${dist}/_`, { recursive: true, force: true });
    rmSync(`${dist}/api`, { recursive: true, force: true });
    console.log(cyan('Clean'), ['/', '/api']);
  }

  const entryPoints = glob.sync(`${src}/**/*.{ts,js}`);
  const buildOptions = {
    entryPoints,
    outdir: dist,
    outbase: src,
    bundle: false,
    minify: false,
    sourcemap: false,
    platform: 'node',
    format: 'esm',
    loader: { '.ts': 'ts', '.js': 'js' },
    plugins: [conditionalCompilePlugin({ server: true })],
  };

  const result = await esbuild.build(buildOptions);
  result.errors.length && console.log(red(result.errors));
  result.warnings.length && console.log(yellow(result.warnings));
  console.log(cyan('Server app built'), entryPoints.map(p => p.replace(src, '')));

}