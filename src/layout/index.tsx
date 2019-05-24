import app from 'apprun';

export default ({ name, nav, sidebar }) => <>
  <nav class="main-nav" markdown="0">
    <a class="nav-title" href="/">{name}</a>
      <div class="flex"></div>
      {nav.map(item => <a class="nav-item" href={item.link}>{item.text}</a>)}
      <input id="searchBox" type="search" class="search-box" placeholder="Search" aria-label="Search"/>
  </nav>
  <main class="wrapper">
    <nav class="side-nav">
      <button id="toggleNavButton">Menu</button>
        <ul>
        {sidebar.map(item => <li><a href={item.link}>{item.text}</a></li>)}
      </ul>
    </nav>
    <article id='main'>
    </article>
  </main>
  {/* <footer>
    <div class="wrapper">

    </div>
  </footer> */}
</>