import app from 'apprun';
/*--- router ---*/
const route = (url, e) => {
    e && e.preventDefault();
    url = url.replace(/\/$/, "");
    url = url || '/';
    if (!app.run(url))
        app.run('/_404');
};
document.addEventListener("DOMContentLoaded", () => {
    window.onpopstate = () => route(location.pathname);
    route(location.pathname);
});
const linkClick = e => {
    e.preventDefault();
    const menu = e.target;
    let url = menu.href;
    if (!url.endsWith('/'))
        url = url + '/';
    history.pushState(null, "", url);
    route(menu.pathname);
};
const fixAnchors = (selectors) => {
    document.querySelectorAll(selectors)
        .forEach((a) => {
        a.onclick = linkClick;
    });
};
app.on('//', (...rest) => {
    window.setTimeout(() => fixAnchors('a'));
});
/*--- ------ ---*/
const HTML = ({ element, url }) => {
    element.innerHTML = '<div></div>';
    fetch('/pages/' + url)
        .then(response => response.text())
        .then(html => element.innerHTML = html);
};
export const Link = ({ to, className }, children) => app.createElement("a", { class: className, href: "{to}", onclick: e => route(to, e) }, children);
export default {
    start: (config) => {
        app.render(document.body, app.createElement(config.layout, Object.assign({}, config)));
        const element = document.getElementById(config.element);
        config.pages.forEach(def => {
            const [e, Comp] = def;
            if (typeof Comp === 'string') {
                app.on(e, () => app.render(element, app.createElement(HTML, { element: element, url: Comp })));
            }
            else {
                const component = new Comp().mount(element);
                app.on(e, (...p) => component.run('.', ...p));
            }
        });
    }
};