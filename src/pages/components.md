# Components

Components are the application building blocks in AppRun applications. Components provide a local scope to the elm like architecture, which means inside a component, there are _state_, _view_, and _update_.

The _state_, _view_, and _update_ are provided to AppRun, AppRun registers the event handlers defined in the update and waits for AppRun events to start the [event life cycle](https://apprun.js.org/docs/index.html#/04-architecture#apprun-event-life-cycle).

## Use Components for Pages


### AppRun Components

It is straightforward to create AppRun components as AppRun Site pages. You create a component class around the _state_, _view_, and _update_.

```javascript
import {app, Component} from 'apprun';

class About extends Component {
  state = 'about page';
  view = state => <div/>;
  update = {};
}
```

### HTML Components

In additional to AppRun components, you can create HTML files inside the **src/pages** directory. They are converted into AppRun components by the _npx apprun-site build_ command.

E.g. if you have an _a.html_ file

```html
<h1>Hello World</h1>
```

It will be converted into a component.

```javascript
import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => '_html:<h1>Hello World</h1>';
}
```

### Markdown Components

you can also create markdown files inside the **src/pages** directory. They are converted into AppRun components by the _npx apprun-site build_ command.

E.g. if you have an _a.md_ file

```markdown
# Hello World
```

It will be converted into a component.

```javascript
import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => '_html:<h1>Hello World</h1>';
}
```

All components inside the **src/pages** directory are activated/routed using the events.

## Routing

AppRun router detects the hash changes in URL (by listening to the window's _onpopstate_ event) and publishes the AppRun events using the hash as the event name.

E.g., when URL in the browser address bar becomes http://..../about, AppRun publishes the _/about_ event. The About component reacts to the _/about_ and renders itself to the screen.

Pages components subscribe to the routing events. That's it. There is no other code for routing.

Each component also has a built-in _. event_ that to display itself to the mounted elements. It provides the opportunity to scan the **src/pages** directory and create the event-component mapping, and to have a centralized place to map routing events to the page components in AppRun Site apps.

### Routing with Pretty Links (/)

By default, AppRun Site uses pretty links (i.e. non-hash links) and have HTML5 browser history. You need to set up the web server to have the 404-fallback page to be the _index.htm_ in case users hard refresh the pages.

### Routing with Hash (#)

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

## Components Composition

You can include components inside components to compose your app.

```javascript
class Child extends Component {
  state = {}
  view = state => <div></div>
  update = {}
}

class Parent extends Component {
  state = {}
  view = state => <div>
    <Child />
  </div>
  update = {}
}
```

To summarize, using components is a technique to decompose the large system into smaller, manageable and reusable pieces. Pages are components inside the **src/pages** directory. They are auto indexed and built into the application.

You can put non-page components inside the **src/components** directory. And import them where needed.

## Web Components

Components can be easily turned into [web components](#web-components) and used in the HTML pages and markdown pages.

