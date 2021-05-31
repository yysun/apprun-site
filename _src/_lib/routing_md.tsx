import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="routing">Routing</h1>
<p>AppRun Site router detects the hash/path changes in URL (by listening to the window's <em>onpopstate</em> event) and publishes the routing events.</p>
<h2 id="routing-events">Routing Events</h2>
<p>Pages are components inside the <strong>src/pages</strong> directory.</p>
<p>In the main program <strong>src/index.tsx</strong>, it uses the <strong>site.start</strong> function to maps the routing events to the page components.</p>
<p>When users navigate to http://.../item/a/b/c, the <em>/item</em> event is published and sent to the _<em>item</em> component to display along with 'a', 'b', 'c' as the event parameters.</p>
<p>You can override it to accept routing parameters.</p>
<pre><code class="language-javascript">import { app, Component } from 'apprun';

export default class extends Component {
  view = state =&gt; &lt;div&gt;{state}&lt;/div&gt;
  update = {
    '.': (state, id) =&gt; id
  }
}
</code></pre>
<h2 id="routing-with-pretty-links-(%2F)">Routing with Pretty Links (/)</h2>
<p>By default, AppRun Site uses pretty links (i.e., non-hash links) and have HTML5 browser history. You need to set up the web server to have the 404-fallback page to be the <em>index.htm</em> in case users hard refresh the pages.</p>
<h2 id="routing-with-hash-(%23)">Routing with Hash (#)</h2>
<p>You can also use the hash sign for routing. E.g.,  URL http://..../#about triggers the <em>#about</em> event and then wakes up the <em>About</em> component. To enable this feature, just set the _eventRoot in the configuration.</p>
<pre><code class="language-javascript">import app from './_site';

const config = {
  title: 'My AppRun Site',
  // ...
  eventRoot: '#'
};

app.start(config);
</code></pre>
<p>You also need to set the --root options to be '#' when running the <em>npx apprun-site build</em> command.</p>
<pre><code class="language-sh">npx apprun-site build --root '#'
</code></pre>
<p>Next, you can learn more about how <a href="#components">components</a>.</p>
`;
}