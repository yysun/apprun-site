import { resolve, join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import esbuild from 'esbuild';
import { fileURLToPath } from 'url'; // import the fileURLToPath function

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename);

const replaceGlobalWithLocalPlugin = {
  name: 'replace-global-with-local',
  setup(build) {
    const modulesToBuild = new Set(); // Set to store modules that need to be built

    // Intercept global import paths (ignore relative and absolute paths)
    build.onResolve({ filter: /^(?!([A-Za-z]:|\.{1,2}[/\\]|\/)).+/ }, args => {
      // Add the module to the Set for building later
      modulesToBuild.add(args.path);

      // Replace the import path with a local path in node_modules
      return {
        path: resolve(__dirname, `node_modules/${args.path}`),
        namespace: 'file',
      };
    });

    // Post-build step to copy modules as ESM to public/node_module
    build.onEnd(async () => {
      const outputDir = resolve(__dirname, 'public/node_module');

      // Ensure the output directory exists
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      // Build each module individually if it hasn't been built already
      for (const moduleName of modulesToBuild) {
        const outputFilePath = join(outputDir, `${moduleName}.js`);

        // Check if the module has already been built
        if (!existsSync(outputFilePath)) {
          await esbuild.build({
            entryPoints: [require.resolve(moduleName)],
            bundle: false,
            format: 'esm',
            outfile: outputFilePath,
          });
        }
      }
    });
  },
};

export default replaceGlobalWithLocalPlugin;