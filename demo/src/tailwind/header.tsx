import app from '../apprun';;

export default () => {
  const site_name = 'My Site';
  return <header>
    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
      {site_name}
    </h2>
  </header>
}