# Do It Youself

Instead of following the out-of-box configuration schema, you can create the **src/index.tsx** of your own without using the **app.start** function.

In this case, you will need to know how to create the layout, pages, and components, which is easy to do.

## Create Layout

You can create the layout as a regular [component](#component) and render it before rendering pages. You can set up title, menus and nav whatever you want freely.

## Create Pages

The auto generated event-component mapping in **src/_lib/index.tsx** makes it very easy to create the pages, and sets the routing events to the pages in a generic way.

```javascript
import app from 'apprun';
import Layout from './layout';
import pages from './_lib';

app.render(document.body, <Layout />);

const element = 'main';
pages.forEach(def => {
  const [e, Comp] = def;
  const component = new Comp().mount(element);
  app.on(e, (...p) => component.run('.', ...p));
});
```

> Note: the . event is the _refresh_ event built-in every AppRun component. It makes components render themselves.


## Create Components

Components are the application building blocks in AppRun applications.

Pages are [AppRun components](#components) in the **src/pages** directory. They auto indexed and built into the application.

Pages use components as building blocks. You can put non-page components in the **src/components** directory. And import them where needed.

You can learn more about the components [here](#components).


