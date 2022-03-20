import { app, Component } from '../apprun';

export default class extends Component {
  state = 'aside';

  view = (state) => {
    return <div>
      {state}
    </div>
  }

}