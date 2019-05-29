import app from './_site';

import layout from './layout';
import pages, { links } from './pages/_index';

import * as config from './config.json';
const site = {
  title: config.title,
  element: config.element,
  nav: config.nav,
  sidebar: links,
  layout,
  pages,
};
console.log(links)
app.start(site);
