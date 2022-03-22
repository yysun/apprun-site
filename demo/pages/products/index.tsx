import { app, Component } from '../../src/apprun';
export default class extends Component {
  state = {
    title: 'Products',
    query: ['1', '2', '3'],
  }
  view = state => <div>
    <h1>{state.title}</h1>
    <ul>
      {
        state.query.map(id => <li key={id}>
        <a class="nav-link" href={`/products/${id}`}>{id}</a>
          {state.id === id && <span class="ml-3 fa fa-check"></span>}
        </li>)
      }
    </ul>
  </div>;

  update = {
    '/products': (state, id) => ({ ...state, id })
  };
}
