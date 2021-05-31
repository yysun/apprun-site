import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="web-components">Web Components</h1>
<p>Web components are custom elements in HTML.</p>
<pre><code>&lt;my-img src='logo.png'&gt;&lt;/my-img&gt;
</code></pre>
<p>You can create web components out of AppRun components.</p>
<pre><code class="language-javascript">import {app, Component, customElement} from 'apprun';

@customElement('my-img')
export default class extends Component {
  view = ({ src }) =&gt; &lt;img src={src} /&gt;
}
</code></pre>
<p>And then use it in <a href="#web-components_html">HTML page</a>, or in <a href="#web-components_tsx">JSX view</a> of AppRun components, or in markdown page like in this page.</p>
<p>This page is a markdown page. It should display the web component.</p>
<p><my-img src='logo.png'></my-img></p>
<p>Next, you can learn</p>
<ul>
<li>How to <a href="#fetch">fetch resource (call APIs)</a>.</li>
<li>How to make a <a href="#pwa">Progress Web App</a>.</li>
<li>How to build and deploy <a href="#deploy">Progress Web App</a>.</li>
</ul>
`;
}