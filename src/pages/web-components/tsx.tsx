import { app, Component } from 'apprun';

export default class extends Component {
  view = (state) => <>
    <h1>Web Component - tsx</h1>
    <div>You can use web components in the component's jsx view</div>
    <pre>
      view = (state) => &lt;my-img src='logo.png'&gt;&lt;/my-img&gt;
    </pre>
    <div><my-img src='logo.png'></my-img></div>
  </>
}