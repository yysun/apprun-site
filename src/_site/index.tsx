import app from 'apprun';
import router from './router';

export default {
  start: (config) => {
    if (!config) config = { nav: [], pages: [], eventRoot: '/' };
    router(config.eventRoot);
    config.layout && app.render(document.body, <config.layout {...config} />);
    const element = config.element || document.body;
    config.pages.forEach(def => {
      const [e, Comp] = def;
      const component = new Comp().mount(element);
      app.on(e, (...p) => component.run('.', ...p));
    });
  }
}
