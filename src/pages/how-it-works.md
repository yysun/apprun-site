# How It Works

AppRun Site apps are Single Page Applications (SPA). You develop the pages using AppRun components, HTML files and markdown files.

You put AppRun components in the _pages_ directory as following:

```
src/
  pages/
    home.tsx
    contact.tsx
    about.tsx
```

You then run the _build_ script.

```sh
npx apprun-site build
```

You can also run the _build_ script in the watch mode.

```sh
npx apprun-site build -w
```

> If you have HTML files and markdown files in the _pages_ directory, the _build_ scripts converts them into AppRun components and saves to the **src/_lib** directory.


The _build_ scripts creates the **src/_lib/index.tsx** file that contains the routing events and the components.

```javascript
// this file is auto-generated
import _about_0 from './about_tsx';
import _contact_1 from './contact_tsx';
import _home_2 from './home_tsx';
export default [
  ["/about", _about_0],
  ["/contact", _contact_1],
  ["/home", _home_2],
] as (readonly [string, any])[];
```


The generated **src/_lib/index.tsx** imports the all components from **src/_lib** and **src/pages**; and exports an array that maps routing events to components.

The event-component mapping from **src/_lib/index.tsx** is used to creates the pages, and sets the routing events in the main entry point of the application, **src/index.tsx**,

Let's [Getting Started](#getting-started) to see it in action.

