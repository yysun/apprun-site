# Configuration

You can configue the site, in the src/index.tsx file.

```javascript
import app from 'apprun-site';
import layout from './layout/index';
import pages from './_lib/index';

import './components/web-components/counter';

const nav = [
  { "text": "Home", "link": "/" },
  { "text": "Contact", "link": "/contact" },
  { "text": "About", "link": "/about" }
];

const site = {
  title: 'My AppRun Site',
  element: 'main',
  nav,
  sidebar: nav,
  layout,
  pages,
  eventRoot: '/'
};

app.start(site);
```

