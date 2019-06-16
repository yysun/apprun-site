import app from 'apprun';
import router from './router';
export default (config) => {
    if (!config)
        config = { nav: [], pages: [], eventRoot: '/' };
    router(config);
    app.render(document.body, app.createElement(config.layout, Object.assign({}, config)));
    const element = document.getElementById(config.element);
    config.pages.forEach(def => {
        let [evt, name, imp] = def;
        app.on(evt, (...p) => {
            import(imp).then((module) => {
                const component = new module.default().mount(element);
                component.run('.', ...p);
            });
        });
    });
};
