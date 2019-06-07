# Components

Components are the application building blocks in AppRun applications.

An AppRun component  has the elm architecture, which means inside a component, there are _state_, _view_, and _update_. Basically, components provide a local scope.

## Create Component

It is straightforward to create a component. You create a component class around the _state_, _view_, and _update_.

```javascript
import {app, Component} from 'apprun';

class Counter extends Component {
  state = '';
  view = state => <div/>;
  update = {};
}
```

## Mount Component to Element

Then you mount the component instance to an element.

```javascript
const element = 'main';
new Counter().mount(element);
```

The component can be mounted to the web page element or element ID. When the component is mounted to an _element ID_, It will not render the element if it cannot find it.

## Child Components

Beside mounting the components, you can also have nested components by using the capitalized JSX tag to create AppRun Components in JSX.


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

Using components is a technique to decompose the large system into smaller, manageable, and reusable pieces.

Components can be easily turned into [web components](#web-components) and use in the HTML pages and markdown pages.
