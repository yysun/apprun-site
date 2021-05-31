import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="async-fetch">Async Fetch</h1>
<p>AppRun supports asynchronous operations in the AppRun event handlers. We only need to add the async keyword in front of the event handlers. The event handlers can call the functions that return <em>Promise</em> with the await keyword.</p>
<p>Using the async fetch, you can bring in data from other systems into AppRun Site apps.</p>
<p>See a component that displays the random XKCD pictures using async fetch from the <strong>src/components</strong> directory.</p>
<p><my-xkcd></my-xkcd></p>
<p>The code of the component is listed below.</p>
<pre><code class="language-javascript">import { app, Component, customElement } from 'apprun';

@customElement('my-xkcd')
export default class extends Component {
  state = {};

  view = (state) =&gt; &lt;&gt;
    &lt;div&gt;&lt;button $onclick='fetchComic'&gt;XKCD&lt;/button&gt;&lt;/div&gt;
    {state.loading ? &lt;div&gt;loading ... &lt;/div&gt; : ''}
    {state.comic &amp;&amp; &lt;&gt;
      &lt;h3&gt;{state.comic.title}&lt;/h3&gt;
      &lt;img src={state.comic.url} /&gt;
    &lt;/&gt;}
  &lt;/&gt;;

  update = {
    'loading': (state, loading) =&gt; ({ ...state, loading }),
    'fetchComic': async _ =&gt; {
      this.run('loading', true);
      const response = await fetch('https://xkcd-imgs.herokuapp.com/');
      const comic = await response.json();
      return { comic };
    }
  };
}
</code></pre>
<p>The fetch results can be cached by the service worker so that you can build a lightning fast app (even for dynamic content) that works offline.</p>
`;
}