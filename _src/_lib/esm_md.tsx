import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="javascript-modules">JavaScript Modules</h1>
<p>AppRun Site apps use components. Components are build and exported as modules. They are imported and bundled into the <strong>app.js</strong>.</p>
<p>JavaScript/ECMAScript modules are now supported in all major browsers! You can serve the modules without bundling.</p>
<h2 id="import-es-module-in-browser">Import ES Module in Browser</h2>
<p>The <strong>index.html</strong> below is a pattern to serve both bundled JS file and the module files.</p>
<pre><code class="language-javascript">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;title&gt;My AppRun Site&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;script nomodule src=&quot;/app.js&quot;&gt;&lt;/script&gt;
  &lt;script type=&quot;module&quot; src=&quot;/esm/index-esm.js&quot;&gt;&lt;/script&gt;&lt;/body&gt;
&lt;/html&gt;
</code></pre>
<h2 id="build-the-modules">Build the Modules</h2>
<p>To build the modules, you can use TypeScript directly to compile source code from the <strong>sec</strong> directory to the <strong>public/esm</strong> directory.</p>
<pre><code class="language-sh">tsc -p src --outDir public/esm
</code></pre>
<h2 id="fix-the-global-imports">Fix the Global Imports</h2>
<p>However, there is still a problem. The browser does not how to import global modules. E.g., All components import the global module <em>apprun</em>.</p>
<pre><code class="language-javascript">import { app, Component } from 'apprun';
export default class extends Component {
  //
}
</code></pre>
<p>The browser will refuse to load and report error:</p>
<pre><code>Relative references must start with either &quot;/&quot;, &quot;./&quot;, or &quot;../&quot;.
</code></pre>
<p>Fortunately, AppRun Site provides a handy command <em>fix-esm</em> to fix the global modules.</p>
<pre><code class="language-sh">npx apprun-site fix-esm --source public/esm
</code></pre>
<p>The command does two things:</p>
<ol>
<li>
<p>It copies the apprun.js from the <strong>node_modules</strong> directory to the <strong>public/esm/_modules</strong> directory.</p>
</li>
<li>
<p>Fix the module references to use the newly copied file</p>
</li>
</ol>
<pre><code class="language-javascript">import { app, Component } from '/esm/_modules/apprun.js';
export default class extends Component {
  //
}
</code></pre>
<p>Problem solved!</p>
<h2 id="dynamic-module-loading">Dynamic Module Loading</h2>
<p>ES module can be statically imported or dynamically imported. The main reason to use the ES module in AppRun Site is to import the modules dynamically.</p>
<p>Dynamic import is a JavaScript language feature that enables the lazy-loading of modules. It introduces a new function-like form of import returns a promise of the requested modules that you can use to import modules when they are needed.</p>
<p>E.g., the <em>about</em> component is only loaded when the <em>/about</em> routing event is published.</p>
<pre><code class="language-javascript">app.on('/about', (...p) =&gt; {
  import('/esm/_lib/about_md.js').then((module) =&gt; {
    const component = new module.default().mount('main');
    component.run('.', ...p);
  });
});
</code></pre>
<h3 id="event-component-mapping-for-dynamic-import">Event-Component Mapping for Dynamic Import</h3>
<p>Remember the AppRun Site <em>build</em> command scans the <strong>src/pages</strong> directly and creates the <strong>src/_lib/index.tsx</strong> file that statically imports all the components and exports a mapping of events and components.</p>
<p>the AppRun Site <em>build</em> command also creates the <strong>src/_lib/index-esm.tsx</strong> file, which includes the mapping between the routing events with the component and modules.</p>
<pre><code class="language-javascript">// this file is auto-generated
export default [
  [&quot;/about&quot;, '_about_md_0', '/esm/_lib/about_md.js'],
  [&quot;/contact&quot;, '_contact_1', '/esm/_lib/contact_tsx.js'],
  [&quot;/home&quot;, '_home_2', '/esm/_lib/home_tsx.js'],
  [&quot;/&quot;, '_index_3', '/esm/_lib/index_tsx.js'],
  [&quot;/README&quot;, '_README_md_4', '/esm/_lib/README_md.js'],
  [&quot;/_404&quot;, '_index_5', '/esm/_lib/_404/index_tsx.js'],
]
</code></pre>
<p>You can use this mapping file to load component modules dynamically on demand.</p>
<pre><code class="language-javascript">import pages from './_lib/index-esm';
pages.forEach(def =&gt; {
  let [evt, name, imp] = def;
  app.on(evt, (...p) =&gt; {
    import(imp).then((module) =&gt; {
      const component = new module.default().mount('main');
      component.run('.', ...p);
    });
  });
});
</code></pre>
<p>Now, you have got the <a href="https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/">code-splitting</a> feature to improve page-load times.</p>
<p>You have both bundled and modularized app. Next, you will learn how to <a href="#deploy">deploy</a> the app.</p>
`;
}