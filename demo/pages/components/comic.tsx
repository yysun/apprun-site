import { app, Component } from 'apprun';
export default class Comic extends Component {
  state = async () => {
    const response = await fetch('/api/comic');
    return response.json();
  }

  view = ({ img }) => img ? <img src={img} /> : `Loading...`;
}