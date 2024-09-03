const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const replaceGlobalWithLocalPlugin = {
  name: 'replace-global-with-local',
  setup(build) {
    // Intercept all import paths
    build.onResolve({ filter: /^[^./].*/ }, args => {
      // If the path is not relative or absolute (i.e., it's a global module), replace it
      return {
        path: path.resolve(__dirname, `node_modules/${args.path}`),
        namespace: 'file',
      };
    });

    // Post-build step to copy modules as ESM to public/node_module
    build.onEnd(async () => {
      const outputDir = path.resolve(__dirname, 'public/node_module');
      const modulesToBuild = new Set();

      // Traverse dependencies to get the modules used in the build
      for (const module of build.initialOptions.entryPoints) {
        const result = await esbuild.analyzeMetafile({
          metafile: path.resolve(__dirname, 'dist/metafile.json'),
        });
        Object.keys(result.inputs).forEach((input) => {
          if (input.includes('node_modules')) {
            const moduleName = input.split('node_modules/')[1].split('/')[0];
            modulesToBuild.add(moduleName);
          }
        });
      }

      // Ensure the output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Build each module individually if it hasn't been built already
      for (const moduleName of modulesToBuild) {
        const outputFilePath = path.join(outputDir, `${moduleName}.js`);

        // Check if the module has already been built
        if (!fs.existsSync(outputFilePath)) {
          await esbuild.build({
            entryPoints: [path.resolve(__dirname, `node_modules/${moduleName}/index.js`)],
            bundle: false,
            format: 'esm',
            outfile: outputFilePath,
          });
        }
      }
    });
  },
};

module.exports = replaceGlobalWithLocalPlugin;