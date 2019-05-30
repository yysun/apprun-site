import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => [{"tag":"h1","props":{"id":"web-component---markdown"},"children":["Web Component - Markdown"]},"\n",{"tag":"p","props":{},"children":["<div>web components defined in Markdown</div>","\n","<my-img src='/logo.png'></my-img>"]},"\n"];
}