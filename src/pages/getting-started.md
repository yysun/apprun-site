# Getting Start

To create an AppRun Site app:

```sh
npx apprun-site init my-apprun-site
cd my-apprun-site
npm install
```

The **init** command creates a project structure. The main entry of the app is **src/index.tsx**.

```
public/
src/
  _lib/
  _site/
  layouts/
  pages/
    home.tsx
    contact.tsx
    about.tsx
  index.tsx   <=== main entry
  tsconfig.json
.gitignore
package.json
webpack.config.js
```

Use _npm start_ to start the dev server and run the app in browser http://localhost:8080

> You can modify the home, contact and about components. Or add a few pages your own. The dev server will refresh to show your changes on the fly.

The main entry point of the app is the **src/index.tsx**. It looks like:

```javascript
import site from './_site';
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

site.start(config);
```

**src/index.tsx** imports
 * the _site_ object from _./site_
 * the layout from _./layout_
 * the pages from _./lib_


 **src/index.tsx** calls the _site.start_ function to start the app with the configuration options.

Next, let's see how to [configure](#configuration).


