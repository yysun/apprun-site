import { app, Component } from 'apprun';

export default class extends Component {
  view = (state) => <>
    <h1>Web Component - tsx</h1>
    <div>web components used in component jsx view</div>
    <my-img src='/logo.png'></my-img>
  </>
}