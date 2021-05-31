import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="pages">Pages</h1>
<p>AppRun Site pages are made of AppRun components, HTML files, and markdown files. They are stored under the <strong>src/pages</strong> directory.</p>
<h2 id="component-pages">Component Pages</h2>
<p>It is straightforward to create AppRun components as AppRun Site pages. You create a component class around the <em>state</em>, <em>view</em>, and <em>update</em>.</p>
<pre><code class="language-javascript">import {app, Component} from 'apprun';

class About extends Component {
  state = 'about page';
  view = state =&gt; &lt;div/&gt;;
  update = {};
}
</code></pre>
<h2 id="html-pages">HTML Pages</h2>
<p>In additional to AppRun components, you can create HTML files inside the <strong>src/pages</strong> directory. They are converted into AppRun components by the <em>npx apprun-site build</em> command.</p>
<p>E.g., if you have an <em>a.html</em> file</p>
<pre><code class="language-html">&lt;h1&gt;Hello World&lt;/h1&gt;
</code></pre>
<p>It will be converted into a component.</p>
<pre><code class="language-javascript">import { app, Component } from 'apprun';
export default class extends Component {
  view = _ =&gt; '_html:&lt;h1&gt;Hello World&lt;/h1&gt;';
}
</code></pre>
<h2 id="markdown-pages">Markdown Pages</h2>
<p>You can also create markdown files inside the <strong>src/pages</strong> directory. They are converted into AppRun components by the <em>npx apprun-site build</em> command.</p>
<p>E.g., if you have an <em>a.md</em> file</p>
<pre><code class="language-markdown"># Hello World
</code></pre>
<p>It will be converted into a component.</p>
<pre><code class="language-javascript">import { app, Component } from 'apprun';
export default class extends Component {
  view = _ =&gt; '_html:&lt;h1&gt;Hello World&lt;/h1&gt;';
}
</code></pre>
<p>All pages are components that are waiting to be <a href="#routing">activated/routed</a> using the events.</p>
`;
}