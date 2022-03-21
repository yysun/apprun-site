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

const add_component = (component, main_element) => {
  const [path, file] = component;
  app.once(path, async () => {
    const module = await import(\`\${ file }\`);
    const component = new module.default();
    component.mount(main_element, { route: path });
    app.route(location.pathname);
  });
};

const add_components = (components, main_element) => {
  components && components.forEach(item => add_component(item, main_element));
};

const render_layout = async ({ Layout, styles = null, scripts = null, body_class = null }) => {
  if (document.head.parentElement.dataset.static == null) {
    if (styles) for (let i = 0; i < styles.length; i++) await add_css(styles[i]);
    document.head.parentElement.dataset.static = "true";
  }
  if (scripts) for (let i = 0; i < scripts.length; i++) await add_js(scripts[i]);
  body_class && document.body.classList.add(...body_class);
  Layout && app.render(document.body, <Layout />);
  app.route(location.pathname);
};

app.on('//', () => {
  const menus = document.querySelectorAll('a[href*="/"]');
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i] as HTMLAnchorElement;
    menu.onclick = (e) => {
      e.preventDefault();
      history.pushState(null, '', menu.href);
      app.route(menu.pathname);
    }
  }
});

const load_apprun_dev_tools = () => {
  add_js('https://unpkg.com/apprun/dist/apprun-dev-tools.js');
}

`
