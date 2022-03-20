import { app, Component } from './apprun';
export default class HomeComponent extends Component {
  state = 'Home';

  view = state => <div>
    <h1>{state}</h1>
  </div>;

  update = {
    '#, #Home': state => state,
  };
}

export const Home = () => <HomeComponent/>;

