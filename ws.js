import http from 'http';
import WebSocket from 'ws';

export default app => {
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    ws.on('message', async function (message) {
      const data = JSON.parse(message);
      try {
        const req = {
          method: 'GET',
          ...data,
        };
        const res = {
          __uuid: data.__uuid,
          statusCode: 200,
          headers: {},
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          send: function (response) {
            const finalResponse = {
              status: this.statusCode || 200,
              body: response
            };
            ws.send(JSON.stringify(finalResponse));
          },
          setHeader: function (name, value) {
            this.headers[name] = value;
          },
          sendStatus: function (code) {
            this.statusCode = code;
            const statusMessage = http.STATUS_CODES[code] || String(code);
            this.send(statusMessage);
          },
          json: function (data) {
            this.send(data);
          },
        };
        await app._router.handle(req, res, (e) => {
          e && ws.send(JSON.stringify({ status:500, error: e.message }));
        });
      } catch (e) {
        console.error(e);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  return { server, wss };
}