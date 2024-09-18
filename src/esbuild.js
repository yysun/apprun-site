//@ts-check
/* eslint-disable no-console */
import esbuild from 'esbuild';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import conditionalCompilePlugin from './esbuild-plugin.js';
import vfs from './vfs.js';

export default function (file, target, config) {
  return config.dev ? build_in_memory(file, target, config) : build(file, target);
}

export async function build(file, target) {
  try {
    const result = await esbuild.build({
      entryPoints: [file],
      outfile: target,
      format: 'esm',
      bundle: false,
      sourcemap: true,
      minify: false,
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));
  } catch (e) {
    console.log(red(e.message));
  }
}

export async function build_in_memory(file, target, config) {
  try {
    const result = await esbuild.build({
      entryPoints: [file],
      outfile: target,
      format: 'esm',
      bundle: true,
      sourcemap: true,
      minify: false,
      write: false,
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));

    if (result.outputFiles) {
      result.outputFiles.forEach(f => {
        const filePath = f.path;
        const moduleKey = filePath.replace(/\\/g, '/');
        const relativePath = config.relative(filePath);
        vfs.set(relativePath, f.text, 'js');
      })
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