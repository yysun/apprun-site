/* eslint-disable no-console */
import esbuild from 'esbuild';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import conditionalCompilePlugin from './esbuild-plugin.js';
import vfs from './vfs.js';

export default build_in_memory;

export async function build(file, target, options = {}) {
  try {
    const result = await esbuild.build({
      entryPoints: [file],
      outfile: target,
      format: 'esm',
      bundle: false,
      sourcemap: true,
      minify: false,
      ...options,
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));
  } catch (e) {
    console.log(red(e.message));
  }
}

export async function build_in_memory (file, target, options = {}) {
  try {
    const result = await esbuild.build({
      entryPoints: [file],
      outfile: target,
      format: 'esm',
      bundle: true,
      sourcemap: true,
      minify: false,
      ...options,
      write: false,
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));

    if (result.outputFiles) {
      result.outputFiles.forEach(f => {
        const filePath = f.path;
        const moduleKey = filePath.replace(/\\/g, '/');
        vfs.set(moduleKey, f.text, 'application/javascript;charset=UTF-8');
      })
      // notifyChange('js', filePath);
    }
  } catch (e) {
    console.log(red(e.message));
  }
}

export async function bundle(output, entryPoints) {
  try {
    const result = await esbuild.build({
      entryPoints,
      bundle: true,
      splitting: true,
      format: 'esm',
      outdir: output,
      chunkNames: 'dist/[name]-[hash]',
      minify: process.env.NODE_ENV === 'production',
      sourcemap: true,
      allowOverwrite: true,
      plugins: [conditionalCompilePlugin()]
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));

  } catch (e) {
    console.log(red(e.message));
  }
}