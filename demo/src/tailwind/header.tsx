import app from '../apprun';
import { title } from '../site.json';
export default () => <header>
  <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
    {title}
  </h2>
</header>