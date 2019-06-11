# Async Fetch

AppRun supports asynchronous operations in the AppRun event handlers. We only need to add the async keyword in front of the event handlers. The event handlers can call the functions that return _Promise_ with the await keyword.

Using the async fetch, you can bring in data from other systems in to AppRun Site apps.

See a component that displays the random XKCD pictures using async fetch from the **src/components** directory.

<my-xkcd></my-xkcd>

The code of the component is listed below.

```javascript
import { app, Component, customElement } from 'apprun';

@customElement('my-xkcd')
export default class extends Component {
  state = {};

  view = (state) => <>
    <div><button $onclick='fetchComic'>XKCD</button></div>
    {state.loading ? <div>loading ... </div> : ''}
    {state.comic && <>
      <h3>{state.comic.title}</h3>
      <img src={state.comic.url} />
    </>}
  </>;

  update = {
    'loading': (state, loading) => ({ ...state, loading }),
    'fetchComic': async _ => {
      this.run('loading', true);
      const response = await fetch('https://xkcd-imgs.herokuapp.com/');
      const comic = await response.json();
      return { comic };
    }
  };
}
```

The fetch results can be cached by the service worker so that you can build a lightening fast app (even for dynamic content) that works offline.

Learn how to make a [Progress Web App](#pwa).
