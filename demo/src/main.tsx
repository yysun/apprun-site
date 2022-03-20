import app from 'apprun';

import { load_apprun_dev_tools } from './apprun_site';
import layout from './tailwind/layout';
load_apprun_dev_tools();


const add_component = ({ path, component, element }) => {
  app.once(path, async () => {
    const module = await import(`${component}`);
    new module.default().mount(element);
  });
};
export const add_components = components => {
  components && components.forEach(item => add_component(item));
};

export const render_layout = app['init'] = async ({ Layout, styles = null, scripts = null, body_class = null, components = null }) => {
  add_components(components);
  if (styles) for (let i = 0; i < styles.length; i++) await add_css(styles[i]);
  if (scripts) for (let i = 0; i < scripts.length; i++) await add_js(scripts[i]);
  body_class && document.body.classList.add(...body_class);
  Layout && app.render(document.body, <Layout />);
  app.run('route', location.hash);
};


render_layout(layout);