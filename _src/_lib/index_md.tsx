import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="apprun-site">AppRun Site</h1>
<h2 id="introduction">Introduction</h2>
<p><a href="https://apprun.js.org">AppRun</a> is a Javascript library for building reliable, high-performance web applications using the Elm inspired Architecture, events, and components.</p>
<p><strong><a href="https://yysun.github.io/apprun-site">AppRun Site</a></strong> is a framework for building AppRun applications.</p>
<h2 id="features">Features</h2>
<ul>
<li>Progressive Web App (PWA) - support offline</li>
<li>Single Page App (SPA) - routing using / or #</li>
<li>4 built-in layouts and bring your own</li>
<li>Compile HTML, markdown pages to AppRun components</li>
<li>Auto generate the index of pages</li>
<li>Build app logic using AppRun/Web components</li>
<li>Targets ES5 or ES Module</li>
<li>Extensible through plugins (WIP)</li>
</ul>
<h2 id="quick-start">Quick Start</h2>
<p>To create an AppRun Site:</p>
<pre><code class="language-sh">npx apprun-site init my-apprun-site
cd my-apprun-site
npm install
</code></pre>
<p>Then, you can use:</p>
<ul>
<li>Use <em>npm start</em> to start the dev server</li>
<li>Use <em>npm run build</em> to build for production</li>
</ul>
<h2 id="ready-for-more-information">Ready for More Information</h2>
<ul>
<li>You can find out <a href="#how-it-works">how it works</a>.</li>
</ul>
`;
}