import app from 'apprun';

const route = (url, e?) => {
  e && e.preventDefault();
  app.run(url);
}

document.addEventListener("DOMContentLoaded", () => {
  window.onpopstate = () => route(location.pathname);
  route(location.pathname);
});


const linkClick = e => {
  e.preventDefault();
  const menu = e.target as HTMLAnchorElement
  history.pushState(null, "", menu.href)
  route(menu.pathname);
}

export const fixAnchors = (selectors: string) => {
  document.querySelectorAll(selectors)
    .forEach((a: HTMLAnchorElement) => {
      a.onclick = linkClick;
    });
}

app.on('//', (...rest) => {
  fixAnchors('a');
});

export default route;