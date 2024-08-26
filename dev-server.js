// @ts-check
import { relative } from 'path';
import WebSocket from 'ws';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import server from './server.js';

export default function (config) {
  let { output, live_reload, port, no_ssr } = config;
  config.port = port = port || 8080;
  const app = server(config);
  const ws_server = app.listen(port, function () {
    if (live_reload) {
      const wss = new WebSocket.Server({ server: ws_server });
      const send = data => {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      }
      chokidar.watch(output).on('all', ((event, path) => {
        debounce(() => {
          if (event === 'change' || event === 'add') {
            send(JSON.stringify({ event, path: '/' + relative(output, path) }));
          }
        }, 300);
      }));
    }
    console.log(`Your app is listening on http://localhost:${port}`);
    console.log(`Serving from: ${output}`);
    console.log(`SSR ${no_ssr ? 'disabled' : 'enabled'}.`);
    console.log(`Live reload ${!live_reload ? 'disabled' : 'enabled'}.`);
  });
}