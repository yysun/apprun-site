import { app, Component } from '../apprun';

export default class extends Component {

  view = ({sidebar}) => {
    return <ul ul class="nav">
      <li class="nav-title">Dashboard</li>
      <li class="nav-item"><a class="nav-link active" href="/">
        <i class="nav-icon icon-speedometer"></i> Dashboard <span class="badge badge-info">NEW</span></a></li>
      <li class="nav-title">Menus</li>
      {sidebar && sidebar.map(({text, link, icon}) =>
        <li class="nav-item">
          <a class="nav-link" href={link}>
            <i class={`nav-icon icon-${icon || 'drop'}`}></i>
            {text}
          </a>
        </li>
      )}
    </ul>
  }
}