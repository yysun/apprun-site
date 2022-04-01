import Layout from '../src/tailwind/layout';

import render_layout from '../src/render_layout';
export default () => {
  window["app-element"] = 'my-app';
  render_layout(Layout);
}
