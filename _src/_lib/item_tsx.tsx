import { app, Component } from 'apprun';

export default class extends Component {
  view = state => <div>{state}</div>
  update = {
    '.': (state, id) => id
  }
}