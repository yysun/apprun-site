import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="progressive-web-apps-(pwa)">Progressive Web Apps (PWA)</h1>
<p>AppRun Site includes the service worker from <a href="https://www.pwabuilder.com/">PWA Builder</a>.</p>
<p>The service worker improves the performance of your app, and make it work offline. The advanced caching service worker allows you to configure files and routes that are cached in different manners (pre-cache, network/server first, cache first, etc.).</p>
<h2 id="register-the-service-worker">Register the Service Worker</h2>
<p>To register the service worker, include the script in the header section of the <strong>index.html</strong> file.</p>
<pre><code>&lt;script src=&quot;sw-init.js&quot;&gt;&lt;/script&gt;
</code></pre>
<h2 id="configure-the-service-worker">Configure the Service Worker</h2>
<p>To configure the service worker, open and edit the <strong>sw.js</strong> file.</p>
<pre><code class="language-javascript">const CACHE = &quot;my-apprun-site&quot;;
const precacheFiles = [
  &quot;index.html&quot;,
  &quot;app.js&quot;,
  &quot;style.css&quot;
];

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = &quot;offline.html&quot;;
const offlineFallbackPage = &quot;offline.html&quot;;

const networkFirstPaths = [
  /* Add an array of regex of paths that should go network first */
  // Example: /\/api\/.*/
];

const avoidCachingPaths = [
  /* Add an array of regex of paths that shouldn't be cached */
  // Example: /\/api\/.*/
  /\/sockjs-node\/*/
];

</code></pre>
`;
}