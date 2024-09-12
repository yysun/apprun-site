import { app, Component } from 'apprun';

const code = `import { app, Component } from 'apprun';
export default class extends Component {

  state = async () => {
    // fetch data from API
  }

  view = state => <></>;

  update = {
    // register route
    '/products': async (state, id) => {
    }
  };
`;

export default class extends Component {

  state = async () => {
    const url = '/api/products';
    const req = await fetch(url);
    const json = await req.json();
    return { products: json };
  }

  view = state => <div>
    <p>This is an AppRun component page that calls REST API.</p>
    <ul>
      {
        state.products &&
        state.products.map(({ id, name }) => <li key={id}>
          <a class="nav-link" href={`/products/${id}`}>{name}
            {state.id === id && <span class="fa fa-check"> - selected</span>}
          </a>
        </li>)
      }
    </ul>
    <p>It leverages AppRun features: async state, routing as events, pure function view and more. </p>
    <pre>
      <code>{code}</code>
    </pre>
    <div id="products-app"></div>
  </div>;

  update = {
    '/products': (state, id) => {
      if (id !== 'calculator') return ({ ...state, id: parseInt(id) })
      return state;
    }
  };
}
