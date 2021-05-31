import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="components">Components</h1>
<p>Components are the application building blocks in AppRun applications. Using components is a technique to decompose the large system into smaller, manageable and reusable pieces.</p>
<h2 id="create-components">Create Components</h2>
<p>Components provide a local scope to the elm like architecture, which means inside a component, there are <em>state</em>, <em>view</em>, and <em>update</em>.</p>
<pre><code class="language-javascript">import {app, Component} from 'apprun';

export default class extends Component {
  state = '';
  view = state =&gt; &lt;div&gt;{state}&lt;/div&gt;;
  update = {};
}
</code></pre>
<p>The <em>state</em>, <em>view</em>, and <em>update</em> are provided to AppRun, AppRun registers the event handlers defined in the update and waits for AppRun events to start the <a href="https://apprun.js.org/docs/index.html#/04-architecture#apprun-event-life-cycle">event life cycle</a>.</p>
<p>The three parts are all optional. Components can be as simple as only have the <em>view</em> function.</p>
<pre><code class="language-javascript">import {app, Component} from 'apprun';

export default class extends Component {
  view = state =&gt; &lt;div&gt;{state}&lt;/div&gt;
}
</code></pre>
<h2 id="component-composition">Component Composition</h2>
<p>You can create page components out of other non-page components.</p>
<pre><code class="language-javascript">class Child extends Component {
  state = {}
  view = state =&gt; &lt;div&gt;&lt;/div&gt;
  update = {}
}

class Page extends Component {
  state = {}
  view = state =&gt; &lt;div&gt;
    &lt;Child /&gt;
  &lt;/div&gt;
  update = {}
}
</code></pre>
<p>Usually non-page components are under the <strong>src/components</strong> directory. You import them where needed to compose your pages.</p>
<h2 id="web-components">Web Components</h2>
<p>You can use AppRun components in HTML pages and markdown pages directly by making AppRun components into <a href="#web-components">web components</a>.</p>
`;
}