//@ts-check
/* eslint-disable no-console */
import esbuild from 'esbuild';
import chalk from 'chalk';
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
import conditionalCompilePlugin from './esbuild-plugin.js';
import vfs from './vfs.js';

// export async function build(file, target, config) {
//   const build_in_memory = !!config.dev;
//   try {
//     const result = await esbuild.build({
//       entryPoints: [file],
//       outfile: target,
//       format: 'esm',
//       bundle: false,
//       sourcemap: false,
//       minify: false,
//       write: !build_in_memory
//     });
//     result.errors.length && console.log(red(result.errors));
//     result.warnings.length && console.log(yellow(result.warnings));

//     if (build_in_memory && result.outputFiles) {
//       result.outputFiles.forEach(f => {
//         const filePath = f.path;
//         const relativePath = config.relative(filePath).replace(/\\/g, '/');
//         vfs.set(relativePath, f.text, 'js');
//       })
//     }

//   } catch (e) {
//     console.log(red(e.message));
//   }
// }

export async function bundle(output, entryPoints, config) {
  const build_in_memory = !!config.dev;
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
      write: !build_in_memory,
      plugins: [conditionalCompilePlugin()]
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));
    if (build_in_memory && result.outputFiles) {
      result.outputFiles.forEach(f => {
        const filePath = f.path;
        const relativePath = config.relative(filePath).replace(/\\/g, '/');
        vfs.set(relativePath, f.text, 'js');
      })
    }
  } catch (e) {
    console.log(red(e.message));
  }
}