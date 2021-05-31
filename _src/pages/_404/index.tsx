import { app, Component } from 'apprun';

export default class extends Component {
  state = '404';

  view = (state) => {
    return <div>
      {state}
    </div>
  }

  update = [
    ['.', state => state]
  ]
}