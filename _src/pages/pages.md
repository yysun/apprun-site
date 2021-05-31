# Pages

AppRun Site pages are made of AppRun components, HTML files, and markdown files. They are stored under the **src/pages** directory.

## Component Pages

It is straightforward to create AppRun components as AppRun Site pages. You create a component class around the _state_, _view_, and _update_.

```javascript
import {app, Component} from 'apprun';

class About extends Component {
  state = 'about page';
  view = state => <div/>;
  update = {};
}
```

## HTML Pages

In additional to AppRun components, you can create HTML files inside the **src/pages** directory. They are converted into AppRun components by the _npx apprun-site build_ command.

E.g., if you have an _a.html_ file

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

## Markdown Pages

You can also create markdown files inside the **src/pages** directory. They are converted into AppRun components by the _npx apprun-site build_ command.

E.g., if you have an _a.md_ file

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

All pages are components that are waiting to be [activated/routed](#routing) using the events.
