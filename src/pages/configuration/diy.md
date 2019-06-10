# Do It Youself

Instead of following the out-of-box configuration schema, you can create the **src/index.tsx** of your own without using the **app.start** function.

In this case, you will need to know how to create the layout, pages, and components, which is easy to do.

## Create Layout

You can create the layout as a regular [component](#component) and render it before rendering pages. You can set up title, menus and nav whatever you want freely. A layout template looks like:

```javascript
import app from 'apprun';

export default ({ title, element, nav, sidebar }) => <>
  <div id="main"><div>
</>
```

## Create Pages

The auto generated event-component mapping in **src/_lib/index.tsx** makes it very easy to create the pages, and sets the routing events to the pages in a generic way.

```javascript
const element = 'main';
pages.forEach(def => {
  const [e, Comp] = def;
  const component = new Comp().mount(element);
  app.on(e, (...p) => component.run('.', ...p));
});
```

> Note: the . event is the _refresh_ event built-in every AppRun component. It makes components render themselves.


## Your Own Index Page

A simple index page looks like:

```javascript
import app from 'apprun';
import layout from './my-layout';
import pages from './_lib';

app.render(document.body, <layout />);
const element = 'main';
pages.forEach(def => {
  const [e, Comp] = def;
  const component = new Comp().mount(element);
  app.on(e, (...p) => component.run('.', ...p));
});
```


Next, you can learn how to create pages using [components](#components).


