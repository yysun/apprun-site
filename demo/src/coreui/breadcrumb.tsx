import { app, Component } from '../apprun';

export default class extends Component {
  state = 'bread crumb';

  view = () => <ol class="breadcrumb">
    <li class="breadcrumb-item">Home</li>
    <li class="breadcrumb-item active">Dashboard</li>
  </ol>

}