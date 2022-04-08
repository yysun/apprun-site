import { app, Component } from 'apprun';
export default class Comic extends Component {
  state = async () => {
    const response = await fetch('https://xkcd-imgs.herokuapp.com/');
    const comic = await response.json();
    return { comic };
  }
  view = state => state.comic ? <>
    <p>{state.comic.title}</p>
    <img src={state.comic.url} />
  </> : `Loading...`;
}