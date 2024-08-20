import server from "apprun-site/server.js";
const port = process.env.PORT || 8080;
server(".", { port });
