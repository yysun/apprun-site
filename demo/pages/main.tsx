import app from 'apprun';
import Layout from '../src/bootstrap4/layout';
import render_layout from '../src/render_layout';
import Comic from '../components/comic';

app.webComponent('ws-comic', Comic);

export default () => render_layout(Layout);
