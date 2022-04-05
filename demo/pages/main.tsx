import app from 'apprun';
import Layout from '../src/bootstrap4/layout';
import render_layout from '../src/render_layout';
import Comic from '../components/comic';

export default () => {
  app.webComponent('ws-comic', Comic);
  window["app-element"] = 'my-app';
  render_layout(Layout);
}
