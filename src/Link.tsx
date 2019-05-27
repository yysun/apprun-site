import { app, ROUTER_EVENT } from 'apprun';

const route = (url, e) => {
  e.preventDefault();
  app.run(ROUTER_EVENT, url);
}

export default ({ to, className }, children) => <a class={className} href="{to}"
  onclick={ e=> route(to, e)}>
  {children}
</a>