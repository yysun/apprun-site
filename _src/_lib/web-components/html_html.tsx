import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1>Web Component - HTML</h1>
<div>You can use web components in HTML</div>
<pre>
    &lt;my-img src='logo.png'&gt;&lt;/my-img&gt;
</pre>
<my-img src='logo.png'></my-img>`;
}