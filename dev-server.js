// @ts-check
import { relative } from 'path';
import WebSocket from 'ws';
import chokidar from 'chokidar';
import app_server from './server.js';
import ws_server from './ws.js';
import { info } from './src/log.js';

export default function (config) {
  let { live_reload, port, ssr, save } = config;
  config.port = port = port || process.env.PORT || 8080;

  const app = app_server(config);
  const { server, wss } = ws_server(app);
  const send = message => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const onChange = ((path) => {
    path = '/' + relative(config.output, path);
    send(JSON.stringify({ path }));
  });

  const debouncedOnChange = debounce(onChange, 300);
  server.listen(port, function () {
    if (live_reload) {
      const watcher = chokidar.watch(`${config.output}/**/*.{js,css,html}`, {
        ignored: /(^|[\\/])\../, // ignore dotfiles
        persistent: true
      });
      watcher.on('change', debouncedOnChange);
      watcher.on('add', debouncedOnChange);
    }
    info('Your app is listening on:', `http://localhost:${port}`);
    info('Serving from:', `${config.output}`);
    info('SSR:', `${!ssr ? 'disabled' : 'enabled'}.`);
    info('Save:', `${!save ? 'disabled' : 'enabled'}.`);
    info('Live reload:', `${!live_reload ? 'disabled' : 'enabled'}.`);
  });
}