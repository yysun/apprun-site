import app from 'apprun';

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
  const [event, Comp] = def;
  if (typeof Comp === 'string') {
    app.on(event, () => app.render(element, <HTML url={Comp}/>));
  } else {
    const component = new Comp().mount(element);
    app.on(event, (...p) => component.run('.', ...p));
  }
});