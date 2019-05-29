import { app, Component } from 'apprun';

export default class extends Component {
  state = 'Home';

  view = (state) => <>
    <div>{state}</div>
    <my-img src='home/logo.png' />
  </>
}