import app from 'apprun';

/*--- router ---*/
const route = (url, e?) => {
  e && e.preventDefault();
  url = url.replace(/\/$/, "");
  url = url || '/';
  if (!app.run(url)) app.run('/_404');
}

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
    if (!url.endsWith('/')) url = url + '/';
    history.pushState(null, "", menu.pathname)
    route(menu.pathname);
  }
}
/*--- ------ ---*/


export default (config) => {
  app.render(document.body, <config.layout {...config} />);
  const element = document.getElementById(config.element);
  config.pages.forEach(def => {
    let [evt, name, imp] = def;
    app.on(evt, (...p) => {
      import(imp).then((module) => {
        const component = new module.default().mount(element);
        component.run('.', ...p);
      });
    });
  });
};