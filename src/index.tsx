import app from './_site';

import layout from './layout';
import pages from './pages/_index';

import * as config from './config.json';
const site = {
  title: config.title,
  element: config.element,
  nav: config.nav,
  sidebar: config.sidebar,
  layout,
  pages,
};

app.start(site);
