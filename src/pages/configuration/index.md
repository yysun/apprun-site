# Configuration

An SPA usually has a layout, which includes a header, a top nav, a sidebar, a footer, and the main area for displaying the pages.

You can pass a configuration object to the **app.start** function to

* Set page title in the layout
* Set the main element Id for displaying the pages
* Set nav bar menus
* Set sidebar menus
* Set the layout component
* Set the pages, which is the auto-generated event-component mapping

```javascript
import app from 'apprun-site';
import layout from './layout';
import pages from './_lib';
const nav = [
  { "text": "Home", "link": "/" },
  { "text": "Contact", "link": "/contact" },
  { "text": "About", "link": "/about" }
];
const config = {
  title: 'My AppRun Site',
  element: 'main',
  nav,
  sidebar: nav,
  layout,
  pages
};

app.start(site);
```

The _npx apprun-site init_ command creates four out-of-box layouts.

* Default - best for documentation site
* Bootstrap - start point of bootstrap
* CoreUI - best for admin UI / business apps
* Material Design - best for mobile web app

They all follow the configuration schema to render the page accordingly.

You can learn how to [use and switch layouts](#configuration_layout).

If you want to use your own layout, you can use the [do it yourself](#configuration_diy) approach.

