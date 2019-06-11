# Components

Components are the application building blocks in AppRun applications.

AppRun Site pages are components inside the **src/pages** directory. They are auto indexed and built into the application. You can put non-page components inside the **src/components** directory. And import them where needed.

## Create Components

Components provide a local scope to the elm like architecture, which means inside a component, there are _state_, _view_, and _update_.

```javascript
import {app, Component} from 'apprun';

class Counter extends Component {
  state = '';
  view = state => <div/>;
  update = {};
}
```

The _state_, _view_, and _update_ are provided to AppRun, AppRun registers the event handlers defined in the update and waits for AppRun events to start the [event life cycle](https://apprun.js.org/docs/index.html#/04-architecture#apprun-event-life-cycle).


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

You can create page components out of other non-page components.

## Web Components

You can use AppRun components in HTML pages and markdown pages directly by making AppRun components into [web components](#web-components).
