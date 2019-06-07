import app from './_site/index';
import './components/my-img';

import layout from './layout';
import pages  from './_lib/index';

const links = [
  { "link": "#", "text": "Introduction" },
  { "link": "#how-it-works", "text": "How It Works" },
  { "link": "#getting-started", "text": "Getting Started" },
  { "link": "#configuration", "text": "Configuration" },
  { "link": "#configuration_layout", "text": "Switch Layout" },
  { "link": "#configuration_diy", "text": "Do It Yourself" },
  { "link": "#components", "text": "Components" },
  { "link": "#web-components", "text": "Web-components" },
  { "link": "#wpa", "text": "WPA *" },
  { "link": "#fetch", "text": "Async Fetch *" },
  { "link": "#esm", "text": "ES Modules *" },
  { "link": "#deploy", "text": "Deploy *" },
  { "link": "#deploy_firebase", "text": "Deploy/firebase *" },
  { "link": "#deploy_github", "text": "Deploy/github *" },
  { "link": "#todo", "text": "Todo *" },
  { "link": "#references", "text": "References *" },
  { "link": "", "text": "* working on docs" }
];

import * as config from './config.json';
const site = {
  title: config.title,
  element: config.element,
  nav: config.nav,
  sidebar: links,
  layout,
  pages
};

app.start(site);
