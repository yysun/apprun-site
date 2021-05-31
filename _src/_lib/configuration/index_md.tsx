import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="configuration">Configuration</h1>
<p>A SPA usually has a layout, which includes a header, a top nav, a sidebar, a footer, and the main area for displaying the pages.</p>
<p>You can pass a configuration object to the <strong>site.start</strong> function to</p>
<ul>
<li>Set page title in the layout</li>
<li>Set the main element Id for displaying the pages</li>
<li>Set nav bar menus</li>
<li>Set sidebar menus</li>
<li>Set the layout component</li>
<li>Set the pages, which is the auto-generated event-component mapping</li>
</ul>
<pre><code class="language-javascript">import app from 'apprun-site';
import layout from './layout';
import pages from './_lib';
const nav = [
  { &quot;text&quot;: &quot;Home&quot;, &quot;link&quot;: &quot;/&quot; },
  { &quot;text&quot;: &quot;Contact&quot;, &quot;link&quot;: &quot;/contact&quot; },
  { &quot;text&quot;: &quot;About&quot;, &quot;link&quot;: &quot;/about&quot; }
];
const config = {
  title: 'My AppRun Site',
  element: 'main',
  nav,
  sidebar: nav,
  layout,
  pages
};

app.start(site);
</code></pre>
<p>The <em>npx apprun-site init</em> command creates four out-of-box layouts.</p>
<ul>
<li>Default - best for the documentation site</li>
<li>Bootstrap - start point of bootstrap</li>
<li>CoreUI - best for admin UI / business apps</li>
<li>Material Design - best for mobile web app</li>
</ul>
<p>They all follow the configuration schema to render the page accordingly.</p>
<p>You can rename the layout directory to switch the layouts.</p>
<ul>
<li>
<p>To use the bootstrap layout, rename <em>layout-bootstrap</em> to <em>layout</em></p>
</li>
<li>
<p>To use the coreUI layout, rename <em>layout-coreui</em> to <em>layout</em></p>
</li>
<li>
<p>To use the material layout, rename <em>layout-material</em> to <em>layout</em></p>
</li>
</ul>
<h2 id="create-layout">Create Layout</h2>
<p>You can create your own layout as a regular <a href="#component">component</a>. A layout template looks like:</p>
<pre><code class="language-javascript">import app from 'apprun';

export default ({ title, element, nav, sidebar }) =&gt; &lt;&gt;
  &lt;div id=&quot;main&quot;&gt;&lt;div&gt;
&lt;/&gt;
</code></pre>
<p>Next, you can learn more about the <a href="#pages">pages</a>.</p>
`;
}