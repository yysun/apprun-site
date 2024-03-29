import app from '../apprun';
import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';

app.on('//', (route) => {
  let menus = document.querySelectorAll('.sidebar a');
  for (let i = 0; i < menus.length; ++i) { menus[i].classList.remove('active'); }
  menus = document.querySelectorAll(`[href='${route}']`);
  for (let i = 0; i < menus.length; ++i) { menus[i].classList.add('active'); }
});

const main_element = 'my-app';

export const Layout = () => {
  return <div class="page">
    <Sidebar />
    <main class="main">
      <Header />
      <div class="content" id={main_element}></div>
      <Footer />
    </main>
  </div>
};
export default {
  styles: [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    '/style.css'
  ],
  Layout,
  main_element
}