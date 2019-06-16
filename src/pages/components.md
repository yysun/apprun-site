# Components

Components are the application building blocks in AppRun applications. Using components is a technique to decompose the large system into smaller, manageable and reusable pieces. 

## Create Components

Components provide a local scope to the elm like architecture, which means inside a component, there are _state_, _view_, and _update_.

```javascript
import {app, Component} from 'apprun';

export default class extends Component {
  state = '';
  view = state => <div>{state}</div>;
  update = {};
}
```

The _state_, _view_, and _update_ are provided to AppRun, AppRun registers the event handlers defined in the update and waits for AppRun events to start the [event life cycle](https://apprun.js.org/docs/index.html#/04-architecture#apprun-event-life-cycle).


The three parts are all optional. Components can be as simple as only have the _view_ function.

```javascript
import {app, Component} from 'apprun';

export default class extends Component {
  view = state => <div>{state}</div>
}
```

## Component Composition

You can create page components out of other non-page components.

```javascript
class Child extends Component {
  state = {}
  view = state => <div></div>
  update = {}
}

class Page extends Component {
  state = {}
  view = state => <div>
    <Child />
  </div>
  update = {}
}
```

Usually non-page components are under the **src/components** directory. You import them where needed to compose your pages.

## Web Components

You can use AppRun components in HTML pages and markdown pages directly by making AppRun components into [web components](#web-components).
