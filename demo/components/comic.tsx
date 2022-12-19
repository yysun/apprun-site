import { app, Component } from 'apprun';
export default class Comic extends Component {
  state = async () => {
    const response = await fetch('https://random.dog/woof.json');
    const comic = await response.json();
    return { comic };
  }
  view = state => state.comic ? <>
    <p>{state.comic.title}</p>
    <img style="width:100%" src={state.comic.url} />
  </> : `Loading...`;
}