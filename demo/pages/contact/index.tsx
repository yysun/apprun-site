import { app, Component } from 'apprun';

export default class Contact extends Component {
  state = 'Contact'

  view = state => <>
    <div>
      {state}
    </div>
  </>

  update = {
  }
}

app.webComponent('my-contact', Contact);