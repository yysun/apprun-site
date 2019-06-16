# Routing

AppRun Site router detects the hash/path changes in URL (by listening to the window's _onpopstate_ event) and publishes the routing events.

AppRun Site **app.start** function maps the routing events to the page components.

## Routing Events

Pages are components inside the **src/pages** directory. Each component has a built-in _refresh_ event, the **.** event to display itself to the mounted element.

E.g. if you have an _Item_ component (**src/pages/item.tsx**). AppRun Site maps the routing event _/item_ to the component's built-in _refresh_ event.

```javascript
import _item from '_lib/item.tsx'
app.on('/item', (...p) => _item.run('.', ...p))
```

When users navigate to http://.../item/a/b/c, the _/item_ event is published and sent to the __item_ component to display along with 'a', 'b', 'c' as the event parameters.

You can override it to accept routing parameters.

```javascript
import { app, Component } from 'apprun';

export default class extends Component {
  view = state => <div>{state}</div>
  update = {
    '.': (state, id) => id
  }
}
```

## Routing with Pretty Links (/)

By default, AppRun Site uses pretty links (i.e., non-hash links) and have HTML5 browser history. You need to set up the web server to have the 404-fallback page to be the _index.htm_ in case users hard refresh the pages.

## Routing with Hash (#)

You can also use the hash sign for routing. E.g.,  URL http://..../#about triggers the _#about_ event and then wakes up the _About_ component. To enable this feature, just set the _eventRoot in the configuration.

```javascript
import app from 'apprun-site';

const site = {
  title: 'My AppRun Site',
  // ...
  eventRoot: '#'
};

app.start(site);
```

You also need to set the --root options to be '#' when running the _npx apprun-site build_ command.

```sh
npx apprun-site build --root '#'
```

 Next, you can learn more about how [components](#components).