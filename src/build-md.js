import _md from 'markdown-it';
import a from 'markdown-it-anchor';
import b from 'markdown-it-table-of-contents';
import c from 'markdown-it-front-matter';
import { load } from 'js-yaml';
import { BUILD } from './events.js';

const md = _md ({ html: true });
md.use(a);
md.use(b);

app.on(`${BUILD}.md`, text => {
  let page = {};
  md.use(c, function (fm) {
    page = fm ? load(fm) : {};
  });

  const content = md.render(text);
  return { ...page, content };
});