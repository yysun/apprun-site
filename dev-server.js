// @ts-check
import { relative } from 'path';
import WebSocket from 'ws';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import _server from './server.js';

export default function (source, config) {
  let { output, live_reload, port } = config;

  const app = _server(source, config);
  const server = app.listen(port, function () {
    if (live_reload) {
      const wss = new WebSocket.Server({ server });
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
    console.log(`Live reload ${!live_reload ? 'disabled' : 'enabled'}.`);
  });
}