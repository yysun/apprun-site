# How It Works

AppRun Site apps are Single Page Applications (SPA). You develop the pages using AppRun components, HTML files, and markdown files.

You put AppRun components in the _pages_ directory as following:

```
src/
  pages/
    home.tsx
    contact.tsx
    about.tsx
```

If you have HTML files and markdown files in the _pages_ directory, the _npm build_ scripts calls the _apprun-site CLI_ to convert them into AppRun components and saves to the **src/_lib** directory.

The _npm build_ scripts creates the **src/_lib/index.tsx** file that contains the routing events and all the components from **src/_lib** and **src/pages**.

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


The generated **src/_lib/index.tsx** exports an array that maps routing events to components.

The event-component mapping from **src/_lib/index.tsx** is used to creates the pages, and sets the routing events in the main entry point of the application, **src/index.tsx**,

Let's [Getting Started](#getting-started) see it in action.

