import { app, Component } from 'apprun';

export default class extends Component {
  state = 'Calculator'

  view = state => <>
    <div>
      {state}
    </div>
  </>
}