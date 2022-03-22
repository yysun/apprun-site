import { app, Component } from './apprun';
export default class HomeComponent extends Component {
  state = 'Home';
  view = state => <div>
    <h1>{state}</h1>
    <p>This is an AppRun component.</p>
  </div>;
}

