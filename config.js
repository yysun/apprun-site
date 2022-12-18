import { app } from 'apprun/dist/apprun.esm.js';

import './src/build.js';
import './src/build-md.js';
import './src/build-ts.js';

export default {
  site_url: '/',
  route: '/',
  plugins: [],
}

app.on('build:.ts', async (options) => {
  console.log('build_ts');
})
