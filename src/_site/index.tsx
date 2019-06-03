import app from 'apprun';

function configRoot(root = '#') {

  // app.on('///', () => app.run(`${root}404`));

  const route = (url, e?) => {
    e && e.preventDefault();
    url = url.replace(/\/$/, "");
    url = url || root;
    if (!app.run(url)) app.run(`${root}_404`);
  }

  if (root.startsWith('/')) {

    document.addEventListener("DOMContentLoaded", () => {
      window.onpopstate = () => route(location.pathname);
      route(location.pathname);
    });

    window.onclick = e => linkClick(e);
    const linkClick = e => {
      const menu = e.target as HTMLAnchorElement
      let url = menu.href;
      if (url && url.startsWith(document.location.origin)) {
        e.preventDefault();
        history.pushState(null, "", menu.pathname)
        route(menu.pathname);
      }
    }
  }
}

export default {
  start: (config) => {
    configRoot(config.eventRoot);
    app.render(document.body, <config.layout {...config} />);
    const element = document.getElementById(config.element);
    config.pages.forEach(def => {
      const [e, Comp] = def;
      const component = new Comp().mount(element);
      app.on(e, (...p) => component.run('.', ...p));
    });
  }
}
