# How It Works

You put your AppRun components in the _pages_ directory structure as following:

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

In addition to having AppRun components as pages, you can also add HTML files and markdown files in the _pages_ directory. The _build_ scripts converts them into AppRun components and saves to the **src/_lib** directory.

The generated **src/_lib/index.tsx** imports the all components from **src/_lib** and **src/pages**; and exports an array that maps routing events to components.

The main entry point of the application, **src/index.tsx**, imports the event-component mapping from **src/_lib/index.tsx**. Then it creates the pages, and sets the routing events.

Next, let's [Getting Started](#getting-started) to see it in action.

