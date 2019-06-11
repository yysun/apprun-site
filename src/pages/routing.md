# Routing

AppRun router detects the hash changes in URL (by listening to the window's _onpopstate_ event) and publishes the AppRun events using the hash as the event name.

E.g., when URL in the browser address bar becomes http://..../about, AppRun publishes the _/about_ event. The About component reacts to the _/about_ and renders itself to the screen.

Pages components subscribe to the routing events.  There is no other code needed for routing.

Each component also has a built-in _. event_ that to display itself to the mounted elements. It provides the opportunity to scan the **src/pages** directory and create the event-component mapping, and to have a centralized place to map routing events to the page components in AppRun Site apps.

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

Using components is a technique to decompose the large system into smaller, manageable and reusable pieces. Next, you can learn more about components(#component).