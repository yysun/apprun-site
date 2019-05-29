import { app, Component } from 'apprun';

export default class extends Component {
  view = ({ src }) => {
    console.log(src);
    return <img src={...src} />
  }
}
