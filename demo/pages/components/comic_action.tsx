import { app, Component } from 'apprun';
import comic from '../../_/comic.js';
export default class Comic extends Component {
  state = comic;

  view = ({ img }) => img ? <img src={img} /> : `Loading...`;
}