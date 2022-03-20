import { app } from '../apprun'

import Header from './header';
import Sidebar from './sidebar';
import Aside from './aside';
import Footer from './footer';
import Breadcrumb from './breadcrumb';

const Layout = () => {
  const { theme, sidebar, nav } = window['config'];
  return <>
    <Header nav={nav} />
    <div class="app-body">
      <div class="sidebar">
        <nav class="sidebar-nav">
          <Sidebar sidebar={sidebar} />
        </nav>
        <button class="sidebar-minimizer brand-minimizer" type="button"></button>
      </div>
      <main class="main">
        <Breadcrumb />
        <div class="container-fluid" >
          <div class="card">
            <div className="card-body" id={theme.main_element}></div>
          </div>
        </div>
      </main>
      <aside class="aside-menu">
        <Aside />
      </aside>
    </div>
    <Footer />
  </>;
};
export default {
  styles: [
    'https://unpkg.com/@coreui/coreui@2/dist/css/coreui.min.css'
  ],
  scripts:[
    'https://unpkg.com/jquery@3.4.1/dist/jquery.slim.min.js',
    'https://unpkg.com/popper.js@1.16.1/dist/umd/popper.min.js',
    'https://unpkg.com/bootstrap@4.4.1/dist/js/bootstrap.min.js',
    'https://unpkg.com/@coreui/coreui@2/dist/js/coreui.min.js'
  ],
  body_class: ['app', 'header-fixed', 'sidebar-fixed', 'aside-menu-fixed', 'sidebar-lg-show'],
  Layout
}
