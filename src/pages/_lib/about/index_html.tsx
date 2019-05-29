import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1>About</h1>
<div>web components in HTML</div>
<my-img src='/home/logo.png'></my-img>`;
}