import { app, Component } from 'apprun';

export default class extends Component {
  view = (state) => <>
    <div>web components in TSX</div>
    <my-img src='/logo.png'></my-img>
  </>
}