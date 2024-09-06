/* eslint-disable no-console */
import { resolve, join, relative } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import esbuild from 'esbuild';

function resolveModuleEntryPoint(moduleName, outputDir) {
  const packageJsonPath = resolve(outputDir, '../node_modules', moduleName, 'package.json');

  if (!existsSync(packageJsonPath)) {
    throw new Error(`Cannot find package.json for module ${moduleName}`);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  let entryPoint = packageJson.module || packageJson.main;

  // Handle the case where 'exports' field is used
  if (!entryPoint && typeof packageJson.exports === 'object') {
    if (typeof packageJson.exports === 'string') {
      entryPoint = packageJson.exports;
    } else if (packageJson.exports['.'] && typeof packageJson.exports['.'] === 'string') {
      entryPoint = packageJson.exports['.'];
    } else if (packageJson.exports['.'] && packageJson.exports['.'].default) {
      entryPoint = packageJson.exports['.'].default;
    }
  }

  if (!entryPoint) entryPoint = 'index.js';
  return resolve(outputDir, '../node_modules', moduleName, entryPoint);
}


const replaceGlobalWithLocalPlugin = (outputDir) => ({
  name: 'replace-global-with-local',
  setup(build) {
    const modulesToBuild = new Set();

    build.onResolve({ filter: /^[^./\\@][^:]*$/ }, args => {
      modulesToBuild.add(args.path);
      return { path: '/node_modules/' + args.path + '.js', external: true }
    });

    build.onEnd(async () => {
      if (modulesToBuild.size <= 0) return;

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      for (const moduleName of modulesToBuild) {
        const outputFilePath = join(outputDir, 'node_modules', `${moduleName}.js`);
        if (!existsSync(outputFilePath)) {
          const entryPoint = resolveModuleEntryPoint(moduleName, outputDir);
          console.log('\tBuilding', relative(outputDir, entryPoint), 'to', relative(outputDir, outputFilePath));
          await esbuild.buildSync({
            entryPoints: [entryPoint],
            bundle: true,
            format: 'esm',
            sourcemap: true,
            minify: false,
            outfile: outputFilePath,
          });
        }
      }
    });
  },
});

export default replaceGlobalWithLocalPlugin;