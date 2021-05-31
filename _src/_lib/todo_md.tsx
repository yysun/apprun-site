import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => `_html:<h1 id="todo">Todo</h1>
<ul>
<li>Plugin Support</li>
<li>Site Search</li>
<li>GraphQL</li>
</ul>
`;
}