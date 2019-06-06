# How It Works

You put your code into the directory structure as following:

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

AppRun Site includes the ***app.start*** function to import the generated list, create components, and map the routing events.


Next, let's [Getting Started](#getting-started).

