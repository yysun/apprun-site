import app from 'apprun';
import Comic from '../../components/comic_api';
import Comic2 from '../../components/comic_action';

export default () => <>
  <p>This is a functional Component</p>
  <p>This is a Component that calls API</p>
  <Comic />

  <p>This is Component that calls server action</p>
  <Comic2 />
</>
