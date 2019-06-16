import app from 'apprun';
export default ({ eventRoot, pages }) => {
    const root = eventRoot || '/';
    const events = pages.map(p => {
        const event = p[0].replace(/^\/|\#/, '');
        return `${root}${event}/`;
    }).sort((a, b) => b.split('/').length - a.split('/').length);
    const route = (url, e) => {
        e && e.preventDefault();
        url = url.replace(/\/$/, "") + '/';
        let event = url;
        for (let i = 0; i < events.length; i++) {
            if (url.startsWith(events[i])) {
                event = events[i];
                break;
            }
        }
        const params = url.replace(event, '').split('/').filter(p => p.length > 0);
        event = event.replace(/\/$/, '').substring(root.length);
        event = root[0] + event;
        if (!app.run(event, ...params))
            app.run(`${root[0]}_404`);
    };
    app['route'] = route; // overwrite apprun's default router
    if (root.startsWith('#')) {
        document.addEventListener("DOMContentLoaded", () => {
            window.onpopstate = () => route(location.hash);
            route(location.hash);
        });
    }
    else if (root.startsWith('/')) {
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
