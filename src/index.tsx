import app from 'apprun';

import './_site/route';

import Layout from './layout';
import pages from './pages';

import * as config from './config.json';
const site = {
  name: config.name,
  nav: config.nav,
  sidebar: config.sidebar
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
