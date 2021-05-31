import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="getting-start">Getting Start</h1>
<p>To create an AppRun Site app:</p>
<pre><code class="language-sh">npx apprun-site init my-apprun-site
cd my-apprun-site
npm install
</code></pre>
<p>The <strong>init</strong> command creates a project structure. The main entry of the app is <strong>src/index.tsx</strong>.</p>
<pre><code>public/
src/
  _lib/
  _site/
  layouts/
  pages/
    home.tsx
    contact.tsx
    about.tsx
  index.tsx   &lt;=== main entry
  tsconfig.json
.gitignore
package.json
webpack.config.js
</code></pre>
<p>Use <em>npm start</em> to start the dev server and run the app in browser http://localhost:8080</p>
<blockquote>
<p>You can modify the home, contact and about components. Or add a few pages your own. The dev server will refresh to show your changes on the fly.</p>
</blockquote>
<p>The main entry point of the app is the <strong>src/index.tsx</strong>. It looks like:</p>
<pre><code class="language-javascript">import site from './_site';
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

site.start(config);
</code></pre>
<p><strong>src/index.tsx</strong> imports</p>
<ul>
<li>the <em>site</em> object from <em>./site</em></li>
<li>the layout from <em>./layout</em></li>
<li>the pages from <em>./lib</em></li>
</ul>
<p><strong>src/index.tsx</strong> calls the <em>site.start</em> function to start the app with the configuration options.</p>
<p>Next, let's see how to <a href="#configuration">configure</a>.</p>
`;
}