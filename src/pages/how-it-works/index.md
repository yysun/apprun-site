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

It creates the _pages/__lib/index.tsx_ file that contains the routing events and the components.

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
Then you can import the _pages_ from it to create components.
```javascript
import pages  from './_lib/index';
pages.forEach(def => {
  const [event, Comp] = def;
  const component = new Comp().mount(element);
  app.on(event, (...p) => component.run('.', ...p));
});
```

No matter how many components and how do you place them in the directory structure, they will be created without changing the above code.

Next, let's see its other [features](/features).