import app from 'apprun';
import router from './router';
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
