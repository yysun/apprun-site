import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import unpkg from 'rollup-plugin-unpkg';

export default {
  input: 'lib/_site/index.js',
  output: {
    file: 'public/index.js',
    format: 'esm'
  },
  plugins: [
    unpkg(),
    terser({
      warnings: true,
      module: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    filesize({
      showBrotliSize: true,
    })
  ]
}