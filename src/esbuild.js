import esbuild from 'esbuild';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

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
  const temp = `${output}/_temp`;
  try {
    const result = esbuild.buildSync({
      entryPoints,
      bundle: true,
      splitting: true,
      format: 'esm',
      outdir: temp,
      chunkNames: 'dist/[name]-[hash]',
      minify: process.env.NODE_ENV === 'production',
      sourcemap: true,
    });
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(yellow(result.warnings));
    copyDirectory(temp, output);
    deleteDirectory(temp);

  } catch (e) {
    console.log(red(e.message));
  }
}

function copyDirectory(source, destination) {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  // Get the files and directories in the source directory
  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    // Check if the current file is a directory
    if (fs.lstatSync(sourcePath).isDirectory()) {
      // Recursively copy the directory
      copyDirectory(sourcePath, destinationPath);
    } else {
      // Copy the file
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

function deleteDirectory(source) {
  if (fs.existsSync(source)) {
    fs.readdirSync(source).forEach((file) => {
      const filePath = path.join(source, file);

      if (fs.lstatSync(filePath).isDirectory()) {
        deleteDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(source);
  }
}