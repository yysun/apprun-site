import server from 'apprun-site/server.js';
const port = process.env.PORT || 8080;
const app = server();
app.listen(port, () => console.log(`Your app is listening on http://localhost:${port}`));
