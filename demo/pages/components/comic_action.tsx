import { app, Component } from 'apprun';
import comic from '../../_/comic.js';
export default class Comic extends Component {
  state = comic;

  view = ({ img, alt }) => img ? <img src={img} alt={alt} /> : `Loading...`;
}