import app from './_site/index-esm';
import './components/my-img';

import layout from './layout/index';
import pages from './_lib/index-esm';

const site = {
  title: 'My App',
  element: 'main',
  nav: [],
  sidebar: [],
  layout,
  pages
};

app(site);
