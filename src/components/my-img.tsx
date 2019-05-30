import { app, Component } from 'apprun';
class Img extends Component {
  view = ({ src }) => <img src={src} />
}
app.webComponent('my-img', Img);