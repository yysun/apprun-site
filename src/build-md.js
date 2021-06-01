// @ts-check
const fs = require('fs');
const app = require('apprun').app;

const md = require('markdown-it')({ html: true });
md.use(require('markdown-it-anchor'));
md.use(require('markdown-it-table-of-contents'));
const yaml = require('js-yaml');

const events = require('./events');
app.on(`${events.BUILD_CONTENT}:md`, (file) => {

  let page = {};
  md.use(require('markdown-it-front-matter'), function (fm) {
    page = fm ? yaml.load(fm) : {};
  });

  const text = fs.readFileSync(file).toString();
  const content = md.render(text);
  return { ...page, content };
});