import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => [{"tag":"p","props":{},"children":["<div>web components in Markdown</div>","\n","<my-img src='/logo.png'></my-img>"]},"\n"];
}