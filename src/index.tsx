import app from './_site/index';
import './components/my-img';

import layout from './layout';
import pages  from './_lib/index';

const links = [
  { "link": "/", "text": "Introduction" },
  { "link": "/how-it-works", "text": "How It Works" },
  { "link": "/features", "text": "Features" },
  { "link": "/configuration", "text": "Configuration" },
  { "link": "/configuration/layout", "text": "/configuration/layout" },
  { "link": "/configuration/nav", "text": "/configuration/nav" },
  { "link": "/configuration/sidebar", "text": "/configuration/sidebar" },
  { "link": "/web-components", "text": "Web-components" },
  { "link": "/web-components/html", "text": "/web-components/html" },
  { "link": "/web-components/tsx", "text": "/web-components/tsx" },
  { "link": "/deploy", "text": "Deploy" },
  { "link": "/deploy/firebase", "text": "/deploy/firebase" },
  { "link": "/deploy/github", "text": "/deploy/github" },
  { "link": "/todo", "text": "Todo" }
]
import * as config from './config.json';
const site = {
  title: config.title,
  element: config.element,
  nav: config.nav,
  sidebar: links,
  layout,
  pages,
};

app.start(site);
