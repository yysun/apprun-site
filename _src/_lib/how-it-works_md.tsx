import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="how-it-works">How It Works</h1>
<p>AppRun Site apps are Single Page Applications (SPA). You develop the pages using AppRun components, HTML files, and markdown files.</p>
<p>You put AppRun components in the <em>pages</em> directory as following:</p>
<pre><code>src/
  pages/
    home.tsx
    contact.tsx
    about.tsx
</code></pre>
<p>If you have HTML files and markdown files in the <em>pages</em> directory, the <em>npm build</em> scripts calls the <em>apprun-site CLI</em> to convert them into AppRun components and saves to the <strong>src/_lib</strong> directory.</p>
<p>The <em>npm build</em> scripts creates the <strong>src/_lib/index.tsx</strong> file that contains the routing events and all the components from <strong>src/_lib</strong> and <strong>src/pages</strong>.</p>
<pre><code class="language-javascript">// this file is auto-generated
import _about_0 from './about_tsx';
import _contact_1 from './contact_tsx';
import _home_2 from './home_tsx';
export default [
  [&quot;/about&quot;, _about_0],
  [&quot;/contact&quot;, _contact_1],
  [&quot;/home&quot;, _home_2],
] as (readonly [string, any])[];
</code></pre>
<p>The generated <strong>src/_lib/index.tsx</strong> exports an array that maps routing events to components.</p>
<p>The event-component mapping from <strong>src/_lib/index.tsx</strong> is used to creates the pages, and sets the routing events in the main entry point of the application, <strong>src/index.tsx</strong>,</p>
<p>Let's <a href="#getting-started">Getting Started</a> see it in action.</p>
`;
}