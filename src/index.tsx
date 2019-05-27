import { app, ROUTER_EVENT, ROUTER_404_EVENT } from 'apprun';

import Layout from './layout';
import pages from './pages';
import { sidebar } from './pages';

import * as config from './config.json';
const site = {
  name: config.name,
  nav: config.nav,
  sidebar: config.sidebar.concat(sidebar)
};


const HTML =  ({ url }) => {
  element.innerHTML = '<div></div>';
  fetch(url)
    .then(response => response.text())
    .then(html => element.innerHTML = html)
}

app.render(document.body, <Layout {...site}/>);
const element = document.getElementById('main');
pages.forEach(def => {
  const [e, Comp] = def;
  if (typeof Comp === 'string') {
    app.on(e, () => app.render(element, <HTML url={Comp}/>));
  } else {
    const component = new Comp().mount(element);
    app.on(e, (...p) => component.run('.', ...p));
  }
});


const linkClick = e => {
  e.preventDefault();
  const menu = e.target as HTMLAnchorElement
  history.pushState(null, "", menu.href)
  app.run(menu.pathname);
}

export const fixAnchors = (selectors: string) => {
  document.querySelectorAll(selectors)
    .forEach((a: HTMLAnchorElement) => {
      a.onclick = linkClick;
    });
}

app.on(ROUTER_EVENT, (...rest) => {
  fixAnchors('a');
});