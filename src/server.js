/* eslint-disable no-console */
import server, { config } from 'apprun-site/server.js';
const port = process.env.PORT || 8080;
const app = server();
const { root, ssr, save, live_reload } = config;
app.listen(port, () => {
  console.log('Your app is listening on:', `http://localhost:${port}`);
  console.log('Serving from:', `${root}`);
  console.log('SSR:', `${!ssr ? 'disabled' : 'enabled'}.`);
  console.log('Save:', `${!save ? 'disabled' : 'enabled'}.`);
  console.log('Live reload:', `${!live_reload ? 'disabled' : 'enabled'}.`);
});
