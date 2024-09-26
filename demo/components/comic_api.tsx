import { app, Component } from 'apprun';
export default class Comic extends Component {
  state = async () => {
    const response = await fetch('/api/comic');
    return response.json();
  }

  view = ({ img, alt }) => img ? <img src={img} alt={alt} /> : `Loading...`;
}