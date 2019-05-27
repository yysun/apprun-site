
import route from './route';
import app from 'apprun';

export default ({ to, className }, children) => <a class={className} href="{to}"
  onclick={e => route(to, e)}>
  {children}
</a>