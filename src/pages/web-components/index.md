# Web Components

Web components are custom elements in HTML.
```
<my-img src='logo.png'></my-img>
```
You can create web components out of AppRun components.

```javascript
import {app, Component, customElement} from 'apprun';

@customElement('my-img')
export default class extends Component {
  view = ({ src }) => <img src={src} />
}
```

And then use it in [HTML page](#web-components_html), or in [JSX view](#web-components_tsx) of AppRun components, or in markdown page like in this page.

This page is a markdown page. It should display the web component.

<my-img src='/logo.png'></my-img>