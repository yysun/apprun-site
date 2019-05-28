import app from 'apprun';
import route from './route';

import Layout from '../layout';
import pages from '../pages/_index';

export const HTML =  ({ url }) => {
  element.innerHTML = '<div></div>';
  fetch(url)
    .then(response => response.text())
    .then(html => element.innerHTML = html)
}

export const Link = ({ to, className }, children) => <a class={className} href="{to}"
  onclick={e => route(to, e)}>
  {children}
</a>

import * as config from '../config.json';
const site = {
  name: config.name,
  nav: config.nav,
  sidebar: config.sidebar
};

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
