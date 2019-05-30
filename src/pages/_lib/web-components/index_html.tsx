import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<div>web components in HTML</div>
<my-img src='/logo.png'></my-img>`;
}