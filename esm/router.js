import app from 'apprun';
export default (root = '#') => {
    const route = (url, e) => {
        e && e.preventDefault();
        url = url.replace(/\/$/, "");
        url = url || root;
        if (!app.run(url))
            app.run(`${root}_404`);
    };
    if (root.startsWith('#'))
        app.on('///', () => app.run(`${root}_404`));
    if (root.startsWith('/')) {
        document.addEventListener("DOMContentLoaded", () => {
            window.onpopstate = () => route(location.pathname);
            route(location.pathname);
        });
        window.onclick = e => linkClick(e);
        const linkClick = e => {
            const menu = e.target;
            let url = menu.href;
            if (url && url.startsWith(document.location.origin)) {
                e.preventDefault();
                history.pushState(null, "", menu.pathname);
                route(menu.pathname);
            }
        };
    }
};
