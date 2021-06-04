const md = require('markdown-it')({ html: true });
md.use(require('markdown-it-anchor'));
md.use(require('markdown-it-table-of-contents'));
const yaml = require('js-yaml');

const events = require('./events');
app.on(`${events.BUILD}.md`, text => {

  let meta = {};
  md.use(require('markdown-it-front-matter'), function (fm) {
    meta = fm ? yaml.load(fm) : {};
  });

  const content = md.render(text);
  return { meta, content };
});