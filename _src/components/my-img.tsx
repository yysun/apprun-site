import { app, Component, customElement } from 'apprun';

@customElement('my-img')
class Img extends Component {
  view = ({ src }) => <img src={src} />
}
