import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="references">References</h1>
<h2 id="init-command">Init Command</h2>
<p>The <em>init</em> command downloads the AppRun Site template from https://github.com/apprunjs/apprun-starter</p>
<pre><code>Usage:
  $ npx apprun-site init [targetDir]

Options:
  -r, --repo [repo]  repository, default: apprunjs/apprun-starter
  -h, --help         Display this message
  -v, --version      Display version number
</code></pre>
<h2 id="build-command">Build Command</h2>
<p>The <em>build</em> command converts the HTML file and markdown files under the <strong>src/pages</strong> directory into AppRun components and stores them under <strong>src/_lib</strong> directory.</p>
<p>Then the <em>build</em> command creates the <strong>src/_lib/index.tsx</strong> to import all pages and exports the event-page mappings, which is used the main program <strong>src/index.tsx</strong>.</p>
<pre><code>Usage:
  $ npx apprun-site build

Options:
  -r, --root [root]         event root, default /, you can make it #
  -s, --source [sourceDir]  source directory
  -t, --target [targetDir]  target directory
  -w, --watch               watch the folder
  -V, --verbose             show verbose diagnostic information
  -h, --help                Display this message
  -v, --version             Display version number
</code></pre>
`;
}