import app from './_site/index-esm';
import './components/my-img';

import layout from './layout/index';
import pages, { links } from './_lib/index-esm';

const site = {
  title: 'My App',
  element: 'main',
  nav: [],
  sidebar: links,
  layout,
  pages
};

app(site);
