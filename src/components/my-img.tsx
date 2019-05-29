import { app, Component } from 'apprun';

export default class extends Component {
  view = (_, props) => <img src={...props} />
}
