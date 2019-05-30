import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:# Web Component - HTML
<div>web components defined in HTML</div>
<my-img src='/logo.png'></my-img>`;
}