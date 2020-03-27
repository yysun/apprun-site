import app from './_site';
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
  { "link": "#configuration/layout", "text": "Layout" },
  { "link": "#pages", "text": "Pages" },
  { "link": "#routing", "text": "Routing" },
  { "link": "#components", "text": "Components" },
  { "link": "#web-components", "text": "Web Components" },
  { "link": "#fetch", "text": "Async Fetch" },
  { "link": "#pwa", "text": "PWA" },
  // { "link": "#esm", "text": "Modules" },
  { "link": "#deploy", "text": "Build and Deploy" },
  { "link": "#references", "text": "References" },
];

const config = {
  title: 'AppRun Site',
  element: 'main',
  nav,
  sidebar: links,
  layout,
  pages,
  eventRoot: '#'
};

app.start(config);
