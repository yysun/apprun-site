const md = require('markdown-it')({ html: true });
md.use(require('markdown-it-anchor'));
md.use(require('markdown-it-table-of-contents'));
const yaml = require('js-yaml');

const fm_flag = '---';

const events = require('./events');
app.on(`${events.BUILD}.md`, text => {
  if (text.startsWith(fm_flag)) {
    const ss = text.split('---');
    if (ss.length > 2) return { meta: yaml.load(ss[1]), content: md.render(ss[2]) }
  }
  return { meta: {}, content: md.render(text) };
});