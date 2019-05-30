import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => [{"tag":"h1","props":{"id":"apprun-site"},"children":["AppRun Site"]},"\n",{"tag":"p","props":{},"children":["Source code: ",{"tag":"a","props":{"href":"https://github.com/apprunjs/apprun-starter"},"children":["AppRun Starter"]}]},"\n"];
}