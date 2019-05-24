import { app, Component } from 'apprun';

export default class extends Component {
  state = 'About Them';

  view = (state) => {
    return <h1>
      {state}
    </h1>
  }

  update = [
    ['.', state => state]
  ]
}