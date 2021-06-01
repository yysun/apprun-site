// @ts-check
const fs = require('fs');
const app = require('apprun').app;

const md = require('markdown-it')({ html: true });
md.use(require('markdown-it-anchor'));
md.use(require('markdown-it-table-of-contents'));

const events = require('./events');
app.on(`${events.BUILD_CONTENT}:md`, (file) => {
  const text = fs.readFileSync(file).toString();
  return md.render(text);
});