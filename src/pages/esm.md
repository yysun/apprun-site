# JavaScript Modules

AppRun Site apps use components. Components are build and exported as modules. They are imported and bundled into the **app.js**.

JavaScript/ECMAScript modules are now supported in all major browsers! You can serve the modules without bundling.

## Import ES Module in Browser

The **index.html** below is a pattern to serve both bundled JS file and the module files.

```javascript
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>My AppRun Site</title>
</head>
<body>
  <script nomodule src="/app.js"></script>
  <script type="module" src="/esm/index-esm.js"></script></body>
</html>
```

## Build the Modules

To build the modules, you can use TypeScript directly to compile source code from the **sec** directory to the **public/esm** directory.

```sh
tsc -p src --outDir public/esm
```

## Fix the Global Imports

However, there is still a problem. The browser does not how to import global modules. E.g., All components import the global module _apprun_.

```javascript
import { app, Component } from 'apprun';
export default class extends Component {
  //
}
```

The browser will refuse to load and report error:
```
Relative references must start with either "/", "./", or "../".
```

Fortunately, AppRun Site provides a handy command _fix-esm_ to fix the global modules.

```sh
npx apprun-site fix-esm --source public/esm
```
The command does two things:

1. It copies the apprun.js from the **node_modules** directory to the **public/esm/_modules** directory.

2. Fix the module references to use the newly copied file

```javascript
import { app, Component } from '/esm/_modules/apprun.js';
export default class extends Component {
  //
}
```

Problem solved!

## Dynamic Module Loading

ES module can be statically imported or dynamically imported. The main reason to use the ES module in AppRun Site is to import the modules dynamically.

Dynamic import is a JavaScript language feature that enables the lazy-loading of modules. It introduces a new function-like form of import returns a promise of the requested modules that you can use to import modules when they are needed.

E.g., the _about_ component is only loaded when the _/about_ routing event is published.

```javascript
app.on('/about', (...p) => {
  import('/esm/_lib/about_md.js').then((module) => {
    const component = new module.default().mount('main');
    component.run('.', ...p);
  });
});
```

### Event-Component Mapping for Dynamic Import

Remember the AppRun Site _build_ command scans the **src/pages** directly and creates the **src/_lib/index.tsx** file that statically imports all the components and exports a mapping of events and components.

the AppRun Site _build_ command also creates the **src/_lib/index-esm.tsx** file, which includes the mapping between the routing events with the component and modules.

```javascript
// this file is auto-generated
export default [
  ["/about", '_about_md_0', '/esm/_lib/about_md.js'],
  ["/contact", '_contact_1', '/esm/_lib/contact_tsx.js'],
  ["/home", '_home_2', '/esm/_lib/home_tsx.js'],
  ["/", '_index_3', '/esm/_lib/index_tsx.js'],
  ["/README", '_README_md_4', '/esm/_lib/README_md.js'],
  ["/_404", '_index_5', '/esm/_lib/_404/index_tsx.js'],
]
```

You can use this mapping file to load component modules dynamically on demand.

```javascript
import pages from './_lib/index-esm';
pages.forEach(def => {
  let [evt, name, imp] = def;
  app.on(evt, (...p) => {
    import(imp).then((module) => {
      const component = new module.default().mount('main');
      component.run('.', ...p);
    });
  });
});
```

Now, you have got the [code-splitting](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/) feature to improve page-load times.


You have both bundled and modularized app. Next, you will learn how to [deploy](#deploy) the app.

