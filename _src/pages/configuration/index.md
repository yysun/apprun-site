# Configuration

A SPA usually has a layout, which includes a header, a top nav, a sidebar, a footer, and the main area for displaying the pages.

You can pass a configuration object to the **site.start** function to

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

* Default - best for the documentation site
* Bootstrap - start point of bootstrap
* CoreUI - best for admin UI / business apps
* Material Design - best for mobile web app

They all follow the configuration schema to render the page accordingly.

You can rename the layout directory to switch the layouts.

* To use the bootstrap layout, rename _layout-bootstrap_ to _layout_

* To use the coreUI layout, rename _layout-coreui_ to _layout_

* To use the material layout, rename _layout-material_ to _layout_

## Create Layout

You can create your own layout as a regular [component](#component). A layout template looks like:

```javascript
import app from 'apprun';

export default ({ title, element, nav, sidebar }) => <>
  <div id="main"><div>
</>
```

Next, you can learn more about the [pages](#pages).
