import esbuild from 'esbuild';
import chalk from 'chalk';

const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

export default function (file, target, options = {}) {
  try {
    const result = esbuild.buildSync({
      entryPoints: [file],
      outfile: target,
      format: 'esm',
      bundle: true,
      sourcemap: true,
      external: ['./node_modules/*'],
      minify: false,
      ...options
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));
  } catch (e) {
    console.log(red(e.message));
  }
}

export function bundle(output, entryPoints) {
  try {
    const result = esbuild.buildSync({
      entryPoints,
      bundle: true,
      splitting: true,
      format: 'esm',
      outdir: output,
      chunkNames: 'dist/[name]-[hash]',
      minify: process.env.NODE_ENV === 'production',
      sourcemap: true,
      allowOverwrite: true,
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));

  } catch (e) {
    console.log(red(e.message));
  }
}