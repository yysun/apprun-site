module.exports = `

import app from 'apprun';

const add_link = (rel, href, type) => {
  const link = document.createElement('link');
  rel && (link.rel = rel);
  type && (link.type = type);
  href && (link.href = href);
  document.head.appendChild(link);
};

const add_css = url => new Promise((resolve, reject) => {
  const link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  link.onload = resolve;
  link.onerror = reject;
  document.head.appendChild(link);
});

const add_js = (url, type = null) => new Promise((resolve, reject) => {
  const link = document.createElement('script') as HTMLScriptElement;
  link.src = url;
  (type) ? link.type = type : null;
  link.onload = resolve;
  link.onerror = reject;
  document.body.appendChild(link);
});

const add_component = (component, site_url, main_element) => {
  let [path, file] = component;
  app.once(path, async (...p) => {
    const module = await import(\`\${site_url}\${file}\`);
    const component = new module.default();
    component.mount(main_element, { route: path });
    app.route([path, ...p].join('/'));
  });
};

const add_components = (components, site_url, main_element = 'my-app') => {
  components && components.forEach(item => add_component(item, site_url, main_element));
};

const render_layout = async ({ Layout, styles = null, scripts = null, body_class = null }) => {
  if (document.head.parentElement.dataset.css == null) {
    if (styles) for (let i = 0; i < styles.length; i++) await add_css(styles[i]);
    document.head.parentElement.dataset.css = "true";
  }
  if (scripts) for (let i = 0; i < scripts.length; i++) await add_js(scripts[i]);
  body_class && document.body.classList.add(...body_class);
  Layout && app.render(document.body, <Layout />);
};
`