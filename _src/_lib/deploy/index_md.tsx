import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="build-and-deploy">Build and Deploy</h1>
<h2 id="build">Build</h2>
<p>The <em>npm script</em> in the AppRun Site app to compile and bundle is:</p>
<pre><code class="language-sh">npm run build
</code></pre>
<p>All the code and assets are built into the <strong>public</strong> directory.</p>
<h2 id="deploy">Deploy</h2>
<p>AppRun Site apps are client-side apps. All code runs in the browsers. There is no server-side app needed. The deployment is to copy the  <strong>public</strong> directory to the web server.</p>
`;
}