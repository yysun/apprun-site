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

const HTML =  ({ element, url }) => {
  element.innerHTML = '<div></div>';
  fetch('/pages/' + url)
    .then(response => response.text())
    .then(html => element.innerHTML = html)
}

export const Link = ({ to, className }, children) => <a class={className} href="{to}"
  onclick={e => route(to, e)}>
  {children}
</a>

export default {
  start: (config) => {
    app.render(document.body, <config.layout {...config} />);
    const element = document.getElementById(config.element);
    config.pages.forEach(def => {
      const [e, Comp] = def;
      if (typeof Comp === 'string') {
        app.on(e, () => app.render(element, <HTML element={element} url={Comp} />));
      } else {
        const component = new Comp().mount(element);
        app.on(e, (...p) => component.run('.', ...p));
      }
    });
  }
}
