import app from './_site/index';
import './components/my-img';
import './components/my-xkcd';

import layout from './layout';
import pages  from './_lib/index';

const nav = [
  { "text": "Home", "link": "/" }
];

const links = [
  { "link": "#", "text": "Introduction" },
  { "link": "#how-it-works", "text": "How It Works" },
  { "link": "#getting-started", "text": "Getting Started" },
  { "link": "#configuration", "text": "Configuration" },
  { "link": "#configuration_layout", "text": "Switch Layout" },
  { "link": "#configuration_diy", "text": "Do It Yourself" },
  { "link": "#components", "text": "Components" },
  { "link": "#web-components", "text": "Web-components" },
  { "link": "#fetch", "text": "Async Fetch" },
  { "link": "#pwa", "text": "PWA" },
  { "link": "#esm", "text": "Dynamic Modules" },
  { "link": "#deploy", "text": "Build and Deploy" },
  { "link": "#todo", "text": "Todo *" },
  { "link": "#references", "text": "References" },
  { "link": "", "text": "* working on docs" }
];

const config = {
  title: 'AppRun Site',
  element: 'main',
  nav,
  sidebar: links,
  layout,
  pages
};

app.start(config);
