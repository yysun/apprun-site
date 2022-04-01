
import app from '../apprun';

app.on('//', (route) => {
  const menus = document.querySelectorAll('.navbar-nav li');
  for (let i = 0; i < menus.length; ++i) { menus[i].classList.remove('active'); }
  const item = document.querySelector(`[href='${route}']`);
  item && item.parentElement.classList.add('active');
});

const main_element = 'my-app';

export const Layout = () => {
  return <div class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">My Site</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/">Home
              <span class="sr-only">(current)</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/about">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/contact">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container" id={main_element}></div>
  </div>;
};

export default {
  styles: [
    'https://unpkg.com/bootstrap@4.4.1/dist/css/bootstrap.min.css'
  ],
  scripts: [
    'https://unpkg.com/jquery@3.4.1/dist/jquery.slim.min.js',
    'https://unpkg.com/popper.js@1.16.1/dist/umd/popper.min.js',
    'https://unpkg.com/bootstrap@4.4.1/dist/js/bootstrap.min.js',
  ],
  Layout,
  main_element
}