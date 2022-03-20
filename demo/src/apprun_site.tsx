import app from 'apprun';
export const add_link = (rel, href, type) => {
  const link = document.createElement('link');
  rel && (link.rel = rel);
  type && (link.type = type);
  href && (link.href = href);
  document.head.appendChild(link);
};

export const add_css = url => new Promise((resolve, reject) => {
  const link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  link.onload = resolve;
  link.onerror = reject;
  document.head.appendChild(link);
});

export const add_js = (url, type = null) => new Promise((resolve, reject) => {
  const link = document.createElement('script') as HTMLScriptElement;
  link.src = url;
  (type) ? link.type = type : null;
  link.onload = resolve;
  link.onerror = reject;
  document.body.appendChild(link);
});

const add_component = ({ path, component, element }) => {
  app.once(path, async () => {
    const module = await import(`./${component}.js`);
    new module.default().mount(element);
  });
};

export const add_components = components => {
  components && components.forEach(item => add_component(item));
};

export const render_layout = app['init'] = async ({ Layout, styles=null, scripts=null, body_class=null, components=null }) => {
  add_components(components);
  if (styles) for (let i = 0; i < styles.length; i++) await add_css(styles[i]);
  if (scripts) for (let i = 0; i < scripts.length; i++) await add_js(scripts[i]);
  body_class && document.body.classList.add(...body_class);
  Layout && app.render(document.body, <Layout/>);
  app.run('route', location.hash);
};

export const load_layout = app['load_layout'] = async (layout = window['layout']) => {
  if (!layout) return;
  import(`./${layout}.js`).then(async module => render_layout(module.default || {}));
};

export const load_apprun_dev_tools = () => {
  add_js('https://unpkg.com/apprun/dist/apprun-dev-tools.js');
}
