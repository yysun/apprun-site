import { app, Component } from '../apprun';
declare var mdc;

let topAppBar;
let drawer;

const site_name = 'My Site';

const main_element = 'my-app';

const sidebar = [
  {
    "text": "Home",
    "link": "/"
  },
  {
    "text": "Contact",
    "link": "/contact"
  },
  {
    "text": "About",
    "link": "/about"
  },
  {
    "text": "Products",
    "link": "/products"
  }
];


app.on('$', ({ key, props }) => {
  if (key === '$mdc-drawer') {
    props.ref = e => drawer = mdc.drawer.MDCDrawer.attachTo(e);
    props.onclick = e => {
      drawer.open = false; return true;
    }
  } else if (key === '$mdc-top-app-bar') {
    props.ref = e => {
      topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(e);
      // https://github.com/material-components/material-components-web/issues/5615
      document.querySelectorAll('.mdc-list-item')[0].setAttribute('tabIndex', '0');
      topAppBar.setScrollTarget(document.querySelector('.drawer-main-content'));
      topAppBar.listen('MDCTopAppBar:nav', () => {
        drawer.open = !drawer.open;
      })
    }
  }
});
export class Layout extends Component {

  view = () => {

    return <div id="root">
      <div class="drawer-frame-root">
        <aside class="mdc-drawer mdc-drawer--modal" $mdc-drawer>
          <div class="mdc-drawer__header">
            <h3 class="mdc-drawer__title">{site_name}</h3>
            {/* <h6 class="mdc-drawer__subtitle">email@material.io</h6> */}
          </div>
          <div class="mdc-drawer__content">
            <nav class="mdc-list">
              {sidebar.map(item => <a class="mdc-list-item" href={item.link}>
                <i class="material-icons mdc-list-item__graphic">home</i>{item.text}</a>
              )}
              <hr class="mdc-list-divider" />
              <a class="mdc-list-item mdc-list-item" href="#">
                <i class="material-icons mdc-list-item__graphic">settings</i>Settings
              </a>
              <a class="mdc-list-item" href="#">
                <i class="material-icons mdc-list-item__graphic">announcement</i>Help &amp; feedback
              </a>
            </nav>
          </div>
        </aside>
        <div class="mdc-drawer-scrim"></div>
        <div class="drawer-frame-app-content">
          <header class="mdc-top-app-bar" $mdc-top-app-bar>
            <div class="mdc-top-app-bar__row">
              <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
                <span class="mdc-top-app-bar__title">{site_name}</span>
              </section>
              <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">

                {/* {nav.map(item => <button onclick={e => app.run(item.link, e)}
                    class="mdc-top-app-bar__action-item"
                  aria-label={item.text}>{item.text}</button>)} */}

                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Download">file_download</button>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Print this page">print</button>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Bookmark this page">bookmark</button>
              </section>
            </div>
          </header>
          <div class="drawer-main-content" tabindex="0">
            <div class="mdc-top-app-bar--fixed-adjust"></div>
            <div id={main_element}></div>
          </div>
        </div>
      </div>
    </div>;
  }

  unload = () => {
    topAppBar.destroy();
    drawer.destroy();
  }
}

export default {
  styles: [
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
    'https://unpkg.com/material-components-web@6/dist/material-components-web.min.css'
  ],
  scripts: [
    'https://unpkg.com/material-components-web@6/dist/material-components-web.min.js',
  ],
  body_class: ['mdc-typography'],
  Layout,
  main_element
}
