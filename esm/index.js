import app from '/esm/_modules/apprun.js';
import router from '/esm/router.js';
export default {
    start: (config) => {
        if (!config)
            config = { nav: [], pages: [], eventRoot: '/' };
        router(config);
        config.layout && app.render(document.body, app.createElement(config.layout, Object.assign({}, config)));
        const element = config.element || document.body;
        config.pages.forEach(def => {
            const [e, Comp] = def;
            const component = new Comp().mount(element);
            app.on(e, (...p) => component.run('.', ...p));
        });
    }
};
