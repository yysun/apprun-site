import app from 'apprun';
import router from './router';
export default {
    start: (config) => {
        router(config.eventRoot);
        app.render(document.body, app.createElement(config.layout, Object.assign({}, config)));
        const element = document.getElementById(config.element);
        config.pages.forEach(def => {
            const [e, Comp] = def;
            const component = new Comp().mount(element);
            app.on(e, (...p) => component.run('.', ...p));
        });
    }
};
