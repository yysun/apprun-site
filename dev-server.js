// @ts-check
import { relative } from 'path';
import WebSocket from 'ws';
import chokidar from 'chokidar';
import app_server from './server.js';
import ws_server from './ws.js';

export default function (config) {
  let { output, live_reload, port, no_ssr } = config;
  config.port = port = port || 8080;

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
    path = '/' + relative(output, path);
    send(JSON.stringify({ path }));
  });

  const debouncedOnChange = debounce(onChange, 300);
  server.listen(port, function () {
    if (live_reload) {
      const watcher = chokidar.watch(output, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
      });
      watcher.on('change', debouncedOnChange);
      watcher.on('add', debouncedOnChange);
    }
    console.log(`Your app is listening on http://localhost:${port}`);
    console.log(`Serving from: ${output}`);
    console.log(`SSR ${no_ssr ? 'disabled' : 'enabled'}.`);
    console.log(`Live reload ${!live_reload ? 'disabled' : 'enabled'}.`);
  });
}