import { app, Component } from 'apprun';

export default class extends Component {
  state = 'Home';

  view = (state) => <>
    <h1>{state}</h1>
    <div>web components in TSX</div>
    <my-img src='home/logo.png'></my-img>
  </>
}