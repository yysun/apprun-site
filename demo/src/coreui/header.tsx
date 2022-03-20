import { app, Component } from '../apprun';

export default class extends Component {
  state = 'My App';

  view = (state) => <header class="app-header navbar">
    <button class="navbar-toggler sidebar-toggler d-lg-none mr-auto" type="button" data-toggle="sidebar-show">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="/">
      {state}
    </a>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" data-toggle="sidebar-lg-show">
      <span class="navbar-toggler-icon"></span>
    </button>
    <ul class="nav navbar-nav d-md-down-none">
      <li class="nav-item px-3"><a class="nav-link" href="/">Home</a></li>
      <li class="nav-item px-3"><a class="nav-link" href="/contact">Contact</a></li>
      <li class="nav-item px-3"><a class="nav-link" href="/about">About</a></li>
    </ul>
    <ul class="nav navbar-nav ml-auto"></ul>
    <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" data-toggle="aside-menu-lg-show">
      <span class="navbar-toggler-icon"></span>
    </button>
    <button class="navbar-toggler aside-menu-toggler d-lg-none" type="button" data-toggle="aside-menu-show">
      <span class="navbar-toggler-icon"></span>
    </button>
  </header>
}