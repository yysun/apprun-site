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
      minify: process.env.NODE_ENV === 'production',
      ...options
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));
  } catch (e) {
    console.log(red(e.message));
  }
}
